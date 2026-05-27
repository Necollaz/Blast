import { GameConfig } from "../../config/GameConfig";
import { TileModel } from "../../tiles/TileModel";
import { GridModel } from "../model/GridModel";
import {TilePosition} from "../../tiles/TilePosition";
import {ORTHOGONAL_DIRECTIONS, POSITION_KEY_SEPARATOR} from "../../core/constants/GridServiceConstants";

export class GroupFinder {
    private _config: GameConfig;

    public constructor(config: GameConfig) {
        this._config = config;
    }

    public findGroup(grid: GridModel, start: TilePosition): TileModel[] {
        var startTile = grid.getTile(start.row, start.column);

        if (!startTile)
            return [];

        var targetColor = startTile.colorId;
        var result: TileModel[] = [];
        var visited: { [key: string]: boolean } = {};
        var queue: TilePosition[] = [start];

        visited[this.getPositionKey(start.row, start.column)] = true;

        while (queue.length > 0) {
            var current = queue.shift();
            var currentTile = grid.getTile(current.row, current.column);

            if (!currentTile || currentTile.colorId !== targetColor)
                continue;

            result.push(currentTile);
            this.enqueueSameColorNeighbours(grid, current, targetColor, visited, queue);
        }

        return result.length >= this._config.minGroupSize ? result : [];
    }

    public hasAvailableGroup(grid: GridModel): boolean {
        for (var row = 0; row < grid.rows; row++) {
            for (var column = 0; column < grid.columns; column++) {
                if (this.findGroup(grid, { row: row, column: column }).length >= this._config.minGroupSize)
                    return true;
            }
        }

        return false;
    }

    private enqueueSameColorNeighbours(
        grid: GridModel,
        position: TilePosition,
        colorId: number,
        visited: { [key: string]: boolean },
        queue: TilePosition[]
    ): void {
        for (var index = 0; index < ORTHOGONAL_DIRECTIONS.length; index++) {
            var nextRow = position.row + ORTHOGONAL_DIRECTIONS[index].row;
            var nextColumn = position.column + ORTHOGONAL_DIRECTIONS[index].column;
            var key = this.getPositionKey(nextRow, nextColumn);

            if (visited[key] || !grid.isInside(nextRow, nextColumn))
                continue;

            var tile = grid.getTile(nextRow, nextColumn);

            if (tile && tile.colorId === colorId) {
                visited[key] = true;
                queue.push({ row: nextRow, column: nextColumn });
            }
        }
    }

    private getPositionKey(row: number, column: number): string {
        return row + POSITION_KEY_SEPARATOR + column;
    }
}