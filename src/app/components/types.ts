type Being = { 
    idName: string // Poprawa literówki (idNmae -> idName)
    stats: Stats 
} 

type Enemy = { 
    identity: Being // Zmiana "rights" na "identity", bo 'rights' to prawa, nie cecha postaci. 
                    // Zachowano strukturę składu (Being).
    loot: Item[] 
    gold?: number 
    rarity: RarityType // Poprawa typu - usunięto zbędny wrapper 'rarities' 
    description?: string // Poprawiono literówkę w komentarzu/dlaczego nie używamy ? dla opcyjności, ale tu jest ok
} 

// Usunięto opakowanie 'rarity: { rarity: ... }', ponieważ w grach rarytet to zwykła wartość typu string.
type RarityType = "legendary" | "epic" | "rare" | "common" | "uncommon" | "very_rare" | "unique" 

type Item ={ 
    idName: string // Spójne nazewnictwo z typem Being (mall 'IdName' na 'idName')
    description: string // Poprawa literówki descryption -> description
    type: string // Zachowano jako string zgodnie z Twoim stylem, ale warto dodać Enum jeśli planujesz to rozszerzyć
    value: number 
    rarity: RarityType // Użycie poprawionego typu powyżej
    maxStack: number | "unique" 
    usage: string 
} 

type HealthStats = { 
    maxHealth: number // Usunięto spacje przed dwukropkiem, naprawiono literówki w nazwach pól jeśli istniały (tu były OK)
    health: number 
} 

type Stats = { 
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

type Player = { 
    identity: Being // Spójność z typem Enemy (użyłem "identity" zamiast "rights")
    items: Item[] 
    gold: number // Spójne nazewnictwo małych liter ('Gold' -> 'gold')
    level: LevelSystem // Poprawa wielkości liter typu (levelSystem)
}

type LevelSystem = { // Poprawa wielkości liter (levelSystem -> LevelSystem)
    level: number 
    exp: number 
    nextLevelExp: number 
}
