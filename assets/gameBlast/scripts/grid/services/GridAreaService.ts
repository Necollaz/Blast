import { TileModel } from "../../tiles/TileModel";
import { TilePosition } from "../../tiles/TilePosition";
import { GridModel } from "../model/GridModel";

export class GridAreaService {
    public getTilesInRadius(grid: GridModel, center: TilePosition, radius: number): TileModel[] {
        var tiles: TileModel[] = [];

        for (var row = center.row - radius; row <= center.row + radius; row++) {
            for (var column = center.column - radius; column <= center.column + radius; column++) {
                var tile = grid.getTile(row, column);

                if (tile)
                    tiles.push(tile);
            }
        }

        return tiles;
    }

    public getTilesInRow(grid: GridModel, row: number): TileModel[] {
        var tiles: TileModel[] = [];

        for (var column = 0; column < grid.columns; column++) {
            var tile = grid.getTile(row, column);

            if (tile)
                tiles.push(tile);
        }

        return tiles;
    }

    public getTilesInColumn(grid: GridModel, column: number): TileModel[] {
        var tiles: TileModel[] = [];

        for (var row = 0; row < grid.rows; row++) {
            var tile = grid.getTile(row, column);

            if (tile)
                tiles.push(tile);
        }

        return tiles;
    }

    public getAllTiles(grid: GridModel): TileModel[] {
        var tiles: TileModel[] = [];

        grid.forEachTile((tile: TileModel) => {
            tiles.push(tile);
        });

        return tiles;
    }
}