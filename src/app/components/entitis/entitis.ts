import type { Player } from "../types";
import type { Enemy } from "../types";
import type { ItemId } from "../types";


// Przykładowy gracz - Wojownik
export const examplePlayer: Player = {
    identity: {
        idName: "WillBeGiven",
        stats: {
            baseDmg: 15,
            dmg: 15,
            baseDefence: 15,
            defence: 15,
            baseSpeed: 5,
            speed: 5,
            baseEvasion: 2,
            evasion: 2,
            HealthStats: {
                maxHealth: 100,
                health: 100
            }
        }
    },
    items: ["Healing Potion"],
    gold: 0,
    level: {
        level: 1,
        exp: 0,
        nextLevelExp: 20
    }
};

// Przykładowy wróg - Przyczajony Lis (Uncommon)
export const enemy1: Enemy = {
    identity: {
        idName: "Shadow_Stalker",
        stats: {
            baseDmg: 25,
            dmg: 25,
            baseDefence: 8,
            defence: 8,
            baseSpeed: 12,
            speed: 12,
            baseEvasion: 10,
            evasion: 10,
            HealthStats: {
                maxHealth: 150,
                health: 150
            }
        }
    },
    loot: ["Ring Of Speed"],
    gold: 150,
    rarity: "uncommon",
    description: "Przyczajony lis atakujący z cienia"
};

// Przykładowy wróg - Ognisty Golem (Epic)
export const enemy2: Enemy = {
    identity: {
        idName: "Fire_Golem",
        stats: {
            baseDmg: 35,
            dmg: 35,
            baseDefence: 20,
            defence: 20,
            baseSpeed: 6,
            speed: 6,
            baseEvasion: 3,
            evasion: 3,
            HealthStats: {
                maxHealth: 300,
                health: 300
            }
        }
    },
    loot: ["Healing Potion"],
    gold: 400,
    rarity: "epic",
    description: "Ognisty golem strzeżący wejście do komnaty"
};