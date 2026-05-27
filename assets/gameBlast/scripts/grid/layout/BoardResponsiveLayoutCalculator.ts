import {
    LAST_INDEX_OFFSET,
    MIN_AVAILABLE_SIZE,
    MIN_CELL_SIZE,
    MIN_GAP_COUNT,
    PADDING_SIDES_COUNT
} from "../../core/constants/BoardViewConstants";

export class BoardResponsiveLayoutCalculator {
    public calculateCellSize(
        rows: number,
        columns: number,
        boundsWidth: number,
        boundsHeight: number,
        cellGap: number,
        maxCellSize: number,
        boardPadding: number
    ): number {
        var availableWidth = Math.max(MIN_AVAILABLE_SIZE, boundsWidth - boardPadding * PADDING_SIDES_COUNT);
        var availableHeight = Math.max(MIN_AVAILABLE_SIZE, boundsHeight - boardPadding * PADDING_SIDES_COUNT);

        var totalHorizontalGaps = Math.max(MIN_GAP_COUNT, columns - LAST_INDEX_OFFSET) * cellGap;
        var totalVerticalGaps = Math.max(MIN_GAP_COUNT, rows - LAST_INDEX_OFFSET) * cellGap;

        var cellWidth = (availableWidth - totalHorizontalGaps) / columns;
        var cellHeight = (availableHeight - totalVerticalGaps) / rows;

        var calculatedCellSize = Math.floor(Math.min(cellWidth, cellHeight));

        return Math.min(maxCellSize, Math.max(MIN_CELL_SIZE, calculatedCellSize));
    }

    public calculateTileScale(cellSize: number, tileSourceSize: number): number {
        return cellSize / tileSourceSize;
    }
}