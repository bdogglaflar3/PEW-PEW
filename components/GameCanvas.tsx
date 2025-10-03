
import React from 'react';
import type { Player as PlayerType, Laser as LaserType, Barricade as BarricadeType } from '../types';
import Player from './Player';
import Laser from './Laser';
import Barricade from './Barricade';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';

interface GameCanvasProps {
  players: PlayerType[];
  lasers: LaserType[];
  barricades: BarricadeType[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ players, lasers, barricades }) => {
  return (
    <div
      className="relative bg-black bg-opacity-50 border-2 border-cyan-400 overflow-hidden"
      style={{
        width: `${GAME_WIDTH}px`,
        height: `${GAME_HEIGHT}px`,
        boxShadow: '0 0 15px rgba(10, 179, 204, 0.5), inset 0 0 15px rgba(10, 179, 204, 0.3)',
        backgroundImage: `
          linear-gradient(rgba(10, 179, 204, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(10, 179, 204, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }}
    >
      {barricades.map(barricade => <Barricade key={barricade.id} barricade={barricade} />)}
      {players.map(player => player.isAlive && <Player key={player.id} player={player} />)}
      {lasers.map(laser => <Laser key={laser.id} laser={laser} />)}
    </div>
  );
};

export default GameCanvas;
