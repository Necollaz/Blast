import { GameConfig } from "../../config/GameConfig";
import { GridModel } from "../../grid/model/GridModel";
import { GridService } from "../../grid/services/GridService";

export class GameRulesService {
    private _config: GameConfig;
    private _gridService: GridService;

    public constructor(config: GameConfig, gridService: GridService) {
        this._config = config;
        this._gridService = gridService;
    }

    public isWin(score: number): boolean {
        return score >= this._config.targetScore;
    }

    public isLoseByMoves(score: number, movesLeft: number): boolean {
        return !this.isWin(score) && movesLeft <= 0;
    }

    public hasAvailableGroups(grid: GridModel): boolean {
        return this._gridService.hasAvailableGroup(grid);
    }
}