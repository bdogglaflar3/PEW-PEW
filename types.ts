
export interface Player {
  id: string;
  x: number;
  y: number;
  angle: number; // For movement direction
  turretAngle: number; // For aiming
  color: string;
  isAlive: boolean;
  health: number;
}

export interface Laser {
  id: number;
  x: number;
  y: number;
  angle: number;
  playerId: string;
  color: string;
}

export interface Barricade {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BotConfig {
  speedMultiplier: number;
  fireRateMultiplier: number;
  aimingFactor: number;
}

export interface Level {
  level: number;
  barricades: Barricade[];
  botConfig: BotConfig;
}

export enum GameState {
  StartScreen,
  Playing,
  LevelComplete,
  GameOver,
  GameComplete,
}