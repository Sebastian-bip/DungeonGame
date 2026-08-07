import type { Player } from "../types";
import type { Enemy } from "../types";
import type { ItemId } from "../types";


// Przykładowy gracz - Wojownik
export const PlayerState: Player = {
    identity: {
        idName: "WillBeGiven",
        stats: {
            baseDmg: 15,
            dmg: 0,
            baseDefence: 15,
            defence: 0,
            baseSpeed: 5,
            speed: 0,
            baseEvasion: 2,
            evasion: 0,
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
            dmg: 0,
            baseDefence: 8,
            defence: 0,
            baseSpeed: 12,
            speed: 0,
            baseEvasion: 10,
            evasion: 0,
            HealthStats: {
                maxHealth: 150,
                health: 0
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
            dmg: 0,
            baseDefence: 20,
            defence: 0,
            baseSpeed: 6,
            speed: 0,
            baseEvasion: 3,
            evasion: 0,
            HealthStats: {
                maxHealth: 300,
                health: 0
            }
        }
    },
    loot: ["Healing Potion"],
    gold: 400,
    rarity: "epic",
    description: "Ognisty golem strzeżący wejście do komnaty"
};
export const enemy0: Enemy = {
    identity: {
        idName: "Forest_Rat",

        stats: {
            baseDmg: 8,
            dmg: 0,

            baseDefence: 3,
            defence: 0,

            baseSpeed: 8,
            speed: 0,

            baseEvasion: 5,
            evasion: 0,

            HealthStats: {
                maxHealth: 40,
                health: 0
            }
        }
    },

    loot: [
        "Healing Potion"
    ],

    gold: 5,

    rarity: "common",

    description: "Mały szczur zamieszkujący podziemia."
};












// Lista wrogów

export const Enemies: Enemy[] = [enemy0,enemy1, enemy2];