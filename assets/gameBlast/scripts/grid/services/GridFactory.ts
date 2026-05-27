import { GameConfig } from "../../config/GameConfig";
import { TileModel } from "../../tiles/TileModel";
import { GridModel } from "../model/GridModel";
import {FIRST_TILE_ID} from "../../core/constants/GridServiceConstants";

export class GridFactory {
    private _config: GameConfig;
    private _nextTileId: number = FIRST_TILE_ID;
    private _random: () => number;

    public constructor(config: GameConfig, random: () => number = Math.random) {
        this._config = config;
        this._random = random;
    }

    public createInitialGrid(): GridModel {
        var grid = new GridModel(this._config.rows, this._config.columns);

        for (var row = 0; row < this._config.rows; row++) {
            for (var column = 0; column < this._config.columns; column++)
                grid.setTile(row, column, this.createTile(row, column));
        }

        return grid;
    }

    public createTile(row: number, column: number): TileModel {
        return new TileModel(this._nextTileId++, row, column, this.getRandomColorId());
    }

    private getRandomColorId(): number {
        return Math.floor(this._random() * this._config.colorsCount);
    }
}