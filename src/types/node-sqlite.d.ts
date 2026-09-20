declare module "node:sqlite" {
    export interface StatementSync {
        get(...parameters: unknown[]): unknown;
        run(...parameters: unknown[]): { lastInsertRowid: number | bigint; changes: number };
    }
    export class DatabaseSync {
        constructor(path: string);
        exec(sql: string): void;
        prepare(sql: string): StatementSync;
    }
}
