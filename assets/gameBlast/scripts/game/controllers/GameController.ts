import { BoosterMode } from "../../boosters/BoosterMode";
import { BoosterService } from "../../boosters/BoosterService";
import { GameConfig } from "../../config/GameConfig";
import { StateMachine } from "../../core/StateMachine";
import { GridModel } from "../../grid/model/GridModel";
import { GridService } from "../../grid/services/GridService";
import { BoardViewData } from "../../grid/view/BoardViewData";
import { GridViewDataFactory } from "../../grid/view/GridViewDataFactory";
import { TileModel } from "../../tiles/TileModel";
import { TilePosition } from "../../tiles/TilePosition";
import { TileType } from "../../tiles/TileType";
import { GameSession } from "../session/GameSession";
import { GameStateController } from "../state/GameStateController";
import { GameStateId } from "../state/GameStateId";
import { BombTurnService } from "../turns/bomb/BombTurnService";
import { PlayerTurnService } from "../turns/player/PlayerTurnService";
import { TeleportTurnService } from "../turns/teleport/TeleportTurnService";
import { TurnResolver } from "../turns/TurnResolver";
import { TurnResult } from "../turns/TurnResult";
import { GameControllerDependencies } from "./GameControllerDependencies";

export class GameController {
    private _config: GameConfig;
    private _gridService: GridService;
    private _gridViewDataFactory: GridViewDataFactory;
    private _stateController: GameStateController;
    private _session: GameSession;
    private _turnResolver: TurnResolver;
    private _boosterService: BoosterService;
    private _playerTurnService: PlayerTurnService;
    private _bombTurnService: BombTurnService;
    private _teleportTurnService: TeleportTurnService;
    private _grid: GridModel = null;
    private _lastSelectedGroup: TileModel[] = [];
    private _lastSuperTilePosition: TilePosition = null;
    private _lastSuperTileType: TileType = null;

    public constructor(dependencies: GameControllerDependencies) {
        this._config = dependencies.config;
        this._gridService = dependencies.gridService;
        this._gridViewDataFactory = dependencies.gridViewDataFactory;
        this._stateController = dependencies.stateController;
        this._session = dependencies.session;
        this._turnResolver = dependencies.turnResolver;
        this._boosterService = dependencies.boosterService;
        this._playerTurnService = dependencies.playerTurnService;
        this._bombTurnService = dependencies.bombTurnService;
        this._teleportTurnService = dependencies.teleportTurnService;
    }

    public startNewGame(): void {
        this._session.reset();
        this._teleportTurnService.reset();
        this.resetLastTurnData();
        this._stateController.enterBoot();
        this._grid = this._gridService.createInitialGrid();
        this._stateController.enterPlayerInput();
    }

    public update(dt: number): void {
        this._stateController.update(dt);
    }

    public activateBombBooster(): boolean {
        if (!this._stateController.isPlayerInput())
            return false;

        if (!this._boosterService.activateBombBooster())
            return false;

        this._stateController.enterBombSelection();
        return true;
    }

    public activateTeleportBooster(): boolean {
        if (!this._stateController.isPlayerInput())
            return false;

        if (!this._boosterService.activateTeleportBooster())
            return false;

        this._teleportTurnService.reset();
        this._stateController.enterTeleportSelection();
        return true;
    }

    public cancelBoosterMode(): void {
        if (this._stateController.isBombSelection() || this._stateController.isTeleportSelection())
            this._stateController.enterPlayerInput();

        this._teleportTurnService.reset();
        this._boosterService.cancelBoosterMode();
    }

    public handleTileClick(position: TilePosition): TurnResult {
        if (this._stateController.isBombSelection())
            return this.handleBombClick(position);

        if (this._stateController.isTeleportSelection())
            return this.handleTeleportClick(position);

        if (!this._stateController.isPlayerInput())
            return this._turnResolver.createInvalidTurnResult();

        this._stateController.enterResolvingTurn();

        var playerTurnResult = this._playerTurnService.createTurn(this._grid, position);

        if (!playerTurnResult.turnResult.isValid) {
            this._stateController.enterPlayerInput();
            
            return playerTurnResult.turnResult;
        }

        this._lastSelectedGroup = playerTurnResult.selectedGroup;
        this._lastSuperTilePosition = playerTurnResult.superTilePosition;
        this._lastSuperTileType = playerTurnResult.superTileType;

        return playerTurnResult.turnResult;
    }

    public completeSelectedGroupDestroy(): TurnResult {
        if (!this._stateController.isResolvingTurn())
            return this._turnResolver.createInvalidTurnResult();

        var result = this._turnResolver.completeTilesDestroy(
            this._grid,
            this._lastSelectedGroup,
            true,
            this._lastSuperTilePosition,
            this._lastSuperTileType
        );

        this.resetLastTurnData();
        this.changeTerminalStateIfNeeded(result);

        return result;
    }

    public resolveAvailableGroupsAfterTurn(): boolean {
        if (!this._stateController.isResolvingTurn())
            return false;

        var isLose = this._boosterService.resolveAvailableGroupsAfterTurn(this._grid);

        if (isLose)
            this._stateController.enterLose();

        return isLose;
    }

    public completeTurn(): void {
        if (this._stateController.isResolvingTurn())
            this._stateController.enterPlayerInput();
    }

    public getBoardViewData(): BoardViewData {
        return this._gridViewDataFactory.create(this._grid);
    }

    public get config(): GameConfig {
        return this._config;
    }

    public get score(): number {
        return this._session.score;
    }

    public get movesLeft(): number {
        return this._session.movesLeft;
    }

    public get teleportBoostersLeft(): number {
        return this._session.teleportBoostersLeft;
    }

    public get bombBoostersLeft(): number {
        return this._session.bombBoostersLeft;
    }

    public get boosterMode(): BoosterMode {
        return this._session.boosterMode;
    }

    public get stateMachine(): StateMachine<GameStateId> {
        return this._stateController.stateMachine;
    }

    private handleBombClick(position: TilePosition): TurnResult {
        this._stateController.enterResolvingTurn();

        var result = this._bombTurnService.createTurn(this._grid, position);

        if (!result.isValid) {
            this._stateController.enterPlayerInput();
            
            return result;
        }

        this.changeTerminalStateIfNeeded(result);

        return result;
    }

    private handleTeleportClick(position: TilePosition): TurnResult {
        var result = this._teleportTurnService.createTurn(this._grid, position);

        if (result.isValid && !result.isPendingSelection)
            this._stateController.enterResolvingTurn();

        return result;
    }

    private resetLastTurnData(): void {
        this._lastSelectedGroup = [];
        this._lastSuperTilePosition = null;
        this._lastSuperTileType = null;
    }

    private changeTerminalStateIfNeeded(result: TurnResult): void {
        if (result.isWin)
            this._stateController.enterWin();
        else if (result.isLose)
            this._stateController.enterLose();
    }
}