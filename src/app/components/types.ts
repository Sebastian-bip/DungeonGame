type Being = {
    idNmae: string
    stats:Stats
}

type Enemy = {
    rights: Being
    loot: Item[]
    gold?: number
    rarity: rarities
    description?: string

}

type rarities = {
    rarity: "legendary" | "epic" | "rare" | "common" | "uncommon" | "very_rare" | "unique"
}

type Item ={
    IdName: string
    descryption: string
    type: string // broń, zbroja, wyposarzenie, jeszcze to jest do dopracowania
    value: number // wartość przedmiotu
    rarity: rarities
    maxStack: number | "unique"
    usage: string

}
type HealthStats = {
    maxHealth :number
    health: number
}
type Stats = {
    baseDmg: number
    dmg: number
    baseDefence: number
    defence: number
    baseSpeed: number
    speed: number
    baseEvasines: number
    evasines: number
    HealthStats: HealthStats
}
type Player = {
    rights: Being
    items: Item[]
    Gold: number
    level: levelSystem
}

type levelSystem = {
    level: number
    exp: number
    nextLevelExp: number
}