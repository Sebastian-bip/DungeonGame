import { NextResponse } from "next/server";
import type { GameState } from "@/lib/game/types";
import { getSessionUser } from "@/lib/server/auth";
import { getDatabase } from "@/lib/server/database";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Zaloguj się, aby zapisać grę." }, { status: 401 });
    const body = await request.json().catch(() => null) as { state?: unknown } | null;
    if (!isGameState(body?.state)) return NextResponse.json({ error: "Nieprawidłowy stan gry." }, { status: 400 });
    const json = JSON.stringify(body.state);
    if (json.length > 100_000) return NextResponse.json({ error: "Zapis gry jest zbyt duży." }, { status: 413 });
    const database = await getDatabase();
    await database.execute({ sql: "INSERT INTO game_saves (user_id, state_json, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(user_id) DO UPDATE SET state_json = excluded.state_json, updated_at = CURRENT_TIMESTAMP", args: [user.id, json] });
    return NextResponse.json({ saved: true });
}

function isGameState(value: unknown): value is GameState {
    if (!value || typeof value !== "object") return false;
    const state = value as Partial<GameState>;
    return state.version === 1 && !!state.player && !!state.room && typeof state.player === "object" && typeof state.room === "object";
}
