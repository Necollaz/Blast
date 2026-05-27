import { TILE_VIEW_NODE_NAME } from "../../core/constants/BoardViewConstants";
import { TilePosition } from "../../tiles/TilePosition";
import { TileSpawn } from "../../tiles/TileSpawn";
import { TileType } from "../../tiles/TileType";
import TileView from "../../tiles/TileView";
import { TileViewData } from "../../tiles/TileViewData";
import { BoardLayout } from "../layout/BoardLayout";
import { BoardTileRegistry } from "../registry/BoardTileRegistry";

export class BoardTileFactory {
    private _root: cc.Node;
    private _tilePrefab: cc.Prefab;
    private _tileSprites: cc.SpriteFrame[];
    private _rowRocketSprite: cc.SpriteFrame;
    private _columnRocketSprite: cc.SpriteFrame;
    private _radiusBombSprite: cc.SpriteFrame;
    private _clearBoardBombSprite: cc.SpriteFrame;
    private _tileScale: number;
    private _layout: BoardLayout;
    private _registry: BoardTileRegistry;

    public constructor(
        root: cc.Node,
        tilePrefab: cc.Prefab,
        tileSprites: cc.SpriteFrame[],
        rowRocketSprite: cc.SpriteFrame,
        columnRocketSprite: cc.SpriteFrame,
        radiusBombSprite: cc.SpriteFrame,
        clearBoardBombSprite: cc.SpriteFrame,
        tileScale: number,
        layout: BoardLayout,
        registry: BoardTileRegistry
    ) {
        this._root = root;
        this._tilePrefab = tilePrefab;
        this._tileSprites = tileSprites;
        this._rowRocketSprite = rowRocketSprite;
        this._columnRocketSprite = columnRocketSprite;
        this._radiusBombSprite = radiusBombSprite;
        this._clearBoardBombSprite = clearBoardBombSprite;
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
        var spriteFrame = this.getSpriteFrame(tileData);

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

    public getSpriteFrame(tileData: TileViewData): cc.SpriteFrame {
        if (tileData.type === TileType.RowRocket && this._rowRocketSprite)
            return this._rowRocketSprite;

        if (tileData.type === TileType.ColumnRocket && this._columnRocketSprite)
            return this._columnRocketSprite;

        if (tileData.type === TileType.RadiusBomb && this._radiusBombSprite)
            return this._radiusBombSprite;

        if (tileData.type === TileType.ClearBoardBomb && this._clearBoardBombSprite)
            return this._clearBoardBombSprite;

        return this._tileSprites[tileData.colorId] || null;
    }
}