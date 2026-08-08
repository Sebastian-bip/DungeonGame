import type { Player, Stats } from "../types";
import { items } from "../entitis/items";

export function calculatePlayerStats(player: Player): Stats {
    const currentHealth = Math.min(
        player.identity.stats.HealthStats.health,
        player.identity.stats.HealthStats.maxHealth
    );

    const stats: Stats = {
        baseDmg: player.identity.stats.baseDmg,
        dmg: player.identity.stats.baseDmg,
        baseDefence: player.identity.stats.baseDefence,
        defence: player.identity.stats.baseDefence,
        baseSpeed: player.identity.stats.baseSpeed,
        speed: player.identity.stats.baseSpeed,
        baseEvasion: player.identity.stats.baseEvasion,
        evasion: player.identity.stats.baseEvasion,
        HealthStats: {
            maxHealth: player.identity.stats.HealthStats.maxHealth,
            health: currentHealth
        }
    };

    for (const itemId of player.items) {
        const item = items.find((candidate) => candidate.idName === itemId);

        if (item?.usage === "BoostSpeed") {
            stats.speed += 2;
        }
    }

    return stats;
}
