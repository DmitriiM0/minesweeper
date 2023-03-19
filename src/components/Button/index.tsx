import React from 'react';
import { CellState, CellValue } from '../../types';
import './Button.scss';

interface ButtonProps {
  col: number;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
  row: number;
  state: CellState;
  value: CellValue;
}

const Button: React.FC<ButtonProps> = ({
  row,
  col,
  onClick,
  onContext,
  state,
  value,
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
    }
  };

  return (
    <div
      className={`Button ${
        state === CellState.visible ? 'visible' : ''
      } value-${value}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
