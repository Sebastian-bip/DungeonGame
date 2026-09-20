import { CLASS_BASE_STATS, CLASS_LABELS, getItem, generateRoom, SHOP_ITEM_IDS } from "./content";
import { calculateDamage, getPlayerCombatStats } from "./damage";
import type { CombatStats, Enemy, GameState, HeroClass, PlayerState, Room } from "./types";

const ENEMY_TEMPLATES = [
    { id: "grave_rat", name: "Szczur z Krypt", description: "Głodny padlinożerca o czerwonych oczach.", health: 32, power: 7, armor: 1, agility: 8, luck: 2, gold: 10, experience: 13 },
    { id: "bone_scout", name: "Kościany Zwiadowca", description: "Szkielet z poszczerbioną włócznią.", health: 43, power: 9, armor: 3, agility: 7, luck: 3, gold: 14, experience: 17 },
    { id: "sewer_thief", name: "Złodziej Kanałów", description: "Szybki rabuś, który zna każdy cień.", health: 38, power: 10, armor: 2, agility: 14, luck: 7, gold: 18, experience: 19 },
    { id: "ember_wisp", name: "Żarowy Widm", description: "Płonący duch przeciska się przez szczeliny w murze.", health: 48, power: 12, armor: 2, agility: 11, luck: 8, gold: 22, experience: 22 },
    { id: "iron_myrmidon", name: "Żelazny Myrmidon", description: "Ciężki konstrukt ze zbrojowni podziemi.", health: 63, power: 11, armor: 8, agility: 4, luck: 2, gold: 27, experience: 25 },
    { id: "veil_huntress", name: "Łowczyni Zasłony", description: "Elitarna zabójczyni szybsza niż jej cień.", health: 78, power: 15, armor: 5, agility: 18, luck: 12, gold: 48, experience: 42 },
    { id: "crypt_warden", name: "Strażnik Krypty", description: "Opancerzony czempion strzegący zakazanego przejścia.", health: 106, power: 17, armor: 10, agility: 8, luck: 5, gold: 65, experience: 56 },
];

function cloneState(state: GameState): GameState {
    return structuredClone(state);
}

function addLog(state: GameState, message: string): void {
    state.log = [...state.log, message].slice(-6);
}

export function createNewGame(name: string, heroClass: HeroClass, random: () => number = Math.random): GameState {
    const baseStats = { ...CLASS_BASE_STATS[heroClass] };
    const player: PlayerState = {
        name,
        heroClass,
        baseStats,
        health: baseStats.maxHealth,
        gold: 30,
        level: 1,
        experience: 0,
        experienceToLevel: 35,
        unspentPoints: 0,
        inventory: { healing_potion: 2 },
        equipped: [],
    };
    const state: GameState = { version: 1, player, room: generateRoom(1, random), enemy: null, phase: "awaiting_next", eventId: null, log: [`${CLASS_LABELS[heroClass]} ${name} schodzi do podziemi.`] };
    enterRoom(state, random);
    return state;
}

export function advanceRoom(input: GameState, random: () => number = Math.random): GameState {
    const state = cloneState(input);
    if (state.phase !== "awaiting_next") return state;
    if (state.room.number >= 20) return state;
    state.room = generateRoom(state.room.number + 1, random);
    state.enemy = null;
    state.eventId = null;
    enterRoom(state, random);
    return state;
}

