import { TileMove } from "../../tiles/TileMove";
import { TilePosition } from "../../tiles/TilePosition";
import { TileSpawn } from "../../tiles/TileSpawn";

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
    scoreAdded: number;
    totalScore: number;
    movesLeft: number;
}