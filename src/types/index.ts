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
  open,
  visible,
  flagged,
}

export enum Face {
  smile = '😁',
  excited = '😧',
  lost = '😵',
  won = '😎',
}

export type Cell = { value: CellValue; state: CellState };
