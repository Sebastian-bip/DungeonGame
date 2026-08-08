import type { Enemy, GameState, Player, Room } from "../types";
import { addExperience } from "../entitis/LevelSystem";
import { InitialGameState } from "./GameState";
import { generateEnemy } from "./EnemyGenerator";
import { generateExits, generateRoom } from "./GenerateRoom";
import { calculatePlayerStats } from "./calculatePlayerStats";

export class GameLoop {
    private state: GameState;

    constructor() {
        this.state = structuredClone(InitialGameState);
    }

    public getState(): GameState {
        return structuredClone(this.state);
    }

    public startGame(): GameState {
        this.state = structuredClone(InitialGameState);
        this.state.roomNumber = 1;
        this.enterRoom(generateRoom(this.state.roomNumber));

        return this.getState();
    }

    public attack(): GameState {
        const enemy = this.state.currentEnemy;

        if (this.state.gameStatus !== "combat" || !enemy) {
            return this.getState();
        }

        this.dealDamage(this.state.player, enemy);

        if (enemy.identity.stats.HealthStats.health <= 0) {
            this.completeCombat(enemy);
            return this.getState();
        }

        this.dealDamage(enemy, this.state.player);

        if (this.state.player.identity.stats.HealthStats.health <= 0) {
            this.state.player.identity.stats.HealthStats.health = 0;
            this.state.gameStatus = "game_over";
        }

        return this.getState();
    }

    public useHealingPotion(): GameState {
        const potionIndex = this.state.player.items.indexOf("Healing Potion");

        if (potionIndex === -1 || this.state.gameStatus === "game_over") {
            return this.getState();
        }

        const health = this.state.player.identity.stats.HealthStats;
        if (health.health === health.maxHealth) {
            return this.getState();
        }

        this.state.player.items.splice(potionIndex, 1);
        health.health = Math.min(health.maxHealth, health.health + 35);

        return this.getState();
    }

    public chooseExit(exitIndex: number): GameState {
        if (this.state.gameStatus !== "choosing_exit") {
            return this.getState();
        }

        const exit = this.state.availableExits[exitIndex];
        if (!exit) {
            return this.getState();
        }

        this.state.roomNumber++;
        this.state.availableExits = [];
        this.enterRoom(exit.room);

        return this.getState();
    }

    private enterRoom(room: Room): void {
        this.state.currentRoom = room;
        this.state.currentEnemy = null;
        this.state.player.identity.stats = calculatePlayerStats(this.state.player);

        if (room.type === "normal" || room.type === "boss") {
            this.state.currentEnemy = generateEnemy(this.state.roomNumber);
            this.state.gameStatus = "combat";
            return;
        }

        this.state.availableExits = generateExits(this.state.roomNumber);
        this.state.gameStatus = "choosing_exit";
    }

    private dealDamage(attacker: Player | Enemy, defender: Player | Enemy): void {
        const defenderStats = defender.identity.stats;
        const dodgeChance = Math.min(45, Math.max(0, defenderStats.evasion));

        if (Math.random() * 100 < dodgeChance) {
            return;
        }

        const attackerStats = attacker.identity.stats;
        const damage = Math.max(1, attackerStats.dmg - Math.floor(defenderStats.defence / 2));
        defenderStats.HealthStats.health = Math.max(0, defenderStats.HealthStats.health - damage);
    }

    private completeCombat(enemy: Enemy): void {
        this.state.currentEnemy = null;
        this.state.player.gold += enemy.gold ?? 0;
        this.state.player.items.push(...enemy.loot);
        addExperience(this.state.player, 10 + this.state.roomNumber * 2);
        this.state.availableExits = generateExits(this.state.roomNumber);
        this.state.gameStatus = "choosing_exit";
    }
}
