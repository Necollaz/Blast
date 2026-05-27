import { TileType } from "./TileType";

export interface TileViewData {
    id: number;
    row: number;
    column: number;
    colorId: number;
    type: TileType;
}