import { NextResponse } from "next/server";
import { createSession, registerUser, setSessionCookie, validateCredentials } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json().catch(() => null) as { username?: unknown; password?: unknown } | null;
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const error = validateCredentials(username, password);
    if (error) return NextResponse.json({ error }, { status: 400 });
    const user = registerUser(username, password);
    if (!user) return NextResponse.json({ error: "Ta nazwa użytkownika jest już zajęta." }, { status: 409 });
    await setSessionCookie(createSession(user.id));
    return NextResponse.json({ username: user.username });
}
