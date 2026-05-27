import {
    TILE_CLICK_COLUMN_LOG_PART,
    TILE_CLICK_LOG_MESSAGE,
    TILE_GROUP_IS_TOO_SMALL_LOG_MESSAGE,
    TILE_GROUP_SIZE_LOG_MESSAGE
} from "../../../core/constants/GameControllerConstants";
import { GridModel } from "../../../grid/model/GridModel";
import { GridService } from "../../../grid/services/GridService";
import { SuperTileCreationService } from "../../superTiles/SuperTileCreationService";
import { SuperTileEffectService } from "../../superTiles/SuperTileEffectService";
import { TilePosition } from "../../../tiles/TilePosition";
import { TileType } from "../../../tiles/TileType";
import { TurnResolver } from "../TurnResolver";
import { PlayerTurnResult } from "./PlayerTurnResult";

export class PlayerTurnService {
    private _gridService: GridService;
    private _turnResolver: TurnResolver;
    private _superTileCreationService: SuperTileCreationService;
    private _superTileEffectService: SuperTileEffectService;

    public constructor(
        gridService: GridService,
        turnResolver: TurnResolver,
        superTileCreationService: SuperTileCreationService,
        superTileEffectService: SuperTileEffectService
    ) {
        this._gridService = gridService;
        this._turnResolver = turnResolver;
        this._superTileCreationService = superTileCreationService;
        this._superTileEffectService = superTileEffectService;
    }

    public createTurn(grid: GridModel, position: TilePosition): PlayerTurnResult {
        cc.log(TILE_CLICK_LOG_MESSAGE + position.row + TILE_CLICK_COLUMN_LOG_PART + position.column);

        var clickedTile = grid.getTile(position.row, position.column);

        if (!clickedTile) {
            return {
                turnResult: this._turnResolver.createInvalidTurnResult(),
                selectedGroup: [],
                superTilePosition: null,
                superTileType: null,
            };
        }
        
        if (clickedTile.type !== TileType.Default) {
            var affectedTiles = this._superTileEffectService.getAffectedTiles(grid, position);

            if (affectedTiles.length === 0) {
                return {
                    turnResult: this._turnResolver.createInvalidTurnResult(),
                    selectedGroup: [],
                    superTilePosition: null,
                    superTileType: null,
                };
            }

            return {
                turnResult: this._turnResolver.createPendingGroupTurn(affectedTiles, null),
                selectedGroup: affectedTiles,
                superTilePosition: null,
                superTileType: null,
            };
        }

        var selectedGroup = this._gridService.findGroup(grid, position);

        cc.log(TILE_GROUP_SIZE_LOG_MESSAGE + selectedGroup.length);

        if (selectedGroup.length === 0) {
            cc.log(TILE_GROUP_IS_TOO_SMALL_LOG_MESSAGE);

            return {
                turnResult: this._turnResolver.createInvalidTurnResult(),
                selectedGroup: [],
                superTilePosition: null,
                superTileType: null,
            };
        }
        
        var superTileType = this._superTileCreationService.getSuperTileType(selectedGroup, position);
        var superTilePosition = superTileType ? position : null;

        return {
            turnResult: this._turnResolver.createPendingGroupTurn(selectedGroup, superTilePosition),
            selectedGroup: selectedGroup,
            superTilePosition: superTilePosition,
            superTileType: superTileType,
        };
    }
}