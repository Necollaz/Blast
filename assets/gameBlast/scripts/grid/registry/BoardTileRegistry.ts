import { BOARD_POSITION_KEY_SEPARATOR } from "../../core/constants/BoardViewConstants";
import { TilePosition } from "../../tiles/TilePosition";
import TileView from "../../tiles/TileView";

export class BoardTileRegistry {
    private _tileViewsByPosition: { [key: string]: TileView } = {};

    public add(position: TilePosition, tileView: TileView): void {
        this._tileViewsByPosition[this.getPositionKey(position)] = tileView;
    }

    public get(position: TilePosition): TileView {
        return this._tileViewsByPosition[this.getPositionKey(position)] || null;
    }

    public clear(): void {
        this._tileViewsByPosition = {};
    }

    private getPositionKey(position: TilePosition): string {
        return position.row + BOARD_POSITION_KEY_SEPARATOR + position.column;
    }
}