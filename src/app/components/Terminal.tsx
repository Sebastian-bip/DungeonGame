"use client";

import { useEffect, useRef, useState } from "react";
import { CLASS_LABELS, getItem, ITEMS, SHOP_ITEM_IDS } from "@/lib/game/content";
import { getPlayerCombatStats } from "@/lib/game/damage";
import { advanceRoom, attack, buyItem, consumeItem, createNewGame, leaveShop, resolveEvent, upgradeStat } from "@/lib/game/engine";
import type { GameState, HeroClass } from "@/lib/game/types";

const HELP = [
    "KONTO",
    "register <nazwa> <hasło>  — tworzy konto i loguje",
    "login <nazwa> <hasło>     — loguje do istniejącego konta",
    "logout                    — kończy sesję",
    "save / load               — szybki zapis / odczyt z serwera",
    "",
    "WYPRAWA",
    "new mage|bandit|knight    — nowa wyprawa (mag, bandyta, rycerz)",
    "attack                   — atak w walce",
    "next                     — przejście do następnego pokoju",
    "use healing_potion       — użycie mikstury",
    "shop / buy <id> / leave  — oferta kupca, zakup, wyjście",
    "event enter|leave        — wybór w rzadkim wydarzeniu",
    "upgrade power|armor|agility|luck|health — wydaj punkt rozwoju",
    "status / stats / clear / help",
].join("\n");

