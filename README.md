# Dungeon: Echoes Below

Terminalowe RPG zbudowane w Next.js. Wyprawa obejmuje 20 kolejnych komnat: walki, elitę, sklepy, ogniska, skarbce, kaplice, rzadkie wydarzenia i finałowego bossa.

## Uruchomienie

Wymagany jest Node.js 22.5+ (projekt korzysta z wbudowanego `node:sqlite`; zalecany jest Node 24).

```bash
npm run dev
```

Przy pierwszej operacji konta automatycznie powstanie `data/terminal-rpg.sqlite`. Katalog `data/` jest lokalnym magazynem zapisów i nie powinien trafiać do repozytorium.

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
