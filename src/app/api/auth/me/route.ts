import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
    const user = await getSessionUser();
    return NextResponse.json({ username: user?.username ?? null });
}
