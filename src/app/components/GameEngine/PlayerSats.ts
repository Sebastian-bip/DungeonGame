import type { Player } from "../types";

export function PlayerStatsInfo(player: Player): string {
    const { stats } = player.identity;

    return [
        `Postać: ${player.identity.idName}`,
        `Zdrowie: ${stats.HealthStats.health}/${stats.HealthStats.maxHealth}`,
        `Atak: ${stats.dmg}`,
        `Obrona: ${stats.defence}`,
        `Szybkość: ${stats.speed}`,
        `Unik: ${stats.evasion}%`,
        `Złoto: ${player.gold}`,
        `Poziom: ${player.level.level} (${player.level.exp}/${player.level.nextLevelExp} EXP)`,
        `Przedmioty: ${player.items.length > 0 ? player.items.join(", ") : "brak"}`
    ].join("\n");
}
