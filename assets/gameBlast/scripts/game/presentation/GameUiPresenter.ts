import { BoosterMode } from "../../boosters/BoosterMode";
import BoardView from "../../grid/view/BoardView";
import { TilePosition } from "../../tiles/TilePosition";
import BoostersPanelView from "../../ui/BoostersPanelView";
import GameResultPopupView from "../../ui/GameResultPopupView";
import MovesView from "../../ui/MovesView";
import ScoreView from "../../ui/ScoreView";
import { GameController } from "../controllers/GameController";

export class GameUiPresenter {
    private _gameController: GameController;
    private _boardView: BoardView;
    private _movesView: MovesView;
    private _scoreView: ScoreView;
    private _boostersPanelView: BoostersPanelView;
    private _gameResultPopupView: GameResultPopupView;

    public constructor(
        gameController: GameController,
        boardView: BoardView,
        movesView: MovesView,
        scoreView: ScoreView,
        boostersPanelView: BoostersPanelView,
        gameResultPopupView: GameResultPopupView
    ) {
        this._gameController = gameController;
        this._boardView = boardView;
        this._movesView = movesView;
        this._scoreView = scoreView;
        this._boostersPanelView = boostersPanelView;
        this._gameResultPopupView = gameResultPopupView;
    }

    public renderBoard(clickHandler: (position: TilePosition) => void): void {
        if (!this._boardView)
            return;

        this._boardView.render(this._gameController.getBoardViewData(), clickHandler);
        this._boardView.setBombSelectionEnabled(this._gameController.boosterMode === BoosterMode.Bomb);
    }

    public renderMoves(): void {
        if (this._movesView)
            this._movesView.render(this._gameController.movesLeft);
    }

    public renderScore(): void {
        if (this._scoreView)
            this._scoreView.render(this._gameController.score, this._gameController.config.targetScore);
    }

    public renderBoosters(): void {
        if (!this._boostersPanelView)
            return;

        this._boostersPanelView.render(
            this._gameController.teleportBoostersLeft,
            this._gameController.bombBoostersLeft,
            this._gameController.boosterMode === BoosterMode.Teleport,
            this._gameController.boosterMode === BoosterMode.Bomb
        );
    }

    public renderHud(): void {
        this.renderMoves();
        this.renderScore();
        this.renderBoosters();
    }

    public hidePopups(): void {
        if (this._gameResultPopupView)
            this._gameResultPopupView.hide();
    }

    public showWin(): void {
        if (this._gameResultPopupView)
            this._gameResultPopupView.showWin(this._gameController.score, this._gameController.config.targetScore);
    }

    public showLose(): void {
        if (this._gameResultPopupView)
            this._gameResultPopupView.showLose(this._gameController.score, this._gameController.config.targetScore);
    }
}