import React, { useState } from 'react';
import NumberDisplay from '../NumberDisplay';
import { genereateCells } from '../../utils';
import Button from '../Button';

import './Minesweeper.scss';

const Minesweeper: React.FC = () => {
  const [cells, setCells] = useState(genereateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button key={`${rowIndex}-${colIndex}`} state={cell.state} value={cell.value} row={rowIndex} col={colIndex} />
      ))
    );
  };

  return (
    <div className="Minesweeper">
      <div className="Header">
        <NumberDisplay value={0} />
        <div className="Face">
          <span role="img" aria-label="face">
            😁
          </span>
        </div>
        <NumberDisplay value={23} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default Minesweeper;
