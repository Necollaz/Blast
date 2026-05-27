import { GameConfig } from "../../config/GameConfig";
import { TileModel } from "../../tiles/TileModel";
import { TilePosition } from "../../tiles/TilePosition";
import { TileType } from "../../tiles/TileType";

export class SuperTileCreationService {
    private _config: GameConfig;

    public constructor(config: GameConfig) {
        this._config = config;
    }

    public getSuperTileType(tiles: TileModel[], origin: TilePosition): TileType {
        if (tiles.length >= this._config.superTileClearBoardMinGroupSize)
            return TileType.ClearBoardBomb;

        if (tiles.length >= this._config.superTileRadiusMinGroupSize)
            return TileType.RadiusBomb;

        if (tiles.length >= this._config.superTileLineMinGroupSize)
            return this.getLineSuperTileType(tiles, origin);

        return null;
    }

    private getLineSuperTileType(tiles: TileModel[], origin: TilePosition): TileType {
        var horizontalCount = this.getMaxTilesCountInRows(tiles);
        var verticalCount = this.getMaxTilesCountInColumns(tiles);

        if (horizontalCount > verticalCount)
            return TileType.RowRocket;

        if (verticalCount > horizontalCount)
            return TileType.ColumnRocket;

        return this.getFallbackLineSuperTileType(tiles, origin);
    }

    private getFallbackLineSuperTileType(tiles: TileModel[], origin: TilePosition): TileType {
        var minRow = origin.row;
        var maxRow = origin.row;
        var minColumn = origin.column;
        var maxColumn = origin.column;

        for (var index = 0; index < tiles.length; index++) {
            minRow = Math.min(minRow, tiles[index].row);
            maxRow = Math.max(maxRow, tiles[index].row);
            minColumn = Math.min(minColumn, tiles[index].column);
            maxColumn = Math.max(maxColumn, tiles[index].column);
        }

        var height = maxRow - minRow + 1;
        var width = maxColumn - minColumn + 1;

        if (width >= height)
            return TileType.RowRocket;

        return TileType.ColumnRocket;
    }

    private getMaxTilesCountInRows(tiles: TileModel[]): number {
        var maxCount = 0;

        for (var index = 0; index < tiles.length; index++) {
            var count = this.getTilesCountInRow(tiles, tiles[index].row);
            maxCount = Math.max(maxCount, count);
        }

        return maxCount;
    }

    private getMaxTilesCountInColumns(tiles: TileModel[]): number {
        var maxCount = 0;

        for (var index = 0; index < tiles.length; index++) {
            var count = this.getTilesCountInColumn(tiles, tiles[index].column);
            maxCount = Math.max(maxCount, count);
        }

        return maxCount;
    }

    private getTilesCountInRow(tiles: TileModel[], row: number): number {
        var count = 0;

        for (var index = 0; index < tiles.length; index++) {
            if (tiles[index].row === row)
                count++;
        }

        return count;
    }

    private getTilesCountInColumn(tiles: TileModel[], column: number): number {
        var count = 0;

        for (var index = 0; index < tiles.length; index++) {
            if (tiles[index].column === column)
                count++;
        }

        return count;
    }
}