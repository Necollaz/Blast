import { TileModel } from "../../tiles/TileModel";
import { GridModel } from "../model/GridModel";
import {TilePosition} from "../../tiles/TilePosition";
import {RANDOM_INDEX_OFFSET} from "../../core/constants/GridServiceConstants";

export class GridShuffleService {
    private _random: () => number;

    public constructor(random: () => number = Math.random) {
        this._random = random;
    }

    public shuffleTiles(grid: GridModel): void {
        var tiles = this.collectTiles(grid);
        var positions = this.collectPositions(grid);

        this.shuffleTileList(tiles);

        for (var index = 0; index < positions.length; index++)
            grid.setTile(positions[index].row, positions[index].column, tiles[index]);
    }

    private collectTiles(grid: GridModel): TileModel[] {
        var tiles: TileModel[] = [];

        grid.forEachTile((tile: TileModel) => {
            tiles.push(tile);
        });

        return tiles;
    }

    private collectPositions(grid: GridModel): TilePosition[] {
        var positions: TilePosition[] = [];

        for (var row = 0; row < grid.rows; row++) {
            for (var column = 0; column < grid.columns; column++) {
                if (grid.getTile(row, column))
                    positions.push({ row: row, column: column });
            }
        }

        return positions;
    }

    private shuffleTileList(tiles: TileModel[]): void {
        for (var index = tiles.length - RANDOM_INDEX_OFFSET; index > 0; index--) {
            var randomIndex = Math.floor(this._random() * (index + RANDOM_INDEX_OFFSET));
            var temp = tiles[index];

            tiles[index] = tiles[randomIndex];
            tiles[randomIndex] = temp;
        }
    }
}