import {
    TILE_CLICK_COLUMN_LOG_PART,
    TILE_CLICK_LOG_MESSAGE,
    TILE_GROUP_IS_TOO_SMALL_LOG_MESSAGE,
    TILE_GROUP_SIZE_LOG_MESSAGE
} from "../../../core/constants/GameControllerConstants";
import { GridModel } from "../../../grid/model/GridModel";
import { GridService } from "../../../grid/services/GridService";
import { TilePosition } from "../../../tiles/TilePosition";
import { TurnResolver } from "../TurnResolver";
import { PlayerTurnResult } from "./PlayerTurnResult";

export class PlayerTurnService {
    private _gridService: GridService;
    private _turnResolver: TurnResolver;

    public constructor(gridService: GridService, turnResolver: TurnResolver) {
        this._gridService = gridService;
        this._turnResolver = turnResolver;
    }

    public createTurn(grid: GridModel, position: TilePosition): PlayerTurnResult {
        cc.log(TILE_CLICK_LOG_MESSAGE + position.row + TILE_CLICK_COLUMN_LOG_PART + position.column);

        var selectedGroup = this._gridService.findGroup(grid, position);

        cc.log(TILE_GROUP_SIZE_LOG_MESSAGE + selectedGroup.length);

        if (selectedGroup.length === 0) {
            cc.log(TILE_GROUP_IS_TOO_SMALL_LOG_MESSAGE);

            return {
                turnResult: this._turnResolver.createInvalidTurnResult(),
                selectedGroup: [],
            };
        }

        return {
            turnResult: this._turnResolver.createPendingGroupTurn(selectedGroup),
            selectedGroup: selectedGroup,
        };
    }
}