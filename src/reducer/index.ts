import { Action, State } from '../types';

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'selected_beginner': {
      return {
        ...state,
        settings: {
          numberOfRows: 8,
          numberOfColumns: 8,
          numberOfMines: 10,
        },
      };
    }
    case 'selected_intermediate': {
      return {
        ...state,
        settings: {
          numberOfRows: 16,
          numberOfColumns: 16,
          numberOfMines: 40,
        },
      };
    }
    case 'selected_advanced': {
      return {
        ...state,
        settings: {
          numberOfRows: 16,
          numberOfColumns: 32,
          numberOfMines: 100,
        },
      };
    }
    case 'added_winner': {
      localStorage.setItem('recordList', JSON.stringify(action.payload));
      return {
        ...state,
        recordList: action.payload,
      };
    }
    default:
      return state;
  }
}
