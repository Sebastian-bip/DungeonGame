import type { Room, RoomExit } from "../types";
import { RoomPool, BossRoom } from "../entitis/Rooms";


export function generateRoom(roomNumber: number): Room {

    if (roomNumber % 15 === 0) {
        return BossRoom;
    }


    if (roomNumber === 1) {
        return RoomPool[0];
    }


    return getRandomRoom();
}


function getRandomRoom(): Room {

    const totalWeight = RoomPool.reduce(
        (total, room) => total + room.weight,
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

export function generateExits(
    roomNumber: number
): RoomExit[] {

    const safeRoom = generateRoom(roomNumber + 1);

    const riskyRoom = generateRoom(roomNumber + 1);


    return [
        {
            room: safeRoom,
            risk: "safe"
        },

        {
            room: riskyRoom,
            risk: "risky"
        }
    ];
}