import {
    TILE_FALL_DURATION_PER_ROW,
    TILE_FALL_MIN_DURATION,
    TILE_SPAWN_DELAY_PER_TILE,
    TILE_SPAWN_MAX_DELAY
} from "../../core/constants/TileAnimationConstants";
import { TileMove } from "../../tiles/TileMove";
import { TilePosition } from "../../tiles/TilePosition";
import { TileSpawn } from "../../tiles/TileSpawn";
import { BoardTileFactory } from "../factory/BoardTileFactory";
import { BoardLayout } from "../layout/BoardLayout";
import { BoardTileRegistry } from "../registry/BoardTileRegistry";
import { DestroyEffectPlayer } from "./DestroyEffectPlayer";

export class BoardAnimationPlayer {
    private _layout: BoardLayout;
    private _registry: BoardTileRegistry;
    private _tileFactory: BoardTileFactory;
    private _destroyEffectPlayer: DestroyEffectPlayer;

    public constructor(
        layout: BoardLayout,
        registry: BoardTileRegistry,
        tileFactory: BoardTileFactory,
        destroyEffectPlayer: DestroyEffectPlayer
    ) {
        this._layout = layout;
        this._registry = registry;
        this._tileFactory = tileFactory;
        this._destroyEffectPlayer = destroyEffectPlayer;
    }

    public playMoveAnimation(tileMoves: TileMove[], onComplete: () => void): void {
        if (tileMoves.length === 0) {
            onComplete();
            
            return;
        }

        var completedCount = 0;

        for (var index = 0; index < tileMoves.length; index++) {
            var tileMove = tileMoves[index];
            var tileView = this._registry.get(tileMove.from);

            if (!tileView) {
                completedCount++;

                if (completedCount >= tileMoves.length)
                    onComplete();

                continue;
            }

            tileView.playMoveAnimation(
                this._layout.getTilePosition(tileMove.to.row, tileMove.to.column),
                this.getFallDuration(tileMove),
                () => {
                    completedCount++;

                    if (completedCount >= tileMoves.length)
                        onComplete();
                }
            );
        }
    }

    public playDestroyAnimation(positions: TilePosition[], onComplete: () => void): void {
        if (positions.length === 0) {
            onComplete();
            
            return;
        }

        var completedCount = 0;

        for (var index = 0; index < positions.length; index++) {
            var tileView = this._registry.get(positions[index]);

            if (!tileView) {
                completedCount++;

                if (completedCount >= positions.length)
                    onComplete();

                continue;
            }

            this._destroyEffectPlayer.play(tileView.node.position);

            tileView.playDestroyAnimation(() => {
                completedCount++;

                if (completedCount >= positions.length)
                    onComplete();
            });
        }
    }

    public playFallAnimation(tileMoves: TileMove[], onComplete: () => void): void {
        this.playMoveAnimation(tileMoves, onComplete);
    }

    public playSpawnAnimation(
        tileSpawns: TileSpawn[],
        clickHandler: (position: TilePosition) => void,
        hoverHandler: (position: TilePosition) => void,
        onComplete: () => void
    ): void {
        if (tileSpawns.length === 0) {
            onComplete();
            
            return;
        }

        var completedCount = 0;

        for (var index = 0; index < tileSpawns.length; index++) {
            var tileSpawn = tileSpawns[index];
            var tileView = this._tileFactory.createSpawn(tileSpawn, clickHandler, hoverHandler);

            tileView.playSpawnAnimation(
                this._layout.getTilePosition(tileSpawn.to.row, tileSpawn.to.column),
                this.getSpawnDelay(index),
                () => {
                    completedCount++;

                    if (completedCount >= tileSpawns.length)
                        onComplete();
                }
            );
        }
    }

    private getFallDuration(tileMove: TileMove): number {
        var distance = Math.abs(tileMove.from.row - tileMove.to.row);
        var duration = distance * TILE_FALL_DURATION_PER_ROW;

        return Math.max(TILE_FALL_MIN_DURATION, duration);
    }

    private getSpawnDelay(index: number): number {
        return Math.min(index * TILE_SPAWN_DELAY_PER_TILE, TILE_SPAWN_MAX_DELAY);
    }
}