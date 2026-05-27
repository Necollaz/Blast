export interface GameConfig {
    rows: number;
    columns: number;
    colorsCount: number;
    targetScore: number;
    movesLimit: number;
    minGroupSize: number;
    shuffleAttemptsLimit: number;
    teleportBoostersCount: number;
    bombBoostersCount: number;
    bombRadius: number;
    superTileLineMinGroupSize: number;
    superTileRadiusMinGroupSize: number;
    superTileClearBoardMinGroupSize: number;
    superTileRadius: number;
}