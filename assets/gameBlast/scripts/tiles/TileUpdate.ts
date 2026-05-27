import { TileModel } from "./TileModel";
import { TilePosition } from "./TilePosition";

export interface TileUpdate {
    position: TilePosition;
    tile: TileModel;
}