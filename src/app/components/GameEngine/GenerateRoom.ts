import { Room } from "../types";
import { RoomPool } from "../entitis/Rooms";
import { BossRoom } from "../entitis/Rooms";

export function generateRoom(roomNumber: number): Room {

    // Co 15 pokój jest bossem
    if (roomNumber % 15 === 0) {
        return BossRoom;
    }


    // Pierwszy pokój zawsze normalny
    if (roomNumber === 1) {
        return RoomPool[0];
    }


    return getRandomRoom();
}


function getRandomRoom(): Room {

    const totalWeight = RoomPool.reduce(
        (total:number, room:Room) => total + room.weight,
        0
    );


    let random = Math.random() * totalWeight;


    for (const room of RoomPool) {

        random -= room.weight;


        if (random <= 0) {
            return room;
        }

    }


    return RoomPool[0];
}