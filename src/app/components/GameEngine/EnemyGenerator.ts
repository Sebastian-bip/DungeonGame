import type { Enemy } from "../types";
import { Enemies } from "../entitis/entitis";
import { EnemyRarityConfig } from "../entitis/EnemyRarityConfig";
import { RarityType } from "../types";


export function generateEnemy(roomNumber: number): Enemy {

    const rarity = getEnemyRarity(roomNumber);

    const availableEnemies = Enemies.filter(
        enemy => enemy.rarity === rarity
    );


    if (availableEnemies.length === 0) {

        throw new Error(
            `Brak przeciwników o rzadkości: ${rarity}`
        );

    }


    const enemyTemplate =
        getRandomEnemy(availableEnemies);


    return createEnemyInstance(enemyTemplate);
}
function getEnemyRarity(
    roomNumber: number
): RarityType {

    const stage = EnemyRarityConfig.find(
        stage =>
            roomNumber >= stage.minRoom &&
            roomNumber <= stage.maxRoom
    );


    if (!stage) {

        throw new Error(
            `Brak konfiguracji rzadkości dla pokoju ${roomNumber}`
        );

    }


    const rarities = Object.entries(
        stage.rarities
    ) as [RarityType, number][];


    const totalWeight = rarities.reduce(
        (total, [, weight]) =>
            total + weight,
        0
    );


    let random = Math.random() * totalWeight;


    for (const [rarity, weight] of rarities) {

        random -= weight;


        if (random <= 0) {
            return rarity;
        }

    }


    return rarities[0][0];
}

function getRandomEnemy(
    enemies: Enemy[]
): Enemy {

    const index = Math.floor(
        Math.random() * enemies.length
    );


    return enemies[index];
}

function createEnemyInstance(
    enemy: Enemy
): Enemy {

    return {
        ...enemy,

        identity: {
            ...enemy.identity,

            stats: {
                ...enemy.identity.stats,

                dmg: enemy.identity.stats.baseDmg,

                defence: enemy.identity.stats.baseDefence,

                speed: enemy.identity.stats.baseSpeed,

                evasion: enemy.identity.stats.baseEvasion,

                HealthStats: {
                    ...enemy.identity.stats.HealthStats,

                    health:
                        enemy.identity.stats.HealthStats.maxHealth
                }
            }
        },

        loot: [...enemy.loot]
    };
}