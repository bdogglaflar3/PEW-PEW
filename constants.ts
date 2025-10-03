import type { Player, Level } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const PLAYER_SIZE = 24;
export const PLAYER_SPEED = 3;
export const PLAYER_MAX_HEALTH = 100;
export const LASER_DAMAGE = 25;
export const PLAYER_TURN_SPEED = 4; // Not used with keyboard turning, but could be repurposed

export const LASER_SPEED = 8;
export const LASER_LENGTH = 20;
export const LASER_WIDTH = 4;
export const LASER_COOLDOWN = 300; // milliseconds

export const SERVER_TICK_RATE = 1000 / 60; // 60 ticks per second

export const BOT_ID = 'player-2';

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'player-1',
    x: 100,
    y: 300,
    angle: 0,
    turretAngle: 0,
    color: 'cyan',
    isAlive: true,
    health: PLAYER_MAX_HEALTH,
  },
  {
    id: 'player-2',
    x: 700,
    y: 300,
    angle: 180,
    turretAngle: 180,
    color: 'orange',
    isAlive: true,
    health: PLAYER_MAX_HEALTH,
  },
];

export const LEVELS: Level[] = [
    {
        level: 1,
        botConfig: { speedMultiplier: 0.8, fireRateMultiplier: 1.8, aimingFactor: 0.15 },
        barricades: [
            { id: 1, x: 300, y: 200, width: 200, height: 30 },
            { id: 2, x: 300, y: 370, width: 200, height: 30 },
            { id: 3, x: 250, y: 250, width: 30, height: 100 },
            { id: 4, x: 520, y: 250, width: 30, height: 100 },
        ],
    },
    {
        level: 2,
        botConfig: { speedMultiplier: 0.9, fireRateMultiplier: 1.5, aimingFactor: 0.2 },
        barricades: [
            { id: 1, x: 150, y: 150, width: 30, height: 150 },
            { id: 2, x: 620, y: 300, width: 30, height: 150 },
            { id: 3, x: 350, y: 80, width: 100, height: 30 },
            { id: 4, x: 350, y: 490, width: 100, height: 30 },
        ],
    },
    {
        level: 3,
        botConfig: { speedMultiplier: 1.0, fireRateMultiplier: 1.2, aimingFactor: 0.25 },
        barricades: [
            { id: 1, x: 200, y: 100, width: 400, height: 30 },
            { id: 2, x: 200, y: 470, width: 400, height: 30 },
            { id: 3, x: 100, y: 285, width: 200, height: 30 },
            { id: 4, x: 500, y: 285, width: 200, height: 30 },
            { id: 5, x: 385, y: 130, width: 30, height: 155 },
            { id: 6, x: 385, y: 315, width: 30, height: 155 },
        ],
    },
];