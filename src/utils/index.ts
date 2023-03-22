import { CellValue, CellState, Cell, Settings } from '../types';

const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number,
  numberOfColumns: number,
  numberOfRows: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
} => {
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < numberOfColumns - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
  const rightCell =
    colParam < numberOfColumns - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftCell =
    rowParam < numberOfRows - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomCell =
    rowParam < numberOfRows - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomRightCell =
    rowParam < numberOfRows - 1 && colParam < numberOfColumns - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  };
};

export const generateCells = ({
  numberOfRows,
  numberOfColumns,
  numberOfMines,
}: Settings): Cell[][] => {
  let cells: Cell[][] = [];

  for (let row = 0; row < numberOfRows; row++) {
    cells.push([]);
    for (let col = 0; col < numberOfColumns; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.hidden,
      });
    }
  }

  //randomly put mines
  let minesPlaced = 0;
  while (minesPlaced < numberOfMines) {
    const randomRow = Math.floor(Math.random() * numberOfRows);
    const randomCol = Math.floor(Math.random() * numberOfColumns);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.mine) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return {
              ...cell,
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
  for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numberOfColumns; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.mine) {
        continue;
      }

      let numberOfMines = 0;
      const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
      } = grabAllAdjacentCells(
        cells,
        rowIndex,
        colIndex,
        numberOfColumns,
        numberOfRows
      );

      if (topLeftCell?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (topCell?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (topRightCell?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (leftCell?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (rightCell?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (bottomLeftCell?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (bottomCell?.value === CellValue.mine) {
        numberOfMines++;
      }
      if (bottomRightCell?.value === CellValue.mine) {
        numberOfMines++;
      }

      if (numberOfMines > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfMines,
        };
      }
    }
  }

  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number,
  numberOfColumns: number,
  numberOfRows: number
): Cell[][] => {
  const currentCell = cells[rowParam][colParam];

  if (
    currentCell.state === CellState.visible ||
    currentCell.state === CellState.flagged
  ) {
    return cells;
  }

  let newCells = cells.slice();
  newCells[rowParam][colParam].state = CellState.visible;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  } = grabAllAdjacentCells(
    cells,
    rowParam,
    colParam,
    numberOfColumns,
    numberOfRows
  );

  if (
    topLeftCell?.state === CellState.hidden &&
    topLeftCell.value !== CellValue.mine
  ) {
    if (topLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam - 1,
        colParam - 1,
        numberOfColumns,
        numberOfRows
      );
    } else {
      newCells[rowParam - 1][colParam - 1].state = CellState.visible;
    }
  }

  if (topCell?.state === CellState.hidden && topCell.value !== CellValue.mine) {
    if (topCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam - 1,
        colParam,
        numberOfColumns,
        numberOfRows
      );
    } else {
      newCells[rowParam - 1][colParam].state = CellState.visible;
    }
  }

  if (
    topRightCell?.state === CellState.hidden &&
    topRightCell.value !== CellValue.mine
  ) {
    if (topRightCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam - 1,
        colParam + 1,
        numberOfColumns,
        numberOfRows
      );
    } else {
      newCells[rowParam - 1][colParam + 1].state = CellState.visible;
    }
  }

  if (leftCell?.state === CellState.hidden && leftCell.value !== CellValue.mine) {
    if (leftCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam,
        colParam - 1,
        numberOfColumns,
        numberOfRows
      );
    } else {
      newCells[rowParam][colParam - 1].state = CellState.visible;
    }
  }

  if (
    rightCell?.state === CellState.hidden &&
    rightCell.value !== CellValue.mine
  ) {
    if (rightCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam,
        colParam + 1,
        numberOfColumns,
        numberOfRows
      );
    } else {
      newCells[rowParam][colParam + 1].state = CellState.visible;
    }
  }

  if (
    bottomLeftCell?.state === CellState.hidden &&
    bottomLeftCell.value !== CellValue.mine
  ) {
    if (bottomLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam + 1,
        colParam - 1,
        numberOfColumns,
        numberOfRows
      );
    } else {
      newCells[rowParam + 1][colParam - 1].state = CellState.visible;
    }
  }

  if (
    bottomCell?.state === CellState.hidden &&
    bottomCell.value !== CellValue.mine
  ) {
    if (bottomCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam + 1,
        colParam,
        numberOfColumns,
        numberOfRows
      );
    } else {
      newCells[rowParam + 1][colParam].state = CellState.visible;
    }
  }

  if (
    bottomRightCell?.state === CellState.hidden &&
    bottomRightCell.value !== CellValue.mine
  ) {
    if (bottomRightCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam + 1,
        colParam + 1,
        numberOfColumns,
        numberOfRows
      );
    } else {
      newCells[rowParam + 1][colParam + 1].state = CellState.visible;
    }
  }

  return newCells;
};
