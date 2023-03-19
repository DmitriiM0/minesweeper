import React, { useState, useEffect } from 'react';
import NumberDisplay from '../NumberDisplay';
import { genereateCells, openMultipleCells } from '../../utils';
import Button from '../Button';
import { Face, Cell, CellState, CellValue } from '../../types';

import './Minesweeper.scss';

const Minesweeper: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(genereateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [mineCounter, setMineCounter] = useState<number>(10);

  useEffect(() => {
    const handleMouseDown = (): void => {
      setFace(Face.excited);
    };
    const handleMouseUp = (): void => {
      setFace(Face.smile);
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

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if (!live) {
      // Make sure you don't click on a mine in the beginning
      setLive(true);
    }

    const currentCell = cells[rowParam][colParam];
    //shallow copy of cells
    let newCells = cells.slice();

    if (
      currentCell.state === CellState.flagged ||
      currentCell.state === CellState.visible
    ) {
      return;
    }

    if (currentCell.value === CellValue.mine) {
      // Take care of mine click
    } else if (currentCell.value === CellValue.none) {
      //spread everything
	  newCells = openMultipleCells(newCells, rowParam, colParam)
	  setCells(newCells)
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
      setCells(newCells);
    }
  };

  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();

      if (!live) return;
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
    if (live) {
      setLive(false);
      setTime(0);
      setCells(genereateCells());
      setMineCounter(10);
    }
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
          row={rowIndex}
          col={colIndex}
        />
      ))
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
