import { TilePosition } from "../../tiles/TilePosition";

export const FIRST_TILE_ID: number = 1;
export const POSITION_KEY_SEPARATOR: string = ":";
export const RANDOM_INDEX_OFFSET: number = 1;

export const ORTHOGONAL_DIRECTIONS: TilePosition[] = [
    { row: 1, column: 0 },
    { row: -1, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: -1 },
];