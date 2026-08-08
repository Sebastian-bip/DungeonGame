import type { GameState, Room } from "../types";
import { InitialGameState } from "./GameState";
import { generateRoom } from "./GenerateRoom";
import { generateEnemy } from "./EnemyGenerator";

export class GameLoop {

    private state: GameState;


    constructor() {

        this.state = {
            ...InitialGameState
        };

    }


    public getState(): GameState {

        return this.state;

    }


    public startGame(): GameState {

        this.state = {
            ...InitialGameState,

            roomNumber: 1,

            gameStatus: "playing"
        };


        this.enterNextRoom();


        return this.state;

    }


    private enterNextRoom(): void {

        const room = generateRoom(
            this.state.roomNumber
        );


        this.state.currentRoom = room;


        if (room.type === "normal") {

            this.startNormalRoom();

        }


        if (room.type === "boss") {

            this.startBossRoom();

        }

    }


    private startNormalRoom(): void {

        const enemy = generateEnemy(
            this.state.roomNumber
        );


        this.state.currentEnemy = enemy;

        this.state.gameStatus = "combat";

    }


    private startBossRoom(): void {

        this.state.currentEnemy = null;

        this.state.gameStatus = "combat";

    }

}