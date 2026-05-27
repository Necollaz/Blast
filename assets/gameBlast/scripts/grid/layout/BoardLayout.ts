import { CENTER_OFFSET_DIVIDER } from "../../core/constants/BoardViewConstants";

export class BoardLayout {
    private _rows: number;
    private _columns: number;
    private _cellSize: number;
    private _cellGap: number;

    public constructor(rows: number, columns: number, cellSize: number, cellGap: number) {
        this._rows = rows;
        this._columns = columns;
        this._cellSize = cellSize;
        this._cellGap = cellGap;
    }

    public setGridSize(rows: number, columns: number): void {
        this._rows = rows;
        this._columns = columns;
    }

    public getTilePosition(row: number, column: number): cc.Vec2 {
        var step = this._cellSize + this._cellGap;
        var x = (column - (this._columns - 1) / CENTER_OFFSET_DIVIDER) * step;
        var y = (row - (this._rows - 1) / CENTER_OFFSET_DIVIDER) * step;

        return cc.v2(x, y);
    }

    public getBoardWidth(): number {
        return this._columns * this._cellSize + (this._columns - 1) * this._cellGap;
    }

    public getBoardHeight(): number {
        return this._rows * this._cellSize + (this._rows - 1) * this._cellGap;
    }

    public get step(): number {
        return this._cellSize + this._cellGap;
    }

    public get rows(): number {
        return this._rows;
    }

    public get columns(): number {
        return this._columns;
    }
}