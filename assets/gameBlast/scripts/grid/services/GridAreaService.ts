import { TileModel } from "../../tiles/TileModel";
import { GridModel } from "../model/GridModel";
import {TilePosition} from "../../tiles/TilePosition";

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
}