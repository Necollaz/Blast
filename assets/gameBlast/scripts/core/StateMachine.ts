import { IState } from "./IState";
import { STATE_NOT_REGISTERED_ERROR_MESSAGE } from "./constants/StateMachineConstants";

export class StateMachine<TStateId extends string> {
    private _states: { [key: string]: IState } = {};
    private _currentStateId: TStateId = null;
    private _currentState: IState = null;

    public addState(stateId: TStateId, state: IState): StateMachine<TStateId> {
        this._states[stateId] = state;

        return this;
    }

    public changeState(stateId: TStateId): void {
        var nextState = this._states[stateId];

        if (!nextState)
            throw new Error(STATE_NOT_REGISTERED_ERROR_MESSAGE + stateId);

        if (this._currentState && this._currentState.exit)
            this._currentState.exit();

        this._currentStateId = stateId;
        this._currentState = nextState;

        if (this._currentState.enter)
            this._currentState.enter();
    }

    public update(dt: number): void {
        if (this._currentState && this._currentState.update)
            this._currentState.update(dt);
    }

    public hasState(stateId: TStateId): boolean {
        return !!this._states[stateId];
    }

    public get currentStateId(): TStateId {
        return this._currentStateId;
    }
}