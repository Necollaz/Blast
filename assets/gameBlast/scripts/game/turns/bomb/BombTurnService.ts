import { BoosterService } from "../../../boosters/BoosterService";
import { GameConfig } from "../../../config/GameConfig";
import { GridModel } from "../../../grid/model/GridModel";
import { GridService } from "../../../grid/services/GridService";
import { TilePosition } from "../../../tiles/TilePosition";
import { TurnResolver } from "../TurnResolver";
import { TurnResult } from "../TurnResult";

export class BombTurnService {
    private _config: GameConfig;
    private _gridService: GridService;
    private _boosterService: BoosterService;
    private _turnResolver: TurnResolver;

    public constructor(
        config: GameConfig,
        gridService: GridService,
        boosterService: BoosterService,
        turnResolver: TurnResolver
    ) {
        this._config = config;
        this._gridService = gridService;
        this._boosterService = boosterService;
        this._turnResolver = turnResolver;
    }

    public createTurn(grid: GridModel, position: TilePosition): TurnResult {
        var tiles = this._gridService.getTilesInRadius(grid, position, this._config.bombRadius);

        if (tiles.length === 0)
            return this._turnResolver.createInvalidTurnResult();

        if (!this._boosterService.spendBombBooster())
            return this._turnResolver.createInvalidTurnResult();

        return this._turnResolver.completeTilesDestroy(grid, tiles, false);
    }
}