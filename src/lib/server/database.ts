import "server-only";
import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let schemaPromise: Promise<void> | null = null;

const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS game_saves (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        state_json TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`;

/** Zwraca współdzielone połączenie Turso i upewnia się, że schemat istnieje. */
export async function getDatabase(): Promise<Client> {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) {
        throw new Error("Brak TURSO_DATABASE_URL lub TURSO_AUTH_TOKEN w zmiennych środowiskowych.");
    }

    client ??= createClient({ url, authToken });
    schemaPromise ??= client.executeMultiple(schema);
    await schemaPromise;
    return client;
}
