import BoardView from "../../grid/view/BoardView";
import { TilePosition } from "../../tiles/TilePosition";
import { GameController } from "../controllers/GameController";
import { GameUiPresenter } from "../presentation/GameUiPresenter";
import { TurnResult } from "../turns/TurnResult";

export class TurnPipeline {
    private _gameController: GameController;
    private _boardView: BoardView;
    private _uiPresenter: GameUiPresenter;

    public constructor(gameController: GameController, boardView: BoardView, uiPresenter: GameUiPresenter) {
        this._gameController = gameController;
        this._boardView = boardView;
        this._uiPresenter = uiPresenter;
    }

    public renderInitialState(): void {
        this._uiPresenter.hidePopups();
        this._uiPresenter.renderBoard((position: TilePosition) => this.handleTileClick(position));
        this._uiPresenter.renderHud();
    }

    public activateTeleportBooster(): void {
        if (!this._gameController.activateTeleportBooster())
            return;

        if (this._boardView)
            this._boardView.clearSelectionHighlight();

        this._uiPresenter.renderBoosters();
    }

    public activateBombBooster(): void {
        if (!this._gameController.activateBombBooster())
            return;

        if (this._boardView)
            this._boardView.setBombSelectionEnabled(true);

        this._uiPresenter.renderBoosters();
    }

    public handleTileClick(position: TilePosition): void {
        var turnResult = this._gameController.handleTileClick(position);

        if (!turnResult.isValid)
            return;

        if (turnResult.isPendingSelection) {
            this._boardView.highlightTile(turnResult.selectedPosition);
            this._uiPresenter.renderBoosters();
            return;
        }

        if (this._boardView) {
            this._boardView.clearSelectionHighlight();
            this._boardView.setBombSelectionEnabled(false);
        }

        this._uiPresenter.renderBoosters();

        if (turnResult.isSwap) {
            this._boardView.playMoveAnimation(
                turnResult.tileMoves,
                () => this.completeMoveAnimation(turnResult)
            );
            return;
        }

        this._boardView.playDestroyAnimation(
            turnResult.destroyedPositions,
            () => this.completeDestroyAnimation(turnResult)
        );
    }

    private completeMoveAnimation(turnResult: TurnResult): void {
        this._uiPresenter.renderBoard((position: TilePosition) => this.handleTileClick(position));

        var isLoseAfterShuffle = this._gameController.resolveAvailableGroupsAfterTurn();

        this._uiPresenter.renderBoard((position: TilePosition) => this.handleTileClick(position));

        if (isLoseAfterShuffle) {
            this._uiPresenter.showLose();
            return;
        }

        this._gameController.completeTurn();
        this._uiPresenter.renderBoosters();
    }

    private completeDestroyAnimation(turnResult: TurnResult): void {
        var resolvedTurnResult = turnResult.isModelResolved
            ? turnResult
            : this._gameController.completeSelectedGroupDestroy();

        if (!resolvedTurnResult.isValid)
            return;

        this._uiPresenter.renderHud();
        this._boardView.applyTileUpdates(resolvedTurnResult.tileUpdates);
        this._boardView.playFallAnimation(
            resolvedTurnResult.tileMoves,
            () => this.playSpawnAnimation(resolvedTurnResult)
        );
    }

    private playSpawnAnimation(turnResult: TurnResult): void {
        this._boardView.playSpawnAnimation(
            turnResult.tileSpawns,
            () => this.completeTurnAnimations(turnResult)
        );
    }

    private completeTurnAnimations(turnResult: TurnResult): void {
        this._uiPresenter.renderBoard((position: TilePosition) => this.handleTileClick(position));

        if (turnResult.isWin) {
            this._uiPresenter.showWin();
            return;
        }

        if (turnResult.isLose) {
            this._uiPresenter.showLose();
            return;
        }

        var isLoseAfterShuffle = this._gameController.resolveAvailableGroupsAfterTurn();

        this._uiPresenter.renderBoard((position: TilePosition) => this.handleTileClick(position));

        if (isLoseAfterShuffle) {
            this._uiPresenter.showLose();
            return;
        }

        this._gameController.completeTurn();
        this._uiPresenter.renderBoosters();
    }
}