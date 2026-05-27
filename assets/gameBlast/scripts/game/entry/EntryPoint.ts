import { DEFAULT_GAME_CONFIG } from "../../config/GameConfigDefaults";
import BoardView from "../../grid/view/BoardView";
import BoostersPanelView from "../../ui/BoostersPanelView";
import GameResultPopupView from "../../ui/GameResultPopupView";
import MovesView from "../../ui/MovesView";
import ScoreView from "../../ui/ScoreView";
import { GameController } from "../controllers/GameController";
import { GameControllerFactory } from "../controllers/GameControllerFactory";
import { TurnPipeline } from "../flow/TurnPipeline";
import { GameUiPresenter } from "../presentation/GameUiPresenter";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EntryPoint extends cc.Component {
    @property(BoardView) private boardView: BoardView = null;
    @property(MovesView) private movesView: MovesView = null;
    @property(ScoreView) private scoreView: ScoreView = null;
    @property(BoostersPanelView) private boostersPanelView: BoostersPanelView = null;
    @property(GameResultPopupView) private gameResultPopupView: GameResultPopupView = null;

    private _gameController: GameController = null;
    private _uiPresenter: GameUiPresenter = null;
    private _turnPipeline: TurnPipeline = null;

    protected onLoad(): void {
        this.createGame();
        this.startGame();
    }

    protected update(dt: number): void {
        if (this._gameController)
            this._gameController.update(dt);
    }

    public restartGame(): void {
        this.startGame();
    }

    public onTeleportBoosterClicked(): void {
        this._turnPipeline.activateTeleportBooster();
    }

    public onBombBoosterClicked(): void {
        this._turnPipeline.activateBombBooster();
    }

    private createGame(): void {
        this._gameController = new GameControllerFactory().create(DEFAULT_GAME_CONFIG);
        this._uiPresenter = new GameUiPresenter(
            this._gameController,
            this.boardView,
            this.movesView,
            this.scoreView,
            this.boostersPanelView,
            this.gameResultPopupView
        );
        this._turnPipeline = new TurnPipeline(this._gameController, this.boardView, this._uiPresenter);
    }

    private startGame(): void {
        this._gameController.startNewGame();
        this._turnPipeline.renderInitialState();
    }
}