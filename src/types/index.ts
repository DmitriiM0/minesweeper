export enum CellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  mine,
}

export enum CellState {
  hidden,
  visible,
  flagged,
  question,
}

export enum Face {
  smile = '😁',
  lost = '😵',
  won = '😎',
}

export type Cell = { value: CellValue; state: CellState; red?: boolean };

export type ActionType =
  | 'selected_beginner'
  | 'selected_intermediate'
  | 'selected_advanced'
  | 'added_winner';

export interface Winner {
  name: string;
  result: number;
  difficulty: number;
}

export interface Action {
  type: ActionType;
  payload?: Winner[];
}

export interface Settings {
  numberOfRows: number;
  numberOfColumns: number;
  numberOfMines: number;
}
export interface State {
  settings: Settings;
  recordList?: Winner[];
}

export interface PopupProps {
  handleClose: () => void;
  open: boolean;
  time: number;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
