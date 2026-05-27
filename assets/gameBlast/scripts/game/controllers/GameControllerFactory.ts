import { BoosterService } from "../../boosters/BoosterService";
import { GameConfig } from "../../config/GameConfig";
import { ScoreService } from "../../core/services/ScoreService";
import { GridService } from "../../grid/services/GridService";
import { GridViewDataFactory } from "../../grid/view/GridViewDataFactory";
import { GameRulesService } from "../rules/GameRulesService";
import { GameSession } from "../session/GameSession";
import { GameStateController } from "../state/GameStateController";
import { SuperTileCreationService } from "../superTiles/SuperTileCreationService";
import { SuperTileEffectService } from "../superTiles/SuperTileEffectService";
import { BombTurnService } from "../turns/bomb/BombTurnService";
import { PlayerTurnService } from "../turns/player/PlayerTurnService";
import { TeleportTurnService } from "../turns/teleport/TeleportTurnService";
import { TurnResolver } from "../turns/TurnResolver";
import { GameController } from "./GameController";

export class GameControllerFactory {
    public create(config: GameConfig): GameController {
        var gridService = new GridService(config);
        var gridViewDataFactory = new GridViewDataFactory();
        var stateController = new GameStateController();
        var session = new GameSession(config);
        var rulesService = new GameRulesService(config, gridService);
        var turnResolver = new TurnResolver(gridService, new ScoreService(), rulesService, session);
        var boosterService = new BoosterService(config, gridService, session);
        var superTileCreationService = new SuperTileCreationService(config);
        var superTileEffectService = new SuperTileEffectService(config, gridService);

        return new GameController({
            config: config,
            gridService: gridService,
            gridViewDataFactory: gridViewDataFactory,
            stateController: stateController,
            session: session,
            turnResolver: turnResolver,
            boosterService: boosterService,
            playerTurnService: new PlayerTurnService(
                gridService,
                turnResolver,
                superTileCreationService,
                superTileEffectService
            ),
            bombTurnService: new BombTurnService(config, gridService, boosterService, turnResolver),
            teleportTurnService: new TeleportTurnService(gridService, boosterService, turnResolver, session),
        });
    }
}