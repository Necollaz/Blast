import { BoosterMode } from "../../boosters/BoosterMode";
import { GameConfig } from "../../config/GameConfig";
import { MOVES_PER_SUCCESSFUL_TURN } from "../../core/constants/GameControllerConstants";

export class GameSession {
    private _config: GameConfig;
    private _score: number = 0;
    private _movesLeft: number = 0;
    private _shuffleAttemptsUsed: number = 0;
    private _teleportBoostersLeft: number = 0;
    private _bombBoostersLeft: number = 0;
    private _boosterMode: BoosterMode = BoosterMode.None;

    public constructor(config: GameConfig) {
        this._config = config;
    }

    public reset(): void {
        this._score = 0;
        this._movesLeft = this._config.movesLimit;
        this._shuffleAttemptsUsed = 0;
        this._teleportBoostersLeft = this._config.teleportBoostersCount;
        this._bombBoostersLeft = this._config.bombBoostersCount;
        this._boosterMode = BoosterMode.None;
    }

    public addScore(score: number): void {
        this._score += score;
    }

    public spendMove(): void {
        this._movesLeft -= MOVES_PER_SUCCESSFUL_TURN;
    }

    public useShuffleAttempt(): boolean {
        if (this._shuffleAttemptsUsed >= this._config.shuffleAttemptsLimit)
            return false;

        this._shuffleAttemptsUsed++;
        return true;
    }

    public spendTeleportBooster(): boolean {
        if (this._teleportBoostersLeft <= 0)
            return false;

        this._teleportBoostersLeft--;
        return true;
    }

    public spendBombBooster(): boolean {
        if (this._bombBoostersLeft <= 0)
            return false;

        this._bombBoostersLeft--;
        return true;
    }

    public setBoosterMode(boosterMode: BoosterMode): void {
        this._boosterMode = boosterMode;
    }

    public clearBoosterMode(): void {
        this._boosterMode = BoosterMode.None;
    }

    public get score(): number {
        return this._score;
    }

    public get movesLeft(): number {
        return this._movesLeft;
    }

    public get shuffleAttemptsUsed(): number {
        return this._shuffleAttemptsUsed;
    }

    public get teleportBoostersLeft(): number {
        return this._teleportBoostersLeft;
    }

    public get bombBoostersLeft(): number {
        return this._bombBoostersLeft;
    }

    public get boosterMode(): BoosterMode {
        return this._boosterMode;
    }
}