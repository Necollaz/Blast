import { BoosterService } from "../../boosters/BoosterService";
import { GameConfig } from "../../config/GameConfig";
import { GridService } from "../../grid/services/GridService";
import { GridViewDataFactory } from "../../grid/view/GridViewDataFactory";
import { GameSession } from "../session/GameSession";
import { GameStateController } from "../state/GameStateController";
import { BombTurnService } from "../turns/bomb/BombTurnService";
import { PlayerTurnService } from "../turns/player/PlayerTurnService";
import { TeleportTurnService } from "../turns/teleport/TeleportTurnService";
import { TurnResolver } from "../turns/TurnResolver";

export interface GameControllerDependencies {
    config: GameConfig;
    gridService: GridService;
    gridViewDataFactory: GridViewDataFactory;
    stateController: GameStateController;
    session: GameSession;
    turnResolver: TurnResolver;
    boosterService: BoosterService;
    playerTurnService: PlayerTurnService;
    bombTurnService: BombTurnService;
    teleportTurnService: TeleportTurnService;
}