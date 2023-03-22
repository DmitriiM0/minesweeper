import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberDisplay from '../../components/NumberDisplay';
import { generateCells, openMultipleCells } from '../../utils';
import ButtonCell from '../../components/Button';
import { Face, Cell, CellState, CellValue } from '../../types';
import { Context } from '../../context';
import { Button, Container, Box } from '@mui/material';
import Popup from '../../components/Popup';
import './Minesweeper.scss';

const Minesweeper: React.FC = () => {
  const { settings, recordList } = useContext(Context);
  const [cells, setCells] = useState<Cell[][]>(generateCells(settings));
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [mineCounter, setMineCounter] = useState<number>(
    settings.numberOfMines
  );
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isRecord, setIsRecord] = useState(false);
  const navigate = useNavigate();

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
      if (isRecord) {
        setTimeout(() => setOpen(true), 1000);
      }
    }
  }, [hasWon, isRecord]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let currentCell = cells[rowParam][colParam];
    let newCells = cells.slice();

    // do nothing if lost or won
    if (hasLost || hasWon) return;

    // if first cell is a mine
    if (!live) {
      while (currentCell.value === CellValue.mine) {
        console.log('hit a bomb', currentCell);
        newCells = generateCells(settings);
        currentCell = newCells[rowParam][colParam];
      }
      setLive(true);
    }

    // don't do anything
    if (
      currentCell.state === CellState.flagged ||
      currentCell.state === CellState.question ||
      currentCell.state === CellState.visible
    ) {
      return;
    }

    // if clicked on a valid area
    if (currentCell.value === CellValue.mine) {
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllMines();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam,
        colParam,
        settings.numberOfColumns,
        settings.numberOfRows
      );
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
    }

    //check if there are closed cells (loop through all cells)
    let safeClosedCellsExists = false;
    for (let row = 0; row < settings.numberOfRows; row++) {
      for (let col = 0; col < settings.numberOfColumns; col++) {
        const currentCell = newCells[row][col];

        if (
          currentCell.value !== CellValue.mine &&
          currentCell.state === CellState.hidden
        ) {
          safeClosedCellsExists = true;
          break;
        }
      }
    }

    // set all mine cells to flagged if no closed cell available
    if (!safeClosedCellsExists) {
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
      setMineCounter(0);

      // check if it's a new record
      if (recordList !== undefined && recordList.length === 0) {
        setIsRecord(true);
      } else if (recordList !== undefined && recordList.length <= 10) {
        const slowestTime = recordList
          ?.sort((a, b) => a.result - b.result)
          .slice(0, 10)[recordList.length - 1];
        time < slowestTime.result && setIsRecord(true);
      } else if (recordList !== undefined && recordList.length > 10) {
        const slowestTime = recordList
          ?.sort((a, b) => a.result - b.result)
          .slice(0, 10)[9];
        time < slowestTime.result && setIsRecord(true);
      }
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
      } else if (currentCell.state === CellState.hidden) {
        currentCells[rowParam][colParam].state = CellState.flagged;
        setCells(currentCells);
        setMineCounter(mineCounter - 1);
      } else if (currentCell.state === CellState.flagged) {
        currentCells[rowParam][colParam].state = CellState.question;
        setCells(currentCells);
        setMineCounter(mineCounter + 1);
      } else if (currentCell.state === CellState.question) {
        currentCells[rowParam][colParam].state = CellState.hidden;
        setCells(currentCells);
      }
    };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateCells(settings));
    setMineCounter(settings.numberOfMines);
    setFace(Face.smile);
    setHasLost(false);
    setHasWon(false);
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <ButtonCell
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
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: { xs: 'block', lg: 'flex' },
            mt: { xs: 4, lg: 0 },
            flexDirection: { xs: 'row', lg: 'column' },
            alignItems: { xs: 'none', lg: 'center' },
            height: '100vh',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          <Box
            sx={{
              borderRadius: '4px',
              background: '#c0c0c0',
              py: 1,
              px: 2,
              width: { xs: '100%', lg: 'auto' },
              display: 'flex',
              gap: { xs: 0, lg: 1 },
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <NumberDisplay value={mineCounter} />
            <div className="Face" onClick={handleFaceClick}>
              <span role="img" aria-label="face">
                {face}
              </span>
            </div>
            <NumberDisplay value={time} />
          </Box>
          <Popup handleClose={() => setOpen(false)} open={open} time={time} />
          <Box
            sx={{
              overflowX: { xs: 'scroll', lg: 'hidden' },
              textAlign: 'center',
            }}
          >
            <Box display="inline-block">
              <Box
                display="grid"
                sx={{
                  gridTemplateRows: `repeat(${settings.numberOfRows}, 1fr)`,
                  gridTemplateColumns: `repeat(${settings.numberOfColumns}, 1fr)`,
                }}
              >
                {renderCells()}
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            disableElevation
            sx={{ mt: 4, width: { xs: '100%', lg: 'auto' } }}
            onClick={() => navigate('/minesweeper')}
          >
            Настройки
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Minesweeper;
