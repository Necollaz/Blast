import { BoosterMode } from "../../boosters/BoosterMode";
import { BoosterService } from "../../boosters/BoosterService";
import { GameConfig } from "../../config/GameConfig";
import { ScoreService } from "../../core/services/ScoreService";
import { StateMachine } from "../../core/StateMachine";
import { GridModel } from "../../grid/model/GridModel";
import { GridService } from "../../grid/services/GridService";
import { BoardViewData } from "../../grid/view/BoardViewData";
import { GridViewDataFactory } from "../../grid/view/GridViewDataFactory";
import { SuperTileCreationService } from "../superTiles/SuperTileCreationService";
import { SuperTileEffectService } from "../superTiles/SuperTileEffectService";
import { TileModel } from "../../tiles/TileModel";
import { TilePosition } from "../../tiles/TilePosition";
import { TileType } from "../../tiles/TileType";
import { GameRulesService } from "../rules/GameRulesService";
import { GameSession } from "../session/GameSession";
import { GameStateController } from "../state/GameStateController";
import { GameStateId } from "../state/GameStateId";
import { BombTurnService } from "../turns/bomb/BombTurnService";
import { PlayerTurnService } from "../turns/player/PlayerTurnService";
import { TurnResolver } from "../turns/TurnResolver";
import { TurnResult } from "../turns/TurnResult";

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
    private _grid: GridModel = null;
    private _lastSelectedGroup: TileModel[] = [];
    private _lastSuperTilePosition: TilePosition = null;
    private _lastSuperTileType: TileType = null;
    private _firstTeleportPosition: TilePosition = null;

    public constructor(
        config: GameConfig,
        gridService: GridService = null,
        scoreService: ScoreService = null,
        gridViewDataFactory: GridViewDataFactory = null
    ) {
        this._config = config;
        this._gridService = gridService || new GridService(config);
        this._gridViewDataFactory = gridViewDataFactory || new GridViewDataFactory();
        this._stateController = new GameStateController();
        this._session = new GameSession(config);

        var rulesService = new GameRulesService(config, this._gridService);

        this._turnResolver = new TurnResolver(
            this._gridService,
            scoreService || new ScoreService(),
            rulesService,
            this._session
        );

        var superTileCreationService = new SuperTileCreationService(config);
        var superTileEffectService = new SuperTileEffectService(config, this._gridService);

        this._boosterService = new BoosterService(config, this._gridService, this._session);
        this._playerTurnService = new PlayerTurnService(
            this._gridService,
            this._turnResolver,
            superTileCreationService,
            superTileEffectService
        );
        this._bombTurnService = new BombTurnService(config, this._gridService, this._boosterService, this._turnResolver);
    }

    public startNewGame(): void {
        this._session.reset();
        this.resetTeleportSelection();
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

        this.resetTeleportSelection();
        this._stateController.enterTeleportSelection();
        return true;
    }

    public cancelBoosterMode(): void {
        if (this._stateController.isBombSelection() || this._stateController.isTeleportSelection())
            this._stateController.enterPlayerInput();

        this.resetTeleportSelection();
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
        if (!this._stateController.isResolvingTurn())
            return;

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
        var tile = this._grid.getTile(position.row, position.column);

        if (!tile)
            return this._turnResolver.createInvalidTurnResult();

        if (!this._firstTeleportPosition) {
            this._firstTeleportPosition = { row: position.row, column: position.column };
            return this.createPendingTeleportSelectionResult(this._firstTeleportPosition);
        }

        if (this._firstTeleportPosition.row === position.row && this._firstTeleportPosition.column === position.column)
            return this.createPendingTeleportSelectionResult(this._firstTeleportPosition);

        var tileMoves = this._gridService.swapTiles(this._grid, this._firstTeleportPosition, position);

        if (tileMoves.length === 0)
            return this._turnResolver.createInvalidTurnResult();

        if (!this._boosterService.spendTeleportBooster())
            return this._turnResolver.createInvalidTurnResult();

        this.resetTeleportSelection();
        this._stateController.enterResolvingTurn();

        return {
            isValid: true,
            isModelResolved: true,
            isPendingSelection: false,
            isSwap: true,
            selectedPosition: null,
            isWin: false,
            isLose: false,
            destroyedPositions: [],
            tileMoves: tileMoves,
            tileSpawns: [],
            tileUpdates: [],
            scoreAdded: 0,
            totalScore: this._session.score,
            movesLeft: this._session.movesLeft,
        };
    }

    private createPendingTeleportSelectionResult(position: TilePosition): TurnResult {
        return {
            isValid: true,
            isModelResolved: false,
            isPendingSelection: true,
            isSwap: false,
            selectedPosition: position,
            isWin: false,
            isLose: false,
            destroyedPositions: [],
            tileMoves: [],
            tileSpawns: [],
            tileUpdates: [],
            scoreAdded: 0,
            totalScore: this._session.score,
            movesLeft: this._session.movesLeft,
        };
    }

    private resetTeleportSelection(): void {
        this._firstTeleportPosition = null;
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