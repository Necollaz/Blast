import { TilePosition } from "../../tiles/TilePosition";
import TileView from "../../tiles/TileView";
import { BoardTileRegistry } from "../registry/BoardTileRegistry";

export class TileSelectionHighlighter {
    private _registry: BoardTileRegistry;
    private _isEnabled: boolean = false;
    private _highlightedTileView: TileView = null;

    public constructor(registry: BoardTileRegistry) {
        this._registry = registry;
    }

    public setEnabled(isEnabled: boolean): void {
        this._isEnabled = isEnabled;

        if (!isEnabled)
            this.clear();
    }

    public handleHover(position: TilePosition): void {
        if (!this._isEnabled)
            return;

        this.highlight(position);
    }

    public highlight(position: TilePosition): void {
        var tileView = this._registry.get(position);

        if (!tileView || tileView === this._highlightedTileView)
            return;

        this.clear();

        this._highlightedTileView = tileView;
        this._highlightedTileView.playHighlightAnimation();
    }

    public clear(): void {
        if (!this._highlightedTileView)
            return;

        this._highlightedTileView.stopHighlightAnimation();
        this._highlightedTileView = null;
    }
}