import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getDatabase } from "./database";

export const SESSION_COOKIE = "terminal_rpg_session";
const SESSION_LIFETIME_MS = 1000 * 60 * 60 * 24 * 14;

interface UserRow {
    id: number | bigint;
    username: string;
    password_hash: string;
}

export function validateCredentials(username: string, password: string): string | null {
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) return "Nazwa użytkownika musi mieć 3–20 znaków: litery, cyfry, _ lub -.";
    if (password.length < 8 || password.length > 128) return "Hasło musi mieć od 8 do 128 znaków.";
    return null;
}

export async function registerUser(username: string, password: string): Promise<{ id: number; username: string } | null> {
    const passwordHash = hashPassword(password);
    try {
        const database = await getDatabase();
        const result = await database.execute({ sql: "INSERT INTO users (username, password_hash) VALUES (?, ?)", args: [username, passwordHash] });
        return { id: Number(result.lastInsertRowid), username };
    } catch {
        return null;
    }
}

export async function verifyUser(username: string, password: string): Promise<{ id: number; username: string } | null> {
    const database = await getDatabase();
    const result = await database.execute({ sql: "SELECT id, username, password_hash FROM users WHERE username = ?", args: [username] });
    const user = result.rows[0] as unknown as UserRow | undefined;
    if (!user || !verifyPassword(password, user.password_hash)) return null;
    return { id: Number(user.id), username: String(user.username) };
}

export async function createSession(userId: number): Promise<string> {
    const token = randomBytes(32).toString("hex");
    const database = await getDatabase();
    await database.execute({ sql: "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)", args: [token, userId, Date.now() + SESSION_LIFETIME_MS] });
    return token;
}

export async function getSessionUser(): Promise<{ id: number; username: string } | null> {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const database = await getDatabase();
    const result = await database.execute({ sql: "SELECT users.id, users.username FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = ? AND sessions.expires_at > ?", args: [token, Date.now()] });
    const row = result.rows[0] as unknown as { id: number | bigint; username: string } | undefined;
    return row ? { id: Number(row.id), username: String(row.username) } : null;
}

export async function setSessionCookie(token: string): Promise<void> {
    (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_LIFETIME_MS / 1000 });
}

export async function clearSession(): Promise<void> {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) {
        const database = await getDatabase();
        await database.execute({ sql: "DELETE FROM sessions WHERE token = ?", args: [token] });
    }
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
