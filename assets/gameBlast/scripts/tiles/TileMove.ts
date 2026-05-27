import { TileModel } from "./TileModel";
import { TilePosition } from "./TilePosition";

export interface TileMove {
    tile: TileModel;
    from: TilePosition;
    to: TilePosition;
}