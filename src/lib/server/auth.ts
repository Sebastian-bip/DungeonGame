import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { database } from "./database";

export const SESSION_COOKIE = "terminal_rpg_session";
const SESSION_LIFETIME_MS = 1000 * 60 * 60 * 24 * 14;

interface UserRow {
    id: number;
    username: string;
    password_hash: string;
}

export function validateCredentials(username: string, password: string): string | null {
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) return "Nazwa użytkownika musi mieć 3–20 znaków: litery, cyfry, _ lub -.";
    if (password.length < 8 || password.length > 128) return "Hasło musi mieć od 8 do 128 znaków.";
    return null;
}

export function registerUser(username: string, password: string): { id: number; username: string } | null {
    const passwordHash = hashPassword(password);
    try {
        const result = database.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username, passwordHash);
        return { id: Number(result.lastInsertRowid), username };
    } catch {
        return null;
    }
}

export function verifyUser(username: string, password: string): { id: number; username: string } | null {
    const user = database.prepare("SELECT id, username, password_hash FROM users WHERE username = ?").get(username) as UserRow | undefined;
    if (!user || !verifyPassword(password, user.password_hash)) return null;
    return { id: user.id, username: user.username };
}

export function createSession(userId: number): string {
    const token = randomBytes(32).toString("hex");
    database.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(token, userId, Date.now() + SESSION_LIFETIME_MS);
    return token;
}

export async function getSessionUser(): Promise<{ id: number; username: string } | null> {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const row = database.prepare(`SELECT users.id, users.username FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = ? AND sessions.expires_at > ?`).get(token, Date.now()) as { id: number; username: string } | undefined;
    return row ?? null;
}

export async function setSessionCookie(token: string): Promise<void> {
    (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_LIFETIME_MS / 1000 });
}

export async function clearSession(): Promise<void> {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) database.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    (await cookies()).delete(SESSION_COOKIE);
}

function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyPassword(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, "hex");
    const actual = scryptSync(password, salt, 64);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
}
