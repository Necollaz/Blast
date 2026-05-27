import { GRID_POSITION_OUT_OF_BOUNDS_ERROR_MESSAGE } from "../../core/constants/GridModelConstants";
import { TileModel } from "../../tiles/TileModel";

export class GridModel {
    private _rows: number;
    private _columns: number;
    private _cells: Array<Array<TileModel>>;

    public constructor(rows: number, columns: number) {
        this._rows = rows;
        this._columns = columns;
        this._cells = [];

        for (var row = 0; row < rows; row++) {
            this._cells[row] = [];

            for (var column = 0; column < columns; column++)
                this._cells[row][column] = null;
        }
    }

    public isInside(row: number, column: number): boolean {
        return row >= 0 && row < this._rows && column >= 0 && column < this._columns;
    }

    public getTile(row: number, column: number): TileModel {
        if (!this.isInside(row, column))
            return null;

        return this._cells[row][column];
    }

    public setTile(row: number, column: number, tile: TileModel): void {
        if (!this.isInside(row, column))
            throw new Error(GRID_POSITION_OUT_OF_BOUNDS_ERROR_MESSAGE + row + ", " + column);

        this._cells[row][column] = tile;

        if (tile)
            tile.moveTo({ row: row, column: column });
    }

    public removeTile(row: number, column: number): TileModel {
        var tile = this.getTile(row, column);

        if (tile)
            this._cells[row][column] = null;

        return tile;
    }

    public forEachTile(callback: (tile: TileModel) => void): void {
        for (var row = 0; row < this._rows; row++) {
            for (var column = 0; column < this._columns; column++) {
                var tile = this._cells[row][column];

                if (tile)
                    callback(tile);
            }
        }
    }

    public get rows(): number {
        return this._rows;
    }

    public get columns(): number {
        return this._columns;
    }
}