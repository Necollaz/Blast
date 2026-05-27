import {
    DEFAULT_CELL_GAP,
    DEFAULT_CELL_SIZE,
    DEFAULT_TILE_SCALE
} from "../../core/constants/BoardViewConstants";
import { TileMove } from "../../tiles/TileMove";
import { TilePosition } from "../../tiles/TilePosition";
import { TileSpawn } from "../../tiles/TileSpawn";
import { TileUpdate } from "../../tiles/TileUpdate";
import { TileViewData } from "../../tiles/TileViewData";
import { BoardAnimationPlayer } from "../animation/BoardAnimationPlayer";
import { DestroyEffectPlayer } from "../animation/DestroyEffectPlayer";
import { BoardTileFactory } from "../factory/BoardTileFactory";
import { BoardLayout } from "../layout/BoardLayout";
import { BoardTileRegistry } from "../registry/BoardTileRegistry";
import { TileSelectionHighlighter } from "../selection/TileSelectionHighlighter";
import { BoardViewData } from "./BoardViewData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardView extends cc.Component {
    @property(cc.Prefab) private tilePrefab: cc.Prefab = null;
    @property(cc.Prefab) private destroyEffectPrefab: cc.Prefab = null;
    @property(cc.Node) private tilesRoot: cc.Node = null;
    @property([cc.SpriteFrame]) private tileSprites: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) private rowRocketSprite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) private columnRocketSprite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) private radiusBombSprite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) private clearBoardBombSprite: cc.SpriteFrame = null;
    @property private cellSize: number = DEFAULT_CELL_SIZE;
    @property private cellGap: number = DEFAULT_CELL_GAP;
    @property private tileScale: number = DEFAULT_TILE_SCALE;

    private _clickHandler: (position: TilePosition) => void = null;
    private _layout: BoardLayout = null;
    private _registry: BoardTileRegistry = new BoardTileRegistry();
    private _tileFactory: BoardTileFactory = null;
    private _animationPlayer: BoardAnimationPlayer = null;
    private _selectionHighlighter: TileSelectionHighlighter = null;

    public render(viewData: BoardViewData, clickHandler: (position: TilePosition) => void): void {
        cc.log("BoardView render tiles: " + viewData.tiles.length);

        this._clickHandler = clickHandler;
        this.ensureHelpers(viewData.rows, viewData.columns);
        this.clearTiles();

        for (var index = 0; index < viewData.tiles.length; index++)
            this._tileFactory.create(viewData.tiles[index], this._clickHandler, this.handleTileHover.bind(this));
    }

    public clearTiles(): void {
        this.getTilesRoot().removeAllChildren();
        this._registry.clear();

        if (this._selectionHighlighter)
            this._selectionHighlighter.clear();
    }

    public applyTileUpdates(tileUpdates: TileUpdate[]): void {
        if (!tileUpdates || tileUpdates.length === 0)
            return;

        for (var index = 0; index < tileUpdates.length; index++) {
            var tileUpdate = tileUpdates[index];
            var tileView = this._registry.get(tileUpdate.position);

            if (!tileView)
                continue;

            var tileData: TileViewData = {
                id: tileUpdate.tile.id,
                row: tileUpdate.tile.row,
                column: tileUpdate.tile.column,
                colorId: tileUpdate.tile.colorId,
                type: tileUpdate.tile.type,
            };

            tileView.updateViewData(tileData, this._tileFactory.getSpriteFrame(tileData));
        }
    }

    public setBombSelectionEnabled(isEnabled: boolean): void {
        if (this._selectionHighlighter)
            this._selectionHighlighter.setEnabled(isEnabled);
    }

    public playDestroyAnimation(positions: TilePosition[], onComplete: () => void): void {
        this._animationPlayer.playDestroyAnimation(positions, onComplete);
    }

    public playFallAnimation(tileMoves: TileMove[], onComplete: () => void): void {
        this._animationPlayer.playFallAnimation(tileMoves, onComplete);
    }

    public playSpawnAnimation(tileSpawns: TileSpawn[], onComplete: () => void): void {
        this._animationPlayer.playSpawnAnimation(
            tileSpawns,
            this._clickHandler,
            this.handleTileHover.bind(this),
            onComplete
        );
    }

    public playMoveAnimation(tileMoves: TileMove[], onComplete: () => void): void {
        this._animationPlayer.playMoveAnimation(tileMoves, onComplete);
    }

    public highlightTile(position: TilePosition): void {
        if (this._selectionHighlighter)
            this._selectionHighlighter.highlight(position);
    }

    public clearSelectionHighlight(): void {
        if (this._selectionHighlighter)
            this._selectionHighlighter.clear();
    }

    private handleTileHover(position: TilePosition): void {
        if (this._selectionHighlighter)
            this._selectionHighlighter.handleHover(position);
    }

    private ensureHelpers(rows: number, columns: number): void {
        if (!this._layout)
            this._layout = new BoardLayout(rows, columns, this.cellSize, this.cellGap);
        else
            this._layout.setGridSize(rows, columns);

        var root = this.getTilesRoot();
        var destroyEffectPlayer = new DestroyEffectPlayer(this, root, this.destroyEffectPrefab);

        this._tileFactory = new BoardTileFactory(
            root,
            this.tilePrefab,
            this.tileSprites,
            this.rowRocketSprite,
            this.columnRocketSprite,
            this.radiusBombSprite,
            this.clearBoardBombSprite,
            this.tileScale,
            this._layout,
            this._registry
        );

        this._animationPlayer = new BoardAnimationPlayer(
            this._layout,
            this._registry,
            this._tileFactory,
            destroyEffectPlayer
        );

        if (!this._selectionHighlighter)
            this._selectionHighlighter = new TileSelectionHighlighter(this._registry);
    }

    private getTilesRoot(): cc.Node {
        return this.tilesRoot || this.node;
    }
}