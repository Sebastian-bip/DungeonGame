import { PlayerState } from "../entitis/entitis";

export function PlayerStatsInfo(): string {
    return [
        `Stan: ${PlayerState.identity.idName}  `,
        `Zdrowie: ${PlayerState.identity.stats.HealthStats.health}`,
        `Atak: ${PlayerState.identity.stats.dmg}`,
        `Obrona: ${PlayerState.identity.stats.defence}`,
        `Szybkość: ${PlayerState.identity.stats.speed}`,
        `Unikliwość: ${PlayerState.identity.stats.evasion}`,
        `Złoto: ${PlayerState.gold}`,
        `Poziom: ${PlayerState.level.level}`,
        `Przedmioty: ${PlayerState.items.join(", ")}`
    ].join("\n");
}