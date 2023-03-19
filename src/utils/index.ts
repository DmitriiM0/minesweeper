import { MAX_COLS, MAX_ROWS, NO_OF_MINES } from '../constants';
import { CellValue, CellState, Cell } from '../types';

export const genereateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open
      });
    }
  }

  //randomly put mines
  let minesPlaced = 0;
  while (minesPlaced < NO_OF_MINES) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.mine) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return {
              ...cells,
              value: CellValue.mine,
            };
          }
          return cell;
        })
      );
      minesPlaced++;
    }
  }

  //calculate the numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.mine) {
        continue;
      }
      let numberOfMines = 0;
      const topLeftMine =
        rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
      const topMine = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
      const topRightMine =
        rowIndex > 0 && colIndex < MAX_COLS - 1
          ? cells[rowIndex - 1][colIndex + 1]
          : null;
      const leftMine = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
      const rightMine =
        colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
      const bottomLeftMine =
        rowIndex < MAX_ROWS - 1 && colIndex > 0
          ? cells[rowIndex + 1][colIndex - 1]
          : null;
      const bottomMine =
        rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
      const bottomRightMine =
        rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1
          ? cells[rowIndex + 1][colIndex + 1]
          : null;

      if (topLeftMine?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (topMine?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (topRightMine?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (leftMine?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (rightMine?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (bottomLeftMine?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (bottomMine?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (bottomRightMine?.value === CellValue.mine) {
        numberOfMines++;
      }

	  if(numberOfMines > 0) {
		cells[rowIndex][colIndex] = {
			...currentCell,
			value: numberOfMines
		}
	  }
    }
  }

  return cells;
};
