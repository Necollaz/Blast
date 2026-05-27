import { TilePosition } from "./TilePosition";
import { TileType } from "./TileType";

export class TileModel {
    private _id: number;
    private _row: number;
    private _column: number;
    private _colorId: number;
    private _type: TileType;

    public constructor(id: number, row: number, column: number, colorId: number, type: TileType = TileType.Default) {
        this._id = id;
        this._row = row;
        this._column = column;
        this._colorId = colorId;
        this._type = type;
    }

    public moveTo(position: TilePosition): void {
        this._row = position.row;
        this._column = position.column;
    }

    public changeType(type: TileType): void {
        this._type = type;
    }

    public get id(): number {
        return this._id;
    }

    public get row(): number {
        return this._row;
    }

    public get column(): number {
        return this._column;
    }

    public get colorId(): number {
        return this._colorId;
    }

    public get type(): TileType {
        return this._type;
    }
}