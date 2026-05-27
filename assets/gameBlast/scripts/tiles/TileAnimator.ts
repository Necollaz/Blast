import {
    TILE_DESTROY_FADE_DURATION,
    TILE_DESTROY_OPACITY,
    TILE_DESTROY_PUNCH_DURATION,
    TILE_DESTROY_PUNCH_SCALE_MULTIPLIER,
    TILE_DESTROY_SCALE,
    TILE_FULL_OPACITY,
    TILE_HIGHLIGHT_DURATION,
    TILE_HIGHLIGHT_MIN_OPACITY,
    TILE_SPAWN_BOUNCE_DURATION,
    TILE_SPAWN_BOUNCE_SCALE_MULTIPLIER,
    TILE_SPAWN_MOVE_DURATION,
    TILE_SPAWN_START_SCALE_MULTIPLIER
} from "../core/constants/TileAnimationConstants";

export class TileAnimator {
    private _node: cc.Node;
    private _baseScale: number;
    private _isHighlighted: boolean = false;

    public constructor(node: cc.Node, baseScale: number) {
        this._node = node;
        this._baseScale = baseScale;
    }

    public reset(baseScale: number): void {
        this._baseScale = baseScale;
        this._isHighlighted = false;
        this._node.stopAllActions();
        this._node.opacity = TILE_FULL_OPACITY;
        this._node.scale = this._baseScale;
    }

    public playHighlight(): void {
        if (this._isHighlighted)
            return;

        this._isHighlighted = true;
        this._node.stopAllActions();

        cc.tween(this._node)
            .repeatForever(
                cc.tween()
                    .to(TILE_HIGHLIGHT_DURATION, { opacity: TILE_HIGHLIGHT_MIN_OPACITY })
                    .to(TILE_HIGHLIGHT_DURATION, { opacity: TILE_FULL_OPACITY })
            )
            .start();
    }

    public stopHighlight(): void {
        if (!this._isHighlighted)
            return;

        this._isHighlighted = false;
        this._node.stopAllActions();
        this._node.opacity = TILE_FULL_OPACITY;
        this._node.scale = this._baseScale;
    }

    public playDestroy(onComplete: () => void): void {
        this.stopHighlight();
        this._node.stopAllActions();

        cc.tween(this._node)
            .to(TILE_DESTROY_PUNCH_DURATION, {
                scale: this._baseScale * TILE_DESTROY_PUNCH_SCALE_MULTIPLIER,
            })
            .to(TILE_DESTROY_FADE_DURATION, {
                opacity: TILE_DESTROY_OPACITY,
                scale: TILE_DESTROY_SCALE,
            })
            .call(onComplete)
            .start();
    }

    public playMove(targetPosition: cc.Vec2, duration: number, onComplete: () => void): void {
        this.stopHighlight();
        this._node.stopAllActions();

        cc.tween(this._node)
            .to(duration, {
                x: targetPosition.x,
                y: targetPosition.y,
            })
            .call(onComplete)
            .start();
    }

    public playSpawn(targetPosition: cc.Vec2, delay: number, onComplete: () => void): void {
        this.stopHighlight();
        this._node.stopAllActions();

        this._node.opacity = TILE_DESTROY_OPACITY;
        this._node.scale = this._baseScale * TILE_SPAWN_START_SCALE_MULTIPLIER;

        cc.tween(this._node)
            .delay(delay)
            .to(TILE_SPAWN_MOVE_DURATION, {
                x: targetPosition.x,
                y: targetPosition.y,
                opacity: TILE_FULL_OPACITY,
                scale: this._baseScale * TILE_SPAWN_BOUNCE_SCALE_MULTIPLIER,
            })
            .to(TILE_SPAWN_BOUNCE_DURATION, {
                scale: this._baseScale,
            })
            .call(onComplete)
            .start();
    }
}