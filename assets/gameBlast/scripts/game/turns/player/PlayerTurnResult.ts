import { TileModel } from "../../../tiles/TileModel";
import { TilePosition } from "../../../tiles/TilePosition";
import { TileType } from "../../../tiles/TileType";
import { TurnResult } from "../TurnResult";

export interface PlayerTurnResult {
    turnResult: TurnResult;
    selectedGroup: TileModel[];
    superTilePosition: TilePosition;
    superTileType: TileType;
}