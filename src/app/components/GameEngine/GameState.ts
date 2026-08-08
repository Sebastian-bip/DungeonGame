import type { GameState } from "../types";
import { PlayerState } from "../entitis/entitis";


export const InitialGameState: GameState = {

    player: PlayerState,

    currentRoom: null,

    currentEnemy: null,

    roomNumber: 0,

    gameStatus: "menu"

};