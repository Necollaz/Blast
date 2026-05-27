import { BoosterService } from "../../../boosters/BoosterService";
import { GridModel } from "../../../grid/model/GridModel";
import { GridService } from "../../../grid/services/GridService";
import { TilePosition } from "../../../tiles/TilePosition";
import { TurnResolver } from "../TurnResolver";
import { TurnResult } from "../TurnResult";

export class TeleportTurnService {
    private _gridService: GridService;
    private _boosterService: BoosterService;
    private _turnResolver: TurnResolver;
    private _firstPosition: TilePosition = null;

    public constructor(
        gridService: GridService,
        boosterService: BoosterService,
        turnResolver: TurnResolver
    ) {
        this._gridService = gridService;
        this._boosterService = boosterService;
        this._turnResolver = turnResolver;
    }

    public reset(): void {
        this._firstPosition = null;
    }

    public createTurn(grid: GridModel, position: TilePosition): TurnResult {
        var tile = grid.getTile(position.row, position.column);

        if (!tile)
            return this._turnResolver.createInvalidTurnResult();

        if (!this._firstPosition) {
            this._firstPosition = { row: position.row, column: position.column };
            return this.createPendingSelectionResult(this._firstPosition);
        }

        if (this._firstPosition.row === position.row && this._firstPosition.column === position.column)
            return this.createPendingSelectionResult(this._firstPosition);

        var tileMoves = this._gridService.swapTiles(grid, this._firstPosition, position);

        if (tileMoves.length === 0)
            return this._turnResolver.createInvalidTurnResult();

        if (!this._boosterService.spendTeleportBooster())
            return this._turnResolver.createInvalidTurnResult();

        this._firstPosition = null;

        return {
            isValid: true,
            isModelResolved: true,
            isPendingSelection: false,
            isSwap: true,
            selectedPosition: null,
            isWin: false,
            isLose: false,
            destroyedPositions: [],
            tileMoves: tileMoves,
            tileSpawns: [],
            scoreAdded: 0,
            totalScore: 0,
            movesLeft: 0,
        };
    }

    private createPendingSelectionResult(position: TilePosition): TurnResult {
        return {
            isValid: true,
            isModelResolved: false,
            isPendingSelection: true,
            isSwap: false,
            selectedPosition: position,
            isWin: false,
            isLose: false,
            destroyedPositions: [],
            tileMoves: [],
            tileSpawns: [],
            scoreAdded: 0,
            totalScore: 0,
            movesLeft: 0,
        };
    }
}