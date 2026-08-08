import type { RarityType } from "../types";


export type EnemyRarityStage = {
    minRoom: number;
    maxRoom: number;
    rarities: Partial<Record<RarityType, number>>;
};


export const EnemyRarityConfig: EnemyRarityStage[] = [

    // ==============================
    // POKOJE 1-4
    // ==============================

    {
        minRoom: 1,
        maxRoom: 4,

        rarities: {
            common: 80,
            uncommon: 20
        }
    },


    // ==============================
    // POKOJE 5-9
    // ==============================

    {
        minRoom: 5,
        maxRoom: 9,

        rarities: {
            common: 40,
            uncommon: 40,
            rare: 20
        }
    },


    // ==============================
    // POKOJE 10-14
    // ==============================

    {
        minRoom: 10,
        maxRoom: 14,

        rarities: {
            uncommon: 30,
            rare: 50,
            epic: 20
        }
    },


    // ==============================
    // POKOJE 16-19
    // ==============================

    {
        minRoom: 16,
        maxRoom: 19,

        rarities: {
            uncommon: 20,
            rare: 40,
            epic: 30,
            very_rare: 10
        }
    }

];