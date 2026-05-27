import { GameConfig } from "../../config/GameConfig";
import { TileModel } from "../../tiles/TileModel";
import { TileMove } from "../../tiles/TileMove";
import { TilePosition } from "../../tiles/TilePosition";
import { TileSpawn } from "../../tiles/TileSpawn";
import { GridModel } from "../model/GridModel";
import { GridAreaService } from "./GridAreaService";
import { GridFactory } from "./GridFactory";
import { GridGravityService } from "./GridGravityService";
import { GridRefillService } from "./GridRefillService";
import { GridShuffleService } from "./GridShuffleService";
import { GroupFinder } from "./GroupFinder";

export class GridService {
    private _gridFactory: GridFactory;
    private _groupFinder: GroupFinder;
    private _gravityService: GridGravityService;
    private _refillService: GridRefillService;
    private _shuffleService: GridShuffleService;
    private _areaService: GridAreaService;

    public constructor(config: GameConfig, random: () => number = Math.random) {
        this._gridFactory = new GridFactory(config, random);
        this._groupFinder = new GroupFinder(config);
        this._gravityService = new GridGravityService();
        this._refillService = new GridRefillService(this._gridFactory);
        this._shuffleService = new GridShuffleService(random);
        this._areaService = new GridAreaService();
    }

    public createInitialGrid(): GridModel {
        return this._gridFactory.createInitialGrid();
    }

    public createTile(row: number, column: number): TileModel {
        return this._gridFactory.createTile(row, column);
    }

    public findGroup(grid: GridModel, start: TilePosition): TileModel[] {
        return this._groupFinder.findGroup(grid, start);
    }

    public getTilesInRadius(grid: GridModel, center: TilePosition, radius: number): TileModel[] {
        return this._areaService.getTilesInRadius(grid, center, radius);
    }

    public removeTiles(grid: GridModel, tiles: TileModel[]): void {
        this._gravityService.removeTiles(grid, tiles);
    }

    public collapseColumns(grid: GridModel): TileMove[] {
        return this._gravityService.collapseColumns(grid);
    }

    public refillEmptyCells(grid: GridModel): TileSpawn[] {
        return this._refillService.refillEmptyCells(grid);
    }

    public createFullBoardSpawns(grid: GridModel): TileSpawn[] {
        return this._refillService.createFullBoardSpawns(grid);
    }

    public hasAvailableGroup(grid: GridModel): boolean {
        return this._groupFinder.hasAvailableGroup(grid);
    }

    public shuffleTiles(grid: GridModel): void {
        this._shuffleService.shuffleTiles(grid);
    }

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