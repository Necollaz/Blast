import { GridModel } from "../model/GridModel";
import {GridFactory} from "./GridFactory";
import {TileSpawn} from "../../tiles/TileSpawn";
import {RANDOM_INDEX_OFFSET} from "../../core/constants/GridServiceConstants";

export class GridRefillService {
    private _gridFactory: GridFactory;

    public constructor(gridFactory: GridFactory) {
        this._gridFactory = gridFactory;
    }

    public refillEmptyCells(grid: GridModel): TileSpawn[] {
        var spawns: TileSpawn[] = [];

        for (var column = 0; column < grid.columns; column++) {
            var spawnOffset = 0;

            for (var row = 0; row < grid.rows; row++) {
                if (grid.getTile(row, column))
                    continue;

                var tile = this._gridFactory.createTile(row, column);
                var from = { row: grid.rows + spawnOffset, column: column };
                var to = { row: row, column: column };

                grid.setTile(row, column, tile);
                spawns.push({ tile: tile, from: from, to: to });
                spawnOffset++;
            }
        }

        return spawns;
    }

    public createFullBoardSpawns(grid: GridModel): TileSpawn[] {
        var spawns: TileSpawn[] = [];

        for (var row = 0; row < grid.rows; row++) {
            for (var column = 0; column < grid.columns; column++) {
                var tile = grid.getTile(row, column);

                if (!tile)
                    continue;

                spawns.push({
                    tile: tile,
                    from: { row: grid.rows + row + RANDOM_INDEX_OFFSET, column: column },
                    to: { row: row, column: column },
                });
            }
        }

        return spawns;
    }
}