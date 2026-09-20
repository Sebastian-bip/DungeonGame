export type HeroClass = "mage" | "bandit" | "knight";

export type ItemSlot = "weapon" | "armor" | "trinket" | "consumable";

export type ItemBonus = Partial<Pick<CombatStats, "power" | "armor" | "agility" | "luck" | "maxHealth">>;

export interface CombatStats {
    maxHealth: number;
    health: number;
    power: number;
    armor: number;
    agility: number;
    luck: number;
}

export interface ItemDefinition {
    id: string;
    name: string;
    description: string;
    price: number;
    slot: ItemSlot;
    bonus?: ItemBonus;
    heal?: number;
    rarity: "common" | "rare" | "epic" | "legendary";
}

export interface PlayerState {
    name: string;
    heroClass: HeroClass;
    baseStats: Omit<CombatStats, "health">;
    health: number;
    gold: number;
    level: number;
    experience: number;
    experienceToLevel: number;
    unspentPoints: number;
    inventory: Record<string, number>;
    equipped: string[];
}

export interface Enemy {
    id: string;
    name: string;
    description: string;
    stats: CombatStats;
    gold: number;
    experience: number;
    loot?: string;
    elite?: boolean;
}

export type RoomType = "combat" | "elite" | "shop" | "camp" | "treasure" | "shrine" | "event" | "boss";

export interface Room {
    number: number;
    type: RoomType;
    title: string;
    description: string;
}

export type GamePhase = "combat" | "shop" | "event" | "awaiting_next" | "completed" | "game_over";

export interface GameState {
    version: 1;
    player: PlayerState;
    room: Room;
    enemy: Enemy | null;
    phase: GamePhase;
    eventId: string | null;
    log: string[];
}

export interface HitResult {
    damage: number;
    critical: boolean;
    dodged: boolean;
}
