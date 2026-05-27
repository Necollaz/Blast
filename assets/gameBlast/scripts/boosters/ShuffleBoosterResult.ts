import { TileSpawn } from "../tiles/TileSpawn";

export interface ShuffleBoosterResult {
    isValid: boolean;
    isLose: boolean;
    tileSpawns: TileSpawn[];
}