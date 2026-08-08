import type {Player, StatType} from "@/app/components/types"


export function upgradePlayerStat(
    player: Player,
    stat: StatType
): void {

    switch (stat) {

        case "damage":
            player.identity.stats.baseDmg += 2;
            break;


        case "defence":
            player.identity.stats.baseDefence += 2;
            break;


        case "speed":
            player.identity.stats.baseSpeed += 1;
            break;


        case "evasion":
            player.identity.stats.baseEvasion += 1;
            break;


        case "health":

            player.identity.stats.HealthStats.maxHealth += 10;

            player.identity.stats.HealthStats.health += 10;

            break;
    }
}