export default function Terminal(): React.ReactElement {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<string[]>([
        "══════════════════════════════════════════════════",
        "               DUNGEON: ECHOES BELOW",
        "══════════════════════════════════════════════════",
        "Zaloguj się przez „register” lub „login”. Wpisz „help”.",
        "",
    ]);
    const [username, setUsername] = useState<string | null>(null);
    const game = useRef<GameState | null>(null);
    const terminalEnd = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEnd.current?.scrollIntoView({ block: "end" });
    }, [history]);

    useEffect(() => {
        void fetch("/api/auth/me")
            .then((response) => response.json() as Promise<{ username?: string | null }>)
            .then((data) => setUsername(data.username ?? null))
            .catch(() => undefined);
    }, []);

    function logCommand(command: string, result: string): void {
        setHistory((previous) => [...previous, `> ${command}`, ...result.split("\n")]);
    }

    function setGame(next: GameState): string {
        game.current = next;
        return next.log.slice(-3).join("\n");
    }

    async function execute(raw: string): Promise<string> {
        const [command = "", ...argumentsList] = raw.trim().split(/\s+/);
        const cmd = command.toLowerCase();
        const argument = argumentsList.join(" ").toLowerCase();

        if (cmd === "help") return HELP;
        if (cmd === "status") return formatStatus(game.current);
        if (cmd === "stats") return formatStats(game.current);
        if (cmd === "shop") return formatShop(game.current);
        if (cmd === "clear") return "";

        if (cmd === "register" || cmd === "login") {
            const accountName = argumentsList[0] ?? "";
            const password = argumentsList.slice(1).join(" ");
            if (!accountName || !password) return `Użycie: ${cmd} <nazwa> <hasło>`;
            const response = await fetch(`/api/auth/${cmd}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: accountName, password }) });
            const data = await response.json() as { username?: string; error?: string };
            if (!response.ok || !data.username) return data.error ?? "Operacja konta nie powiodła się.";
            setUsername(data.username);
            return `${cmd === "register" ? "Utworzono konto" : "Zalogowano"}: ${data.username}. Możesz rozpocząć „new mage”, „new bandit” lub „new knight”.`;
        }

        if (cmd === "logout") {
            await fetch("/api/auth/logout", { method: "POST" });
            setUsername(null);
            game.current = null;
            return "Wylogowano. Lokalna wyprawa została zamknięta.";
        }

        if (cmd === "new" || cmd === "start") {
            if (!username) return "Najpierw załóż konto lub zaloguj się — wtedy zapis będzie przypisany do Ciebie.";
            if (!isHeroClass(argument)) return "Wybierz klasę: new mage, new bandit albo new knight.";
            return setGame(createNewGame(username, argument));
        }

        if (cmd === "save") return saveGame();
        if (cmd === "load") return loadGame();

        if (!game.current) return "Nie ma aktywnej wyprawy. Użyj „new <klasa>” po zalogowaniu.";
        if (cmd === "attack") return setGame(attack(game.current));
        if (cmd === "next") return setGame(advanceRoom(game.current));
        if (cmd === "use") return setGame(consumeItem(game.current, argument));
        if (cmd === "buy") return setGame(buyItem(game.current, argument));
        if (cmd === "leave") return setGame(leaveShop(game.current));
        if (cmd === "event" && (argument === "enter" || argument === "leave")) return setGame(resolveEvent(game.current, argument));
        if (cmd === "upgrade" && isUpgrade(argument)) return setGame(upgradeStat(game.current, argument));

        return "Nieznana lub niedostępna komenda. Wpisz „help”.";
    }

    async function saveGame(): Promise<string> {
        if (!game.current) return "Nie ma czego zapisać.";
        const response = await fetch("/api/game/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: game.current }) });
        const data = await response.json() as { error?: string };
        return response.ok ? "Zapisano wyprawę na serwerze." : (data.error ?? "Zapis nie powiódł się.");
    }

    async function loadGame(): Promise<string> {
        const response = await fetch("/api/game/load");
        const data = await response.json() as { state?: GameState | null; error?: string; updatedAt?: string };
        if (!response.ok) return data.error ?? "Nie udało się wczytać zapisu.";
        if (!data.state) return "To konto nie ma jeszcze zapisu.";
        game.current = data.state;
        return `Wczytano zapis${data.updatedAt ? ` (${data.updatedAt})` : ""}.\n${formatStatus(game.current)}`;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const command = input.trim();
        if (!command) return;
        setInput("");
        if (command.toLowerCase() === "clear") {
            setHistory([]);
            return;
        }
        const result = await execute(command);
        logCommand(command, result);
    }

    return (
        <main className="min-h-screen bg-[#07110c] px-4 py-6 font-mono text-emerald-200 sm:p-8">
            <section className="mx-auto flex min-h-[min(720px,calc(100vh-3rem))] max-w-5xl flex-col rounded-xl border border-emerald-800 bg-[#09150e] p-4 shadow-2xl shadow-black/50 sm:p-6">
                <header className="mb-4 flex items-center justify-between border-b border-emerald-900 pb-3 text-xs text-emerald-500"><span>TERMINAL RPG v0.2</span><span>{username ? `SESJA: ${username}` : "GOŚĆ — BRAK SESJI"}</span></header>
                <div className="flex-1 whitespace-pre-wrap break-words leading-6" aria-live="polite">
                    {history.map((line, index) => <div key={`${index}-${line}`}>{line || "\u00a0"}</div>)}
                    <div ref={terminalEnd} />
                </div>
                <form onSubmit={handleSubmit} className="mt-4 flex border-t border-emerald-900 pt-4">
                    <span className="mr-2 text-emerald-500">›</span>
                    <input aria-label="Komenda gry" autoFocus autoComplete="off" value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent text-emerald-100 caret-emerald-400 outline-none" />
                    <button type="submit" className="ml-2 rounded border border-emerald-800 px-2 text-xs text-emerald-400 hover:bg-emerald-950">Wykonaj</button>
                </form>
            </section>
        </main>
    );
}

function isHeroClass(value: string): value is HeroClass { return value === "mage" || value === "bandit" || value === "knight"; }
function isUpgrade(value: string): value is "power" | "armor" | "agility" | "luck" | "health" { return ["power", "armor", "agility", "luck", "health"].includes(value); }

function formatStatus(state: GameState | null): string {
    if (!state) return "Brak aktywnej wyprawy.";
    const player = getPlayerCombatStats(state.player);
    const base = `Pokój ${state.room.number}/20: ${state.room.title}\n${state.room.description}\nHP ${player.health}/${player.maxHealth} | złoto ${state.player.gold} | faza: ${phaseLabel(state.phase)}`;
    if (state.enemy) return `${base}\nWróg: ${state.enemy.name} — ${state.enemy.stats.health}/${state.enemy.stats.maxHealth} HP. Użyj „attack”.`;
    return `${base}\n${state.phase === "awaiting_next" ? "Użyj „next”, aby ruszyć dalej." : state.log.slice(-1)[0] ?? ""}`;
}

function formatStats(state: GameState | null): string {
    if (!state) return "Brak postaci.";
    const stats = getPlayerCombatStats(state.player);
    const equipped = state.player.equipped.map((id) => getItem(id)?.name ?? id).join(", ") || "brak";
    const inventory = Object.entries(state.player.inventory).map(([id, count]) => `${getItem(id)?.name ?? id} ×${count}`).join(", ") || "pusto";
    return [`${state.player.name} — ${CLASS_LABELS[state.player.heroClass]}`, `Poziom ${state.player.level} | XP ${state.player.experience}/${state.player.experienceToLevel} | punkty: ${state.player.unspentPoints}`, `HP ${stats.health}/${stats.maxHealth} | moc ${stats.power} | pancerz ${stats.armor} | zwinność ${stats.agility} | szczęście ${stats.luck}`, `Wyposażone: ${equipped}`, `Plecak: ${inventory}`].join("\n");
}

function formatShop(state: GameState | null): string {
    if (!state || state.phase !== "shop") return "Nie jesteś teraz w sklepie.";
    return [`Złoto: ${state.player.gold}`, "Towary (kup <id>):", ...SHOP_ITEM_IDS.map((id) => { const item = ITEMS.find((candidate) => candidate.id === id); return item ? `- ${item.id}: ${item.name} — ${item.price} zł. (${item.description})` : ""; }), "Użyj „leave”, aby wyjść."].join("\n");
}

function phaseLabel(phase: GameState["phase"]): string { return ({ combat: "walka", shop: "sklep", event: "wydarzenie", awaiting_next: "droga wolna", completed: "zwycięstwo", game_over: "porażka" })[phase]; }
