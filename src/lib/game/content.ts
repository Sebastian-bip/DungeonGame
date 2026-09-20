import type { HeroClass, ItemDefinition, Room, RoomType } from "./types";

export const CLASS_LABELS: Record<HeroClass, string> = {
    mage: "Mag",
    bandit: "Bandyta",
    knight: "Rycerz",
};

export const CLASS_BASE_STATS = {
    mage: { maxHealth: 74, power: 14, armor: 4, agility: 12, luck: 9 },
    bandit: { maxHealth: 86, power: 12, armor: 6, agility: 17, luck: 14 },
    knight: { maxHealth: 118, power: 10, armor: 12, agility: 7, luck: 5 },
} as const;

export const ITEMS: ItemDefinition[] = [
    { id: "healing_potion", name: "Mikstura leczenia", description: "Przywraca 35 punktów zdrowia.", price: 18, slot: "consumable", heal: 35, rarity: "common" },
    { id: "ember_staff", name: "Kostur Żaru", description: "+5 mocy. Doskonały dla maga.", price: 62, slot: "weapon", bonus: { power: 5 }, rarity: "rare" },
    { id: "night_dagger", name: "Sztylet Nocy", description: "+3 mocy, +4 zwinności.", price: 58, slot: "weapon", bonus: { power: 3, agility: 4 }, rarity: "rare" },
    { id: "warden_blade", name: "Miecz Strażnika", description: "+4 mocy, +2 pancerza.", price: 66, slot: "weapon", bonus: { power: 4, armor: 2 }, rarity: "rare" },
    { id: "shadow_cloak", name: "Płaszcz Cieni", description: "+5 zwinności, +3 szczęścia.", price: 74, slot: "armor", bonus: { agility: 5, luck: 3 }, rarity: "epic" },
    { id: "iron_ward", name: "Żelazna Płyta", description: "+6 pancerza, +12 maks. zdrowia.", price: 76, slot: "armor", bonus: { armor: 6, maxHealth: 12 }, rarity: "epic" },
    { id: "dragon_heart", name: "Serce Smoka", description: "+20 maks. zdrowia, +2 mocy.", price: 105, slot: "trinket", bonus: { maxHealth: 20, power: 2 }, rarity: "legendary" },
    { id: "lucky_eye", name: "Oko Fortuny", description: "+7 szczęścia.", price: 70, slot: "trinket", bonus: { luck: 7 }, rarity: "epic" },
];

export const SHOP_ITEM_IDS = ["healing_potion", "ember_staff", "night_dagger", "warden_blade", "shadow_cloak", "iron_ward", "lucky_eye"];

export function getItem(itemId: string): ItemDefinition | undefined {
    return ITEMS.find((item) => item.id === itemId);
}

const ROOM_TEMPLATES: Record<RoomType, Omit<Room, "number">> = {
    combat: { type: "combat", title: "Mroczny korytarz", description: "Z ciemności dobiega chrzęst stali." },
    elite: { type: "elite", title: "Sala Czempiona", description: "Tę komnatę chroni znacznie silniejszy przeciwnik." },
    shop: { type: "shop", title: "Wędrowny kupiec", description: "Kupiec rozłożył towary przy świetle latarni." },
    camp: { type: "camp", title: "Ciche ognisko", description: "Bezpieczne palenisko pozwala odzyskać siły." },
    treasure: { type: "treasure", title: "Zapomniany skarbiec", description: "W pękniętej skrzyni czeka drobny łup." },
    shrine: { type: "shrine", title: "Kaplica Przodków", description: "Stary ołtarz pulsuje bladym światłem." },
    event: { type: "event", title: "Szeptająca Brama", description: "Brama obiecuje nagrodę, ale żąda odwagi." },
    boss: { type: "boss", title: "Tron Głębin", description: "Władca podziemi czeka na ostatnie starcie." },
};

export function generateRoom(roomNumber: number, random: () => number = Math.random): Room {
    if (roomNumber === 20) return { ...ROOM_TEMPLATES.boss, number: roomNumber };
    if (roomNumber === 5 || roomNumber === 15) return { ...ROOM_TEMPLATES.shop, number: roomNumber };
    if (roomNumber === 10) return { ...ROOM_TEMPLATES.elite, number: roomNumber };
    if (roomNumber === 1) return { ...ROOM_TEMPLATES.combat, number: roomNumber };

    const roll = random();
    const type: RoomType = roll < 0.56 ? "combat" : roll < 0.68 ? "treasure" : roll < 0.79 ? "camp" : roll < 0.9 ? "shrine" : "event";
    return { ...ROOM_TEMPLATES[type], number: roomNumber };
}
