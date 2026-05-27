import { TileModel } from "../../tiles/TileModel";
import { GridModel } from "../model/GridModel";
import {TileMove} from "../../tiles/TileMove";

export class GridGravityService {
    public removeTiles(grid: GridModel, tiles: TileModel[]): void {
        for (var index = 0; index < tiles.length; index++)
            grid.removeTile(tiles[index].row, tiles[index].column);
    }

    public collapseColumns(grid: GridModel): TileMove[] {
        var moves: TileMove[] = [];

        for (var column = 0; column < grid.columns; column++) {
            var nextFreeRow = 0;

            for (var row = 0; row < grid.rows; row++) {
                var tile = grid.getTile(row, column);

                if (!tile)
                    continue;

                if (row !== nextFreeRow) {
                    var from = { row: row, column: column };
                    var to = { row: nextFreeRow, column: column };

                    grid.setTile(nextFreeRow, column, tile);
                    grid.setTile(row, column, null);
                    moves.push({ tile: tile, from: from, to: to });
                }

                nextFreeRow++;
            }
        }

        return moves;
    }
}