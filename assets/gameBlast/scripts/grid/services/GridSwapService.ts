import { TileMove } from "../../tiles/TileMove";
import { TilePosition } from "../../tiles/TilePosition";
import { GridModel } from "../model/GridModel";

export class GridSwapService {
    public swapTiles(grid: GridModel, first: TilePosition, second: TilePosition): TileMove[] {
        if (first.row === second.row && first.column === second.column)
            return [];

        var firstTile = grid.getTile(first.row, first.column);
        var secondTile = grid.getTile(second.row, second.column);

        if (!firstTile || !secondTile)
            return [];

        var firstFrom = { row: first.row, column: first.column };
        var firstTo = { row: second.row, column: second.column };
        var secondFrom = { row: second.row, column: second.column };
        var secondTo = { row: first.row, column: first.column };

        grid.setTile(first.row, first.column, secondTile);
        grid.setTile(second.row, second.column, firstTile);

        return [
            { tile: firstTile, from: firstFrom, to: firstTo },
            { tile: secondTile, from: secondFrom, to: secondTo },
        ];
    }
}