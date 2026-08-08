import type { Enemy, RarityType } from "../types";
import { Enemies } from "../entitis/entitis";
import { EnemyRarityConfig } from "../entitis/EnemyRarityConfig";

export function generateEnemy(roomNumber: number): Enemy {
    const rarity = getEnemyRarity(roomNumber);
    const matchingEnemies = Enemies.filter((enemy) => enemy.rarity === rarity);
    const pool = matchingEnemies.length > 0 ? matchingEnemies : Enemies;

    if (pool.length === 0) {
        throw new Error("Nie skonfigurowano żadnych przeciwników.");
    }

    const template = pool[Math.floor(Math.random() * pool.length)];
    const enemy = createEnemyInstance(template);
    const scale = 1 + Math.floor((roomNumber - 1) / 5) * 0.15;

    enemy.identity.stats.baseDmg = Math.round(enemy.identity.stats.baseDmg * scale);
    enemy.identity.stats.dmg = enemy.identity.stats.baseDmg;
    enemy.identity.stats.HealthStats.maxHealth = Math.round(
        enemy.identity.stats.HealthStats.maxHealth * scale
    );
    enemy.identity.stats.HealthStats.health = enemy.identity.stats.HealthStats.maxHealth;

    return enemy;
}

function getEnemyRarity(roomNumber: number): RarityType {
    const stage = EnemyRarityConfig.find(
        (candidate) => roomNumber >= candidate.minRoom && roomNumber <= candidate.maxRoom
    ) ?? EnemyRarityConfig[EnemyRarityConfig.length - 1];

    const rarities = Object.entries(stage.rarities).filter(
        ([rarity, weight]) => weight > 0 && Enemies.some((enemy) => enemy.rarity === rarity)
    ) as [RarityType, number][];

    if (rarities.length === 0) {
        return Enemies[0]?.rarity ?? "common";
    }

    const totalWeight = rarities.reduce((total, [, weight]) => total + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [rarity, weight] of rarities) {
        random -= weight;
        if (random <= 0) {
            return rarity;
        }
    }

    return rarities[0][0];
}

function createEnemyInstance(enemy: Enemy): Enemy {
    return {
        ...enemy,
        identity: {
            ...enemy.identity,
            stats: {
                ...enemy.identity.stats,
                HealthStats: {
                    ...enemy.identity.stats.HealthStats,
                    health: enemy.identity.stats.HealthStats.maxHealth
                }
            }
        },
        loot: [...enemy.loot]
    };
}
