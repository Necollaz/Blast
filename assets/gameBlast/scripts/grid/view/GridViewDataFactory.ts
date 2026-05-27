import { TileModel } from "../../tiles/TileModel";
import { TileViewData } from "../../tiles/TileViewData";
import { GridModel } from "../model/GridModel";
import { BoardViewData } from "./BoardViewData";

export class GridViewDataFactory {
    public create(grid: GridModel): BoardViewData {
        var tiles: TileViewData[] = [];

        grid.forEachTile((tile: TileModel) => {
            tiles.push(this.createTileViewData(tile));
        });

        return {
            rows: grid.rows,
            columns: grid.columns,
            tiles: tiles,
        };
    }

    private createTileViewData(tile: TileModel): TileViewData {
        return {
            id: tile.id,
            row: tile.row,
            column: tile.column,
            colorId: tile.colorId,
            type: tile.type,
        };
    }
}