# Dungeon: Echoes Below

Terminalowe RPG zbudowane w Next.js. Wyprawa obejmuje 20 kolejnych komnat: walki, elitę, sklepy, ogniska, skarbce, kaplice, rzadkie wydarzenia i finałowego bossa.

## Uruchomienie

Wymagany jest Node.js 20.9+ oraz skonfigurowane zmienne Turso: `TURSO_DATABASE_URL` i `TURSO_AUTH_TOKEN` w `.env.local` lokalnie lub w konfiguracji zmiennych środowiskowych hostingu.

```bash
npm run dev
```

Przy pierwszej operacji konta aplikacja automatycznie tworzy tabele na bazie Turso. Token dostępu nie powinien trafiać do Git ani do kodu klienckiego.

## Najważniejsze komendy

```text
register <nazwa> <hasło>
login <nazwa> <hasło>
new mage|bandit|knight
attack / next / status / stats
shop / buy <id> / leave
save / load
```

`save` zapisuje cały stan aktywnej wyprawy na serwerze SQLite dla zalogowanego konta. Hasła są przechowywane jako hash scrypt, a sesja jest identyfikowana przez ciasteczko HTTP-only.
