import { Room } from "../types";

// ==============================
// NORMALNY POKÓJ
// ==============================

export const NormalRoom: Room = {
    id: "normal_room",
    type: "normal",
    name: "Komnata",
    exits: 1,
    weight: 60
};


// ==============================
// BOSS
// ==============================

export const BossRoom: Room = {
    id: "boss_room",
    type: "boss",
    name: "Komnata Władcy",
    description: "Ogromna komnata. Na jej końcu czeka potężny przeciwnik.",
    exits: 1,
    weight: 0
};



// ==============================
// SPRZEDAWCA
// ==============================

export const ShopRoom: Room = {
    id: "shop_room",
    type: "shop",
    name: "Opuszczony sklep",
    description: "Stary kupiec czeka za ladą, oferując swoje towary.",
    exits: 2,
    weight: 8
};


// ==============================
// ZAGADKA
// ==============================

export const PuzzleRoom: Room = {
    id: "puzzle_room",
    type: "puzzle",
    name: "Komnata zagadki",
    description: "Na środku pomieszczenia znajduje się dziwna kamienna tablica.",
    exits: 2,
    weight: 7
};


// ==============================
// OGNISKO
// ==============================

export const CampfireRoom: Room = {
    id: "campfire_room",
    type: "campfire",
    name: "Ognisko",
    description: "Ciepłe ognisko płonie pośrodku opuszczonej komnaty.",
    exits: 1,
    weight: 10
};


// ==============================
// SKRZYNIA
// ==============================

export const ChestRoom: Room = {
    id: "chest_room",
    type: "chest",
    name: "Komnata skarbów",
    description: "Pośrodku pomieszczenia stoi stara skrzynia.",
    exits: 2,
    weight: 10
};


// ==============================
// WYDARZENIE
// ==============================

export const EventRoom: Room = {
    id: "event_room",
    type: "event",
    name: "Tajemnicza komnata",
    description: "Nie wiesz, co wydarzy się po przekroczeniu progu.",
    exits: 2,
    weight: 5
};

export const RoomPool: Room[] = [
    NormalRoom,
    ShopRoom,
    PuzzleRoom,
    CampfireRoom,
    ChestRoom,
    EventRoom
];