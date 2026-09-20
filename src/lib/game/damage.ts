import { getItem } from "./content";
import type { CombatStats, HitResult, PlayerState } from "./types";

/** Suma bazowych parametrów bohatera i premii aktywnie wyposażonych przedmiotów. */
export function getPlayerCombatStats(player: PlayerState): CombatStats {
    const stats: CombatStats = { ...player.baseStats, health: player.health };
    for (const itemId of player.equipped) {
        const bonus = getItem(itemId)?.bonus;
        if (!bonus) continue;
        stats.maxHealth += bonus.maxHealth ?? 0;
        stats.power += bonus.power ?? 0;
        stats.armor += bonus.armor ?? 0;
        stats.agility += bonus.agility ?? 0;
        stats.luck += bonus.luck ?? 0;
    }
    stats.health = Math.min(stats.health, stats.maxHealth);
    return stats;
}

/** Oblicza obrażenia osobno od pętli gry: moc + premia, pancerz celu, unik i krytyk. */
export function calculateDamage(attacker: CombatStats, defender: CombatStats, random: () => number = Math.random): HitResult {
    const dodgeChance = Math.min(0.32, Math.max(0, (defender.agility - attacker.agility * 0.35) / 180));
    if (random() < dodgeChance) return { damage: 0, critical: false, dodged: true };

    const critical = random() < Math.min(0.35, 0.05 + attacker.luck / 220);
    const variance = 0.9 + random() * 0.2;
    const rawDamage = attacker.power * variance * (critical ? 1.65 : 1);
    return { damage: Math.max(1, Math.round(rawDamage - defender.armor * 0.58)), critical, dodged: false };
}
