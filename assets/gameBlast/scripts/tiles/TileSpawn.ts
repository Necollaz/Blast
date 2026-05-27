import { TileModel } from "./TileModel";
import { TilePosition } from "./TilePosition";

export interface TileSpawn {
    tile: TileModel;
    from: TilePosition;
    to: TilePosition;
}