import type { GameState } from "../types";
import { PlayerState } from "../entitis/entitis";


export const InitialGameState: GameState = {

    player: structuredClone(PlayerState),

    currentRoom: null,

    currentEnemy: null,

    availableExits: [],

    roomNumber: 0,

    gameStatus: "menu"

};