function enterRoom(state: GameState, random: () => number): void {
    const { room, player } = state;
    addLog(state, `Pokój ${room.number}/20 — ${room.title}.`);
    if (room.type === "combat" || room.type === "elite" || room.type === "boss") {
        state.enemy = createEnemy(room, random);
        state.phase = "combat";
        addLog(state, `${state.enemy.name}: ${state.enemy.description}`);
        return;
    }
    if (room.type === "shop") {
        state.phase = "shop";
        addLog(state, "Użyj „shop”, „buy <id>” lub „leave”.");
        return;
    }
    if (room.type === "camp") {
        const stats = getPlayerCombatStats(player);
        const healed = Math.min(stats.maxHealth - player.health, Math.ceil(stats.maxHealth * 0.4));
        player.health += healed;
        state.phase = "awaiting_next";
        addLog(state, `Odpoczynek przywraca ${healed} HP.`);
        return;
    }
    if (room.type === "treasure") {
        const gold = 22 + room.number * 4;
        const foundPotion = random() < 0.45;
        player.gold += gold;
        if (foundPotion) addItem(player, "healing_potion");
        state.phase = "awaiting_next";
        addLog(state, `Skrzynia zawiera ${gold} złota${foundPotion ? " i miksturę" : ""}.`);
        return;
    }
    if (room.type === "shrine") {
        const stat = ["power", "armor", "agility", "luck"] as const;
        const chosen = stat[Math.floor(random() * stat.length)];
        player.baseStats[chosen] += 2;
        state.phase = "awaiting_next";
        addLog(state, `Błogosławieństwo kaplicy: +2 ${statLabel(chosen)} na stałe.`);
        return;
    }
    state.phase = "event";
    state.eventId = "whispering_gate";
    addLog(state, "Użyj „event enter” (ryzyko i nagroda) albo „event leave”.");
}

export function attack(input: GameState, random: () => number = Math.random): GameState {
    const state = cloneState(input);
    const enemy = state.enemy;
    if (state.phase !== "combat" || !enemy) return state;
    const playerStats = getPlayerCombatStats(state.player);
    const playerHit = calculateDamage(playerStats, enemy.stats, random);
    enemy.stats.health = Math.max(0, enemy.stats.health - playerHit.damage);
    addLog(state, describeHit(`Atakujesz ${enemy.name}`, playerHit));
    if (enemy.stats.health <= 0) {
        finishCombat(state, enemy, random);
        return state;
    }
    const enemyHit = calculateDamage(enemy.stats, playerStats, random);
    state.player.health = Math.max(0, state.player.health - enemyHit.damage);
    addLog(state, describeHit(`${enemy.name} kontratakuje`, enemyHit));
    if (state.player.health <= 0) {
        state.phase = "game_over";
        addLog(state, "Twoja wyprawa dobiegła końca. Rozpocznij nową grę.");
    }
    return state;
}

export function consumeItem(input: GameState, itemId: string): GameState {
    const state = cloneState(input);
    const item = getItem(itemId);
    if (!item || item.slot !== "consumable" || !item.heal || !state.player.inventory[itemId]) return state;
    const stats = getPlayerCombatStats(state.player);
    if (state.player.health >= stats.maxHealth || state.phase === "game_over") return state;
    state.player.inventory[itemId]--;
    if (state.player.inventory[itemId] === 0) delete state.player.inventory[itemId];
    state.player.health = Math.min(stats.maxHealth, state.player.health + item.heal);
    addLog(state, `${item.name}: odzyskujesz ${item.heal} HP.`);
    return state;
}

export function buyItem(input: GameState, itemId: string): GameState {
    const state = cloneState(input);
    const item = getItem(itemId);
    if (state.phase !== "shop" || !item || !SHOP_ITEM_IDS.includes(itemId) || state.player.gold < item.price) return state;
    state.player.gold -= item.price;
    addItem(state.player, itemId);
    if (item.slot !== "consumable") equipItem(state.player, itemId);
    addLog(state, `Kupiono: ${item.name}. ${item.slot !== "consumable" ? "Przedmiot został wyposażony." : ""}`);
    return state;
}

export function leaveShop(input: GameState): GameState {
    const state = cloneState(input);
    if (state.phase === "shop") {
        state.phase = "awaiting_next";
        addLog(state, "Żegnasz kupca.");
    }
    return state;
}

export function resolveEvent(input: GameState, choice: "enter" | "leave", random: () => number = Math.random): GameState {
    const state = cloneState(input);
    if (state.phase !== "event") return state;
    if (choice === "leave") {
        state.phase = "awaiting_next";
        addLog(state, "Ignorujesz szepty i idziesz dalej.");
        return state;
    }
    if (random() < 0.62) {
        const reward = 35 + state.room.number * 5;
        const foundEye = random() < 0.35;
        state.player.gold += reward;
        if (foundEye) addItem(state.player, "lucky_eye");
        addLog(state, `Brama ustępuje. Zdobywasz ${reward} złota${foundEye ? " i Oko Fortuny" : ""}.`);
    } else {
        const damage = Math.max(8, Math.round(getPlayerCombatStats(state.player).maxHealth * 0.2));
        state.player.health = Math.max(1, state.player.health - damage);
        addLog(state, `Brama pobiera daninę: tracisz ${damage} HP.`);
    }
    state.phase = "awaiting_next";
    return state;
}

