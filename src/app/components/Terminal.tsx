"use client";

import { useRef, useState } from "react";
import { GameLoop } from "@/app/components/GameEngine/GameLoop";
import { PlayerStatsInfo } from "@/app/components/GameEngine/PlayerSats";
import type { GameState } from "@/app/components/types";

const HELP_TEXT = [
    "Dostępne komendy:",
    "start          - rozpoczyna nową wyprawę",
    "status         - pokazuje bieżący pokój i przeciwnika",
    "attack         - atakuje przeciwnika",
    "potion         - używa mikstury leczenia",
    "exit 1 / exit 2 - wybiera kolejne przejście",
    "stats          - pokazuje statystyki postaci",
    "clear          - czyści terminal"
].join("\n");

export default function Terminal() {
    const gameLoop = useRef(new GameLoop());
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<string[]>([
        "================================",
        "          TERMINAL RPG",
        "================================",
        "",
        "Wpisz 'start', aby rozpocząć grę, lub 'help' po listę komend.",
        ""
    ]);

    function executeCommand(command: string): string {
        const cmd = command.trim().toLowerCase();

        if (cmd === "help") {
            return HELP_TEXT;
        }

        if (cmd === "start") {
            const state = gameLoop.current.startGame();
            return `Wyprawa rozpoczęta.\n${formatStatus(state)}`;
        }

        if (cmd === "status") {
            return formatStatus(gameLoop.current.getState());
        }

        if (cmd === "stats") {
            return PlayerStatsInfo(gameLoop.current.getState().player);
        }

        if (cmd === "attack") {
            return attackEnemy();
        }

        if (cmd === "potion") {
            return drinkPotion();
        }

        const exitMatch = cmd.match(/^exit\s+([12])$/);
        if (exitMatch) {
            return chooseExit(Number(exitMatch[1]) - 1);
        }

        if (cmd === "clear" || cmd === "") {
            return "";
        }

        return `Nieznana komenda: ${cmd}\nWpisz 'help' aby zobaczyć dostępne komendy.`;
    }

    function attackEnemy(): string {
        const before = gameLoop.current.getState();
        if (before.gameStatus !== "combat" || !before.currentEnemy) {
            return "Nie ma teraz przeciwnika do zaatakowania.";
        }

        const beforeEnemyHealth = before.currentEnemy.identity.stats.HealthStats.health;
        const beforePlayerHealth = before.player.identity.stats.HealthStats.health;
        const after = gameLoop.current.attack();

        if (after.gameStatus === "game_over") {
            return "Przeciwnik zadał decydujący cios. Koniec gry — wpisz 'start', aby spróbować ponownie.";
        }

        if (!after.currentEnemy) {
            return `Pokonano ${before.currentEnemy.identity.idName}! Zdobywasz nagrody.\n${formatStatus(after)}`;
        }

        const enemyDamage = beforeEnemyHealth - after.currentEnemy.identity.stats.HealthStats.health;
        const playerDamage = beforePlayerHealth - after.player.identity.stats.HealthStats.health;
        return [
            enemyDamage > 0 ? `Zadajesz ${enemyDamage} obrażeń.` : "Przeciwnik uniknął ataku.",
            playerDamage > 0 ? `Otrzymujesz ${playerDamage} obrażeń.` : "Unikasz kontrataku.",
            `Twoje zdrowie: ${after.player.identity.stats.HealthStats.health}/${after.player.identity.stats.HealthStats.maxHealth}`,
            `Zdrowie wroga: ${after.currentEnemy.identity.stats.HealthStats.health}/${after.currentEnemy.identity.stats.HealthStats.maxHealth}`
        ].join("\n");
    }

    function drinkPotion(): string {
        const before = gameLoop.current.getState();
        const after = gameLoop.current.useHealingPotion();

        if (before.player.items.indexOf("Healing Potion") === -1) {
            return "Nie masz mikstury leczenia.";
        }

        if (before.player.identity.stats.HealthStats.health === before.player.identity.stats.HealthStats.maxHealth) {
            return "Masz pełne zdrowie — mikstura nie została zużyta.";
        }

        if (before.gameStatus === "game_over") {
            return "Po zakończeniu gry nie można używać przedmiotów.";
        }

        return `Użyto mikstury. Zdrowie: ${after.player.identity.stats.HealthStats.health}/${after.player.identity.stats.HealthStats.maxHealth}.`;
    }

    function chooseExit(index: number): string {
        const before = gameLoop.current.getState();
        if (before.gameStatus !== "choosing_exit") {
            return "Nie możesz teraz wybrać przejścia.";
        }

        const after = gameLoop.current.chooseExit(index);
        return `Wybierasz przejście ${index + 1}.\n${formatStatus(after)}`;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        const command = input.trim();

        if (command.toLowerCase() === "clear") {
            setHistory([]);
            setInput("");
            return;
        }

        const result = executeCommand(command);
        if (command !== "") {
            setHistory((previous) => [...previous, `> ${command}`, ...result.split("\n")]);
        }

        setInput("");
    }

    return (
        <main className="min-h-screen bg-black p-6 font-mono text-green-400">
            <div className="mx-auto min-h-[500px] max-w-4xl rounded-lg border border-green-700 p-5 shadow-lg shadow-green-900/20">
                <div className="text-left" aria-live="polite">
                    {history.map((line, index) => (
                        <div key={`${index}-${line}`} className="whitespace-pre-wrap">
                            {line}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex">
                    <span className="mr-2 text-green-500">&gt;</span>
                    <input
                        aria-label="Komenda gry"
                        autoFocus
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        className="flex-1 bg-transparent text-green-400 caret-green-400 outline-none"
                    />
                </form>
            </div>
        </main>
    );
}

function formatStatus(state: GameState): string {
    if (state.gameStatus === "menu") {
        return "Gra nie została jeszcze rozpoczęta.";
    }

    if (state.gameStatus === "game_over") {
        return "Koniec gry.";
    }

    const room = state.currentRoom;
    if (!room) {
        return "Brak aktywnego pokoju.";
    }

    const roomInfo = `Pokój ${state.roomNumber}: ${room.name}${room.description ? ` — ${room.description}` : ""}`;
    if (state.currentEnemy) {
        const enemy = state.currentEnemy;
        return `${roomInfo}\nPrzeciwnik: ${enemy.identity.idName} (${enemy.identity.stats.HealthStats.health}/${enemy.identity.stats.HealthStats.maxHealth} HP). Użyj 'attack'.`;
    }

    if (state.availableExits.length > 0) {
        const exits = state.availableExits
            .map((exit, index) => `${index + 1}. ${exit.room.name} [${exit.risk === "safe" ? "bezpieczne" : "ryzykowne"}]`)
            .join(" | ");
        return `${roomInfo}\nWybierz przejście: ${exits}. Użyj 'exit 1' albo 'exit 2'.`;
    }

    return roomInfo;
}
