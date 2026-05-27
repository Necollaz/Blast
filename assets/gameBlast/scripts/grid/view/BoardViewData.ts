import { TileViewData } from "../../tiles/TileViewData";

export interface BoardViewData {
    rows: number;
    columns: number;
    tiles: TileViewData[];
}