import { GameConfig } from "../config/GameConfig";
import { GameSession } from "../game/session/GameSession";
import { GridModel } from "../grid/model/GridModel";
import { GridService } from "../grid/services/GridService";
import { BoosterMode } from "./BoosterMode";

export class BoosterService {
    private _config: GameConfig;
    private _gridService: GridService;
    private _session: GameSession;

    public constructor(config: GameConfig, gridService: GridService, session: GameSession) {
        this._config = config;
        this._gridService = gridService;
        this._session = session;
    }

    public activateBombBooster(): boolean {
        if (this._session.bombBoostersLeft <= 0)
            return false;

        this._session.setBoosterMode(BoosterMode.Bomb);
        return true;
    }

    public activateTeleportBooster(): boolean {
        if (this._session.teleportBoostersLeft <= 0)
            return false;

        this._session.setBoosterMode(BoosterMode.Teleport);
        return true;
    }

    public cancelBoosterMode(): void {
        this._session.clearBoosterMode();
    }

    public spendBombBooster(): boolean {
        var isSpent = this._session.spendBombBooster();

        if (isSpent)
            this._session.clearBoosterMode();

        return isSpent;
    }

    public spendTeleportBooster(): boolean {
        var isSpent = this._session.spendTeleportBooster();

        if (isSpent)
            this._session.clearBoosterMode();

        return isSpent;
    }

    public resolveAvailableGroupsAfterTurn(grid: GridModel): boolean {
        if (this._gridService.hasAvailableGroup(grid))
            return false;

        while (this._session.useShuffleAttempt()) {
            this._gridService.shuffleTiles(grid);

            if (this._gridService.hasAvailableGroup(grid))
                return false;
        }

        return true;
    }
}