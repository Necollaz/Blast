import { IState } from "../../core/IState";
import { StateMachine } from "../../core/StateMachine";
import { GameStateId } from "./GameStateId";

export class GameStateController {
    private _stateMachine: StateMachine<GameStateId>;

    public constructor() {
        this._stateMachine = new StateMachine<GameStateId>();
        this.registerStates();
    }

    public update(dt: number): void {
        this._stateMachine.update(dt);
    }

    public enterBoot(): void {
        this._stateMachine.changeState(GameStateId.Boot);
    }

    public enterPlayerInput(): void {
        this._stateMachine.changeState(GameStateId.PlayerInput);
    }

    public enterBombSelection(): void {
        this._stateMachine.changeState(GameStateId.BombSelection);
    }

    public enterTeleportSelection(): void {
        this._stateMachine.changeState(GameStateId.TeleportSelection);
    }

    public enterResolvingTurn(): void {
        this._stateMachine.changeState(GameStateId.ResolvingTurn);
    }

    public enterWin(): void {
        this._stateMachine.changeState(GameStateId.Win);
    }

    public enterLose(): void {
        this._stateMachine.changeState(GameStateId.Lose);
    }

    public isPlayerInput(): boolean {
        return this._stateMachine.currentStateId === GameStateId.PlayerInput;
    }

    public isBombSelection(): boolean {
        return this._stateMachine.currentStateId === GameStateId.BombSelection;
    }

    public isTeleportSelection(): boolean {
        return this._stateMachine.currentStateId === GameStateId.TeleportSelection;
    }

    public isResolvingTurn(): boolean {
        return this._stateMachine.currentStateId === GameStateId.ResolvingTurn;
    }

    public get stateMachine(): StateMachine<GameStateId> {
        return this._stateMachine;
    }

    private registerStates(): void {
        this._stateMachine
            .addState(GameStateId.Boot, this.createEmptyState())
            .addState(GameStateId.PlayerInput, this.createEmptyState())
            .addState(GameStateId.BombSelection, this.createEmptyState())
            .addState(GameStateId.TeleportSelection, this.createEmptyState())
            .addState(GameStateId.ResolvingTurn, this.createEmptyState())
            .addState(GameStateId.Win, this.createEmptyState())
            .addState(GameStateId.Lose, this.createEmptyState());
    }

    private createEmptyState(): IState {
        return {};
    }
}