import { TILE_VIEW_NODE_NAME } from "../../core/constants/BoardViewConstants";
import { TilePosition } from "../../tiles/TilePosition";
import { TileSpawn } from "../../tiles/TileSpawn";
import TileView from "../../tiles/TileView";
import { TileViewData } from "../../tiles/TileViewData";
import { BoardLayout } from "../layout/BoardLayout";
import { BoardTileRegistry } from "../registry/BoardTileRegistry";

export class BoardTileFactory {
    private _root: cc.Node;
    private _tilePrefab: cc.Prefab;
    private _tileSprites: cc.SpriteFrame[];
    private _tileScale: number;
    private _layout: BoardLayout;
    private _registry: BoardTileRegistry;

    public constructor(
        root: cc.Node,
        tilePrefab: cc.Prefab,
        tileSprites: cc.SpriteFrame[],
        tileScale: number,
        layout: BoardLayout,
        registry: BoardTileRegistry
    ) {
        this._root = root;
        this._tilePrefab = tilePrefab;
        this._tileSprites = tileSprites;
        this._tileScale = tileScale;
        this._layout = layout;
        this._registry = registry;
    }

    public create(
        tileData: TileViewData,
        clickHandler: (position: TilePosition) => void,
        hoverHandler: (position: TilePosition) => void
    ): TileView {
        var node = this._tilePrefab ? cc.instantiate(this._tilePrefab) : new cc.Node(TILE_VIEW_NODE_NAME);

        this._root.addChild(node);

        var tileView = node.getComponent(TileView) || node.addComponent(TileView);
        var spriteFrame = this._tileSprites[tileData.colorId] || null;

        tileView.initialize(tileData, spriteFrame, clickHandler, hoverHandler, this._tileScale);
        tileView.setPosition(this._layout.getTilePosition(tileData.row, tileData.column));

        this._registry.add(tileData, tileView);

        return tileView;
    }

    public createSpawn(
        tileSpawn: TileSpawn,
        clickHandler: (position: TilePosition) => void,
        hoverHandler: (position: TilePosition) => void
    ): TileView {
        var tileData: TileViewData = {
            id: tileSpawn.tile.id,
            row: tileSpawn.to.row,
            column: tileSpawn.to.column,
            colorId: tileSpawn.tile.colorId,
            type: tileSpawn.tile.type,
        };

        var tileView = this.create(tileData, clickHandler, hoverHandler);
        tileView.setPosition(this._layout.getTilePosition(tileSpawn.from.row, tileSpawn.from.column));

        return tileView;
    }
}