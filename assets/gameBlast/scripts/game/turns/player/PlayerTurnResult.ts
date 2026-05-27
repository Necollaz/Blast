import { TileModel } from "../../../tiles/TileModel";
import { TurnResult } from "../TurnResult";

export interface PlayerTurnResult {
    turnResult: TurnResult;
    selectedGroup: TileModel[];
}