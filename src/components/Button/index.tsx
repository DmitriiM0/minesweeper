import React from 'react';
import { CellState, CellValue } from '../../types';
import './Cell.scss';

interface CellProps {
  col: number;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
  row: number;
  state: CellState;
  value: CellValue;
  red?: boolean;
}

const Cell: React.FC<CellProps> = ({
  row,
  col,
  onClick,
  onContext,
  state,
  value,
  red,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.visible) {
      if (value === CellValue.mine) {
        return (
          <span role="img" aria-label="mine">
            💣
          </span>
        );
      } else if (value === CellValue.none) {
        return null;
      }
      return value;
    } else if (state === CellState.flagged) {
      return (
        <span role="img" aria-label="flag">
          🚩
        </span>
      );
    } else if (state === CellState.question) {
      return (
        <span role="img" aria-label="flag">
          ❓
        </span>
      );
    }
  };

  return (
    <div
      className={`Cell ${
        state === CellState.visible ? 'visible' : ''
      } value-${value} ${red ? 'red' : ''}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
    >
      {renderContent()}
    </div>
  );
};

export default Cell;
