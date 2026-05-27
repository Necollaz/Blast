import { TILE_FULL_OPACITY } from "../core/constants/TileAnimationConstants";
import { TileAnimator } from "./TileAnimator";
import { TilePosition } from "./TilePosition";
import { TileViewData } from "./TileViewData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TileView extends cc.Component {
    @property(cc.Sprite) private sprite: cc.Sprite = null;

    private _viewData: TileViewData = null;
    private _clickHandler: (position: TilePosition) => void = null;
    private _hoverHandler: (position: TilePosition) => void = null;
    private _animator: TileAnimator = null;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.handleClick, this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.handleMouseEnter, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.handleClick, this);
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.handleMouseEnter, this);
    }

    public initialize(
        viewData: TileViewData,
        spriteFrame: cc.SpriteFrame,
        clickHandler: (position: TilePosition) => void,
        hoverHandler: (position: TilePosition) => void,
        tileScale: number
    ): void {
        this._viewData = viewData;
        this._clickHandler = clickHandler;
        this._hoverHandler = hoverHandler;

        if (!this._animator)
            this._animator = new TileAnimator(this.node, tileScale);

        this._animator.reset(tileScale);
        this.node.opacity = TILE_FULL_OPACITY;

        if (!this.sprite)
            this.sprite = this.getComponent(cc.Sprite);

        this.setSpriteFrame(spriteFrame);
    }

    public updateViewData(viewData: TileViewData, spriteFrame: cc.SpriteFrame): void {
        this._viewData = viewData;
        this.setSpriteFrame(spriteFrame);
    }

    public setPosition(position: cc.Vec2): void {
        this.node.setPosition(position);
    }

    public playHighlightAnimation(): void {
        this._animator.playHighlight();
    }

    public stopHighlightAnimation(): void {
        this._animator.stopHighlight();
    }

    public playDestroyAnimation(onComplete: () => void): void {
        this._animator.playDestroy(onComplete);
    }

    public playMoveAnimation(targetPosition: cc.Vec2, duration: number, onComplete: () => void): void {
        this._animator.playMove(targetPosition, duration, onComplete);
    }

    public playSpawnAnimation(targetPosition: cc.Vec2, delay: number, onComplete: () => void): void {
        this._animator.playSpawn(targetPosition, delay, onComplete);
    }

    private setSpriteFrame(spriteFrame: cc.SpriteFrame): void {
        if (!this.sprite)
            this.sprite = this.getComponent(cc.Sprite);

        if (this.sprite && spriteFrame)
            this.sprite.spriteFrame = spriteFrame;
    }

    private handleClick(): void {
        if (this._viewData && this._clickHandler)
            this._clickHandler({ row: this._viewData.row, column: this._viewData.column });
    }

    private handleMouseEnter(): void {
        if (this._viewData && this._hoverHandler)
            this._hoverHandler({ row: this._viewData.row, column: this._viewData.column });
    }
}