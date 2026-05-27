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
        var availableWidth = Math.max(0, boundsWidth - boardPadding * 2);
        var availableHeight = Math.max(0, boundsHeight - boardPadding * 2);

        var totalHorizontalGaps = Math.max(0, columns - 1) * cellGap;
        var totalVerticalGaps = Math.max(0, rows - 1) * cellGap;

        var cellWidth = (availableWidth - totalHorizontalGaps) / columns;
        var cellHeight = (availableHeight - totalVerticalGaps) / rows;

        var calculatedCellSize = Math.floor(Math.min(cellWidth, cellHeight));

        return Math.min(maxCellSize, Math.max(1, calculatedCellSize));
    }

    public calculateTileScale(cellSize: number, tileSourceSize: number): number {
        return cellSize / tileSourceSize;
    }
}