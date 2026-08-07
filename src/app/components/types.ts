export type Being = {
    idName: string // Poprawa literówki (idNmae -> idName)
    stats: Stats 
} 

export type Enemy = {
    identity: Being // Zmiana "rights" na "identity", bo 'rights' to prawa, nie cecha postaci. 
                    // Zachowano strukturę składu (Being).
    loot: ItemId[] // Zmiana 'loot' na 'items
    gold?: number 
    rarity: RarityType // Poprawia typu - usunięto zbędny wrapper 'rarities'
    description?: string // Poprawiono literówkę w komentarzu/dlaczego nie użyjemy ? dla opcyjności, ale tu jest ok
} 

// Usunięto opakowanie 'rarity: { rarity: ... }', ponieważ w grach rarytet to zwykła wartość typu string.
export type RarityType = "legendary" | "epic" | "rare" | "common" | "uncommon" | "very_rare" | "unique"

export type Item ={
    idName: string // Spójne nazewnictwo z typem Being (mall 'IdName' na 'idName')
    description: string // Poprawa literówki descryption -> description
    type: string // Zachowano jako string zgodnie z Twoim stylem, ale warto dodać Enum jeśli planujesz to rozszerzyć
    value: number 
    rarity: RarityType // Użycie poprawionego typu powyżej
    maxStack: number | "unique" 
    usage: string 
} 

export type HealthStats = {
    maxHealth: number // Usunięto spacje przed dwukropkiem, naprawiono literówki w nazwach pól jeśli istniały (tu były OK)
    health: number 
} 

export type Stats = {
    baseDmg: number 
    dmg: number 
    baseDefence: number 
    defence: number 
    baseSpeed: number 
    speed: number 
    baseEvasion: number // Naprawiono literówkę "evasines" -> "evasion" dla spójności
    evasion: number 
    HealthStats: HealthStats // Zachowano składowanie, ale upewnij się, że nie jest to redundancja logiczna
} 

export type Player = {
    identity: Being // Spójność z typem Enemy (użyłem "identity" zamiast "rights")
    items: ItemId[] 
    gold: number // Spójne nazewnictwo małych liter ('Gold' -> 'gold')
    level: LevelSystem // Poprawa wielkości liter typu (levelSystem)
}

export type LevelSystem = { // Poprawa wielkości liter (levelSystem -> LevelSystem)
    level: number 
    exp: number 
    nextLevelExp: number 
}

export type RoomType =
    | "normal"
    | "boss"
    | "shop"
    | "puzzle"
    | "campfire"
    | "chest"
    | "event";


export type Room = {
    id: string;
    type: RoomType;

    name: string;

    description?: string;

    exits: number;

    weight: number;
};

export type ItemId = string;

