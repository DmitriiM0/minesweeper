import React, { useState, useEffect } from 'react';
import NumberDisplay from '../NumberDisplay';
import { generateCells, openMultipleCells } from '../../utils';
import Button from '../Button';
import { Face, Cell, CellState, CellValue } from '../../types';
import { MAX_ROWS, MAX_COLS } from '../../constants';

import './Minesweeper.scss';

const Minesweeper: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [mineCounter, setMineCounter] = useState<number>(10);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = (): void => {
      if (live) {
        setFace(Face.excited);
      }
    };

    const handleMouseUp = (): void => {
      if (live) {
        setFace(Face.smile);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live]);

  useEffect(() => {
    if (hasLost) {
      setLive(false);
      setFace(Face.lost);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      setLive(false);
      setFace(Face.won);
    }
  }, [hasWon]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let currentCell = cells[rowParam][colParam];
    //shallow copy of cells
    let newCells = cells.slice();

    if (hasLost) return;

    if (!live) {
      while (currentCell.value === CellValue.mine) {
        console.log('hit a bomb', currentCell);
        newCells = generateCells();
        currentCell = newCells[rowParam][colParam];
      }
      setLive(true);
    }

    if (
      currentCell.state === CellState.flagged ||
      currentCell.state === CellState.visible
    ) {
      return;
    }

    if (currentCell.value === CellValue.mine) {
      // Take care of mine click
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllMines();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam);
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
    }

    //won?
    let safeOpenCellsExists = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];

        if (
          currentCell.value !== CellValue.mine &&
          currentCell.state === CellState.open
        ) {
          safeOpenCellsExists = true;
          break;
        }
      }
    }

    if (!safeOpenCellsExists) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.mine) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );
      setHasWon(true);
    }

    setCells(newCells);
  };

  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();

      if (!live) {
        return;
      }

      const currentCells = cells.slice();
      const currentCell = cells[rowParam][colParam];

      if (currentCell.state === CellState.visible) {
        return;
      } else if (currentCell.state === CellState.open) {
        currentCells[rowParam][colParam].state = CellState.flagged;
        setCells(currentCells);
        setMineCounter(mineCounter - 1);
      } else if (currentCell.state === CellState.flagged) {
        currentCells[rowParam][colParam].state = CellState.open;
        setCells(currentCells);
        setMineCounter(mineCounter + 1);
      }
    };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateCells());
    setMineCounter(10);
    setFace(Face.smile);
    setHasLost(false);
    setHasWon(false);
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          onClick={handleCellClick}
          onContext={handleCellContext}
          red={cell.red}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };

  const showAllMines = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.mine) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }

        return cell;
      })
    );
  };

  return (
    <div className="Minesweeper">
      <div className="Header">
        <NumberDisplay value={mineCounter} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default Minesweeper;
