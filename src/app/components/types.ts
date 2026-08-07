// 1. Podstawowe wartości i stałe (Enumy zamiast magicznych stringów)
type RarityType = 
  | "legendary" 
  | "epic" 
  | "rare" 
  | "common" 
  | "uncommon" 
  | "very_rare" 
  | "unique";

// 2. Statystyki walki (zadanie do poprawy - unikamy podwojenia HealthStats)
type CombatStats = {
  baseDamage: number;
  damage: number;          // Obliczone (current)
  
  baseDefense: number;
  defense: number;         // Obliczone (current)

  baseSpeed: number;
  speed: number;           // Obliczone (current)

  baseEvasion: number;     // Spisanie "evasines" -> Evasion
  evasion: number;         // Spisanie "evasines" -> Evasion
  
  maxHealth: number;       // HP jest częścią CombatStats lub osobnym typem, zależnie od architektury
                           // Tutaj połączylismy dla uproszczenia, albo zostawiamy HealthStats osobno jeśli potrzebujesz logiki
};

// 3. Stan zdrowia (zgodny z Twoim stylem)
type Health = {
  currentHealth: number;
  maxHealth: number;       // Renamed for clarity
};

type Stats = {
  damage: CombatStats['damage'] & { baseDamage: number }; 
  defense: CombatStats['defense'] & { baseDefense: number };
  speed: CombatStats['speed'] & { baseSpeed: number };
  
  // Jeśli HealthStats jest osobnym obiektem, to tutaj może go mieć, ale lepiej wgrać bezpośrednio dla wydajności
  health: Health; 
};

// Lepsza struktura Stats - proponuję płaską strukturę dla łatwiejszego dostępu
type CharacterStats = {
  hp: number;           // Current HP
  maxHp: number;        // Max HP
  
  attack: number;       // Damage (current)
  def: number;          // Defense (current)
  speed: number;        // Speed (current)
  
  critChance?: number;  // Dodałem krytyczną szansę jako bonus
};

// 4. Bycie / Istota (Zmieniono "idNmae" na id + name, poprawiono "rights")
type Identity = {
  id: string;            // UUID lub nazwa ID
  name: string;          // Nazwa postaci
};

// 5. Przedmiot (Item)
type Item = {
  id: string;            // Unikaj IdName na rzecz oddzielenia ID i Nazwy
  name: string;          // Poprawka "descryption" -> description
  description: string;
  
  type: ItemType;        // Typ enum zamiast string
  value: number;         // Wartość rynkowa
    
  rarity: RarityType;    // Bez wrappera, bezpośrednio string
  maxStack: number | 'unique'; // 'unique' jako literalny typ
  
  usage: string;         // Np. "Ręka" lub "Głowa", jeśli to slot na ekwipunku
};

enum ItemType {
  Weapon = "weapon",
  Armor = "armor",
  Consumable = "consumable",
  Accessory = "accessory"
}

// 6. Być (Being) - wspólne dla Gracza i Przeciwnika
type BeingData = { // Nazwa "Being" jest abstrakcyjna, "CharacterData" może być lepsza
  identity: Identity;    // Oddzielenie tożsamości od statów
  stats: CharacterStats; 
};

// 7. Gracz i Przeciwnik (Składanie)
type Player = {
  being: BeingData;      // Zamiast "rights" - bardziej semantyczne
  items: Item[];         // Inwentarz gracza
  gold: number;          // Zawsze liczba, bo gracz zawsze ma złoto (0 też OK)
  level: Level;          // Oddzielenie typu poziomu
};

type Enemy = {
  being: BeingData;      // Przeciwnik również posiada statystyki i nazwę
  loot: Item[];          // To, co upadnie z niego po zabiciu
  gold?: number;         // Złoto na ciele (dymki)
  rarity: RarityType;    // Rarytet przeciwnika (np. dla kolorów UI)
  description?: string; 
};

// 8. System Poziomów
type Level = {
  level: number;         // np. 5
  exp: number;           // Obecnie XP
  nextLevelExp: number;  // Wymagane do następnego poziomu
};
