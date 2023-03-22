import React, { createContext, useReducer, Dispatch } from 'react';
import reducer from '../reducer';
import { Action, State } from '../types';

export const Context = createContext<State>({
  settings: { numberOfRows: 8, numberOfColumns: 8, numberOfMines: 10 },
  recordList: [],
});

export const DispatchContext = createContext<React.Dispatch<Action>>(
  () => null
);
