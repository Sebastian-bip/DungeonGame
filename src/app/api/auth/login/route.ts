import { NextResponse } from "next/server";
import { createSession, setSessionCookie, verifyUser } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json().catch(() => null) as { username?: unknown; password?: unknown } | null;
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const user = verifyUser(username, password);
    if (!user) return NextResponse.json({ error: "Nieprawidłowa nazwa użytkownika lub hasło." }, { status: 401 });
    await setSessionCookie(createSession(user.id));
    return NextResponse.json({ username: user.username });
}
