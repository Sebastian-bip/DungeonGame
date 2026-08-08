export type RarityType =
    | "common"
    | "uncommon"
    | "rare"
    | "epic"
    | "very_rare"
    | "legendary"
    | "unique";

export type ItemId = string;

export type HealthStats = {
    maxHealth: number;
    health: number;
};

export type Stats = {
    baseDmg: number;
    dmg: number;
    baseDefence: number;
    defence: number;
    baseSpeed: number;
    speed: number;
    baseEvasion: number;
    evasion: number;
    HealthStats: HealthStats;
};

export type Being = {
    idName: string;
    stats: Stats;
};

export type Item = {
    idName: string;
    description: string;
    type: string;
    value: number;
    rarity: RarityType;
    maxStack: number | "unique";
    usage: string;
};

export type LevelSystem = {
    level: number;
    exp: number;
    nextLevelExp: number;
};

export type Player = {
    identity: Being;
    items: ItemId[];
    gold: number;
    level: LevelSystem;
};

export type Enemy = {
    identity: Being;
    loot: ItemId[];
    gold?: number;
    rarity: RarityType;
    description?: string;
};

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

export type ExitRisk = "safe" | "risky";

export type RoomExit = {
    room: Room;
    risk: ExitRisk;
};

export type GameStatus =
    | "menu"
    | "combat"
    | "choosing_exit"
    | "game_over"
    | "finished";

export type GameState = {
    player: Player;
    currentRoom: Room | null;
    currentEnemy: Enemy | null;
    availableExits: RoomExit[];
    roomNumber: number;
    gameStatus: GameStatus;
};

export type StatType =
    | "damage"
    | "defence"
    | "speed"
    | "evasion"
    | "health";
