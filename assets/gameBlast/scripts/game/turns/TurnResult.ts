import { TileMove } from "../../tiles/TileMove";
import { TilePosition } from "../../tiles/TilePosition";
import { TileSpawn } from "../../tiles/TileSpawn";
import { TileUpdate } from "../../tiles/TileUpdate";

export interface TurnResult {
    isValid: boolean;
    isModelResolved: boolean;
    isPendingSelection: boolean;
    isSwap: boolean;
    selectedPosition: TilePosition;
    isWin: boolean;
    isLose: boolean;
    destroyedPositions: TilePosition[];
    tileMoves: TileMove[];
    tileSpawns: TileSpawn[];
    tileUpdates: TileUpdate[];
    scoreAdded: number;
    totalScore: number;
    movesLeft: number;
}