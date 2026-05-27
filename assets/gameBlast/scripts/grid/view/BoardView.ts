import {
    DEFAULT_CELL_GAP,
    DEFAULT_CELL_SIZE,
    DEFAULT_TILE_SCALE
} from "../../core/constants/BoardViewConstants";
import { TileMove } from "../../tiles/TileMove";
import { TilePosition } from "../../tiles/TilePosition";
import { TileSpawn } from "../../tiles/TileSpawn";
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
        //
        cc.log("BoardView render tiles: " + viewData.tiles.length);
        //
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