export function upgradeStat(input: GameState, stat: "power" | "armor" | "agility" | "luck" | "health"): GameState {
    const state = cloneState(input);
    if (state.player.unspentPoints < 1 || state.phase === "game_over") return state;
    state.player.unspentPoints--;
    if (stat === "health") {
        state.player.baseStats.maxHealth += 8;
        state.player.health += 8;
    } else state.player.baseStats[stat] += 2;
    addLog(state, `Rozwinięto ${statLabel(stat)}.`);
    return state;
}

function createEnemy(room: Room, random: () => number): Enemy {
    const template = room.type === "boss" ? ENEMY_TEMPLATES[6] : room.type === "elite" ? ENEMY_TEMPLATES[5] : ENEMY_TEMPLATES[Math.floor(random() * 5)];
    const scale = 1 + (room.number - 1) * 0.075 + (room.type === "elite" ? 0.2 : 0) + (room.type === "boss" ? 0.35 : 0);
    const stats: CombatStats = {
        maxHealth: Math.round(template.health * scale), health: Math.round(template.health * scale), power: Math.round(template.power * scale),
        armor: Math.round(template.armor * scale), agility: Math.round(template.agility * scale), luck: template.luck,
    };
    return { id: template.id, name: template.name, description: template.description, stats, gold: Math.round(template.gold * scale), experience: Math.round(template.experience * scale), loot: random() < 0.22 ? "healing_potion" : undefined, elite: room.type === "elite" || room.type === "boss" };
}

function finishCombat(state: GameState, enemy: Enemy, random: () => number): void {
    state.player.gold += enemy.gold;
    if (enemy.loot) addItem(state.player, enemy.loot);
    addExperience(state.player, enemy.experience, state);
    state.enemy = null;
    state.phase = state.room.type === "boss" ? "completed" : "awaiting_next";
    addLog(state, `Pokonujesz ${enemy.name}. +${enemy.gold} złota, +${enemy.experience} XP.`);
    if (state.phase === "completed") addLog(state, "Zwycięstwo! Oczyściłeś wszystkie 20 komnat podziemi.");
    void random;
}

function addExperience(player: PlayerState, amount: number, state: GameState): void {
    player.experience += amount;
    while (player.experience >= player.experienceToLevel) {
        player.experience -= player.experienceToLevel;
        player.level++;
        player.unspentPoints++;
        player.experienceToLevel = Math.round(player.experienceToLevel * 1.36 + 8);
        player.baseStats.maxHealth += 4;
        player.health = Math.min(getPlayerCombatStats(player).maxHealth, player.health + 10);
        addLog(state, `Awans na poziom ${player.level}! +1 punkt rozwoju, +4 maks. HP.`);
    }
}

function addItem(player: PlayerState, itemId: string): void {
    player.inventory[itemId] = (player.inventory[itemId] ?? 0) + 1;
}

function equipItem(player: PlayerState, itemId: string): void {
    const item = getItem(itemId);
    if (!item || item.slot === "consumable") return;
    player.equipped = player.equipped.filter((equippedId) => getItem(equippedId)?.slot !== item.slot);
    player.equipped.push(itemId);
}

function describeHit(subject: string, hit: { damage: number; critical: boolean; dodged: boolean }): string {
    if (hit.dodged) return `${subject}, lecz atak zostaje uniknięty.`;
    return `${subject} za ${hit.damage} obrażeń${hit.critical ? " (cios krytyczny)" : ""}.`;
}

function statLabel(stat: keyof Omit<CombatStats, "health" | "maxHealth"> | "health"): string {
    return ({ power: "moc", armor: "pancerz", agility: "zwinność", luck: "szczęście", health: "zdrowie" } as const)[stat];
}
