import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { getDatabase } from "@/lib/server/database";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Zaloguj się, aby wczytać grę." }, { status: 401 });
    const database = await getDatabase();
    const result = await database.execute({ sql: "SELECT state_json, updated_at FROM game_saves WHERE user_id = ?", args: [user.id] });
    const row = result.rows[0] as unknown as { state_json: string; updated_at: string } | undefined;
    if (!row) return NextResponse.json({ state: null });
    try {
        return NextResponse.json({ state: JSON.parse(row.state_json), updatedAt: row.updated_at });
    } catch {
        return NextResponse.json({ error: "Zapis gry jest uszkodzony." }, { status: 500 });
    }
}
