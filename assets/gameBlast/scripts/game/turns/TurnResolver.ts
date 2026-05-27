import {
    LOSE_BY_MOVES_LOG_MESSAGE,
    MOVES_LEFT_LOG_MESSAGE,
    SCORE_ADDED_LOG_MESSAGE,
    TILE_DESTROYED_LOG_MESSAGE,
    TOTAL_SCORE_LOG_MESSAGE,
    WIN_LOG_MESSAGE
} from "../../core/constants/GameControllerConstants";
import { ScoreService } from "../../core/services/ScoreService";
import { GridModel } from "../../grid/model/GridModel";
import { GridService } from "../../grid/services/GridService";
import { TileModel } from "../../tiles/TileModel";
import { TileMove } from "../../tiles/TileMove";
import { TilePosition } from "../../tiles/TilePosition";
import { TileSpawn } from "../../tiles/TileSpawn";
import { TileType } from "../../tiles/TileType";
import { TileUpdate } from "../../tiles/TileUpdate";
import { GameRulesService } from "../rules/GameRulesService";
import { GameSession } from "../session/GameSession";
import { TurnResult } from "./TurnResult";

export class TurnResolver {
    private _gridService: GridService;
    private _scoreService: ScoreService;
    private _rulesService: GameRulesService;
    private _session: GameSession;

    public constructor(
        gridService: GridService,
        scoreService: ScoreService,
        rulesService: GameRulesService,
        session: GameSession
    ) {
        this._gridService = gridService;
        this._scoreService = scoreService;
        this._rulesService = rulesService;
        this._session = session;
    }

    public createPendingGroupTurn(tiles: TileModel[], preservedPosition: TilePosition = null): TurnResult {
        return {
            isValid: true,
            isModelResolved: false,
            isPendingSelection: false,
            isSwap: false,
            selectedPosition: null,
            isWin: false,
            isLose: false,
            destroyedPositions: this.getTilePositions(this.getTilesWithoutPosition(tiles, preservedPosition)),
            tileMoves: [],
            tileSpawns: [],
            tileUpdates: [],
            scoreAdded: this._scoreService.calculateScore(tiles.length),
            totalScore: this._session.score,
            movesLeft: this._session.movesLeft,
        };
    }

    public completeTilesDestroy(
        grid: GridModel,
        tiles: TileModel[],
        shouldSpendMove: boolean,
        superTilePosition: TilePosition = null,
        superTileType: TileType = null
    ): TurnResult {
        var tilesToRemove = this.getTilesWithoutPosition(tiles, superTilePosition);
        var destroyedPositions = this.getTilePositions(tilesToRemove);
        var scoreAdded = this._scoreService.calculateScore(tiles.length);
        var tileUpdates: TileUpdate[] = [];
        
        if (superTilePosition && superTileType) {
            var superTile = grid.getTile(superTilePosition.row, superTilePosition.column);

            if (superTile) {
                superTile.changeType(superTileType);
                tileUpdates.push({
                    position: superTilePosition,
                    tile: superTile,
                });
            }
        }

        this._gridService.removeTiles(grid, tilesToRemove);

        var tileMoves: TileMove[] = this._gridService.collapseColumns(grid);
        var tileSpawns: TileSpawn[] = this._gridService.refillEmptyCells(grid);

        this._session.addScore(scoreAdded);

        if (shouldSpendMove)
            this._session.spendMove();

        var isWin = this._rulesService.isWin(this._session.score);
        var isLoseByMoves = this._rulesService.isLoseByMoves(this._session.score, this._session.movesLeft);

        return {
            isValid: true,
            isModelResolved: true,
            isPendingSelection: false,
            isSwap: false,
            selectedPosition: null,
            isWin: isWin,
            isLose: isLoseByMoves,
            destroyedPositions: destroyedPositions,
            tileMoves: tileMoves,
            tileSpawns: tileSpawns,
            tileUpdates: tileUpdates,
            scoreAdded: scoreAdded,
            totalScore: this._session.score,
            movesLeft: this._session.movesLeft,
        };
    }

    public createInvalidTurnResult(): TurnResult {
        return {
            isValid: false,
            isModelResolved: false,
            isPendingSelection: false,
            isSwap: false,
            selectedPosition: null,
            isWin: false,
            isLose: false,
            destroyedPositions: [],
            tileMoves: [],
            tileSpawns: [],
            tileUpdates: [],
            scoreAdded: 0,
            totalScore: this._session.score,
            movesLeft: this._session.movesLeft,
        };
    }

    private getTilesWithoutPosition(tiles: TileModel[], position: TilePosition): TileModel[] {
        if (!position)
            return tiles;

        var result: TileModel[] = [];

        for (var index = 0; index < tiles.length; index++) {
            if (tiles[index].row === position.row && tiles[index].column === position.column)
                continue;

            result.push(tiles[index]);
        }

        return result;
    }

    private getTilePositions(tiles: TileModel[]): TilePosition[] {
        var positions: TilePosition[] = [];

        for (var index = 0; index < tiles.length; index++) {
            positions.push({
                row: tiles[index].row,
                column: tiles[index].column,
            });
        }

        return positions;
    }
}