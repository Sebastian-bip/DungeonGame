import type { Player } from "../types";


export function addExperience(
    player: Player,
    amount: number
): boolean {

    player.level.exp += amount;


    if (
        player.level.exp >=
        player.level.nextLevelExp
    ) {

        player.level.exp -=
            player.level.nextLevelExp;

        player.level.level++;

        player.level.nextLevelExp =
            Math.floor(
                player.level.nextLevelExp * 1.5
            );

        return true;
    }


    return false;
}