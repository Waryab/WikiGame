export type GameStatus = 'setup' | 'playing' | 'won';

export interface GameStats {
  startTime: number;
  endTime: number;
  clicks: number;
  path: string[];
}
