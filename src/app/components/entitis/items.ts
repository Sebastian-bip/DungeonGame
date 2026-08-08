import type { Item } from "../types";

export const items: Item[] =[
    {
        idName: "Healing Potion",
        description: "Mikstura przywracająca część zdrowia",
        type: "consumable",
        value: 10,
        rarity: "common",
        maxStack: 5,
        usage: "Heal"
    },
    {
        idName: "Ring Of Speed",
        description: "Magiczny Pierścień modefikujący Percepcje",
        type: "consumable",
        value: 42,
        rarity: "uncommon",
        maxStack: "unique",
        usage: "BoostSpeed"
    }
]
