import { GameConfig } from "../../config/GameConfig";
import { GridModel } from "../../grid/model/GridModel";
import { GridService } from "../../grid/services/GridService";
import { TileModel } from "../../tiles/TileModel";
import { TilePosition } from "../../tiles/TilePosition";
import { TileType } from "../../tiles/TileType";

export class SuperTileEffectService {
    private _config: GameConfig;
    private _gridService: GridService;

    public constructor(config: GameConfig, gridService: GridService) {
        this._config = config;
        this._gridService = gridService;
    }

    public getAffectedTiles(grid: GridModel, position: TilePosition): TileModel[] {
        var tile = grid.getTile(position.row, position.column);

        if (!tile)
            return [];

        if (tile.type === TileType.RowRocket)
            return this._gridService.getTilesInRow(grid, position.row);

        if (tile.type === TileType.ColumnRocket)
            return this._gridService.getTilesInColumn(grid, position.column);

        if (tile.type === TileType.RadiusBomb)
            return this._gridService.getTilesInRadius(grid, position, this._config.superTileRadius);

        if (tile.type === TileType.ClearBoardBomb)
            return this._gridService.getAllTiles(grid);

        return [];
    }
}