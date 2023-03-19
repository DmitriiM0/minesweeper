import React from 'react';
import NumberDisplay from '../NumberDisplay';
import './Minesweeper.scss';

const Minesweeper: React.FC = () => {
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
      <div className="Body">Body</div>
    </div>
  );
};

export default Minesweeper;
