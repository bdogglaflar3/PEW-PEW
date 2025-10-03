
import React from 'react';
import type { Player as PlayerType } from '../types';
import { PLAYER_SIZE, PLAYER_MAX_HEALTH } from '../constants';

interface PlayerProps {
  player: PlayerType;
}

const Player: React.FC<PlayerProps> = ({ player }) => {
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${player.x}px`,
    top: `${player.y}px`,
    width: 0,
    height: 0,
    transition: 'left 16ms linear, top 16ms linear',
  };

  const bodyStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${-PLAYER_SIZE / 2}px`,
    top: `${-PLAYER_SIZE / 2}px`,
    width: `${PLAYER_SIZE}px`,
    height: `${PLAYER_SIZE}px`,
    borderRadius: '50%',
    backgroundColor: player.color,
    boxShadow: `0 0 12px ${player.color}`,
  };

  const turretStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '4px',
    height: `${PLAYER_SIZE / 2 + 4}px`,
    backgroundColor: 'white',
    transformOrigin: '2px 2px',
    transform: `translate(-50%, -50%) rotate(${player.turretAngle}deg)`,
    borderRadius: '2px',
    // Smooth turret rotation
    transition: 'transform 50ms linear',
  };

  const healthPercentage = (player.health / PLAYER_MAX_HEALTH) * 100;
  let healthBarColor = '#22c55e'; // green-500
  if (healthPercentage <= 50) healthBarColor = '#facc15'; // yellow-400
  if (healthPercentage <= 25) healthBarColor = '#ef4444'; // red-500

  const healthBarContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${-PLAYER_SIZE / 2 - 12}px`,
    left: `${-PLAYER_SIZE / 2}px`,
    width: `${PLAYER_SIZE}px`,
    height: '6px',
    backgroundColor: '#374151', // gray-700
    borderRadius: '3px',
    border: '1px solid #4b5563', // gray-600
    overflow: 'hidden',
  };

  const healthBarFillStyle: React.CSSProperties = {
    width: `${healthPercentage}%`,
    height: '100%',
    backgroundColor: healthBarColor,
    borderRadius: '2px',
    transition: 'width 0.2s ease-in-out, background-color 0.2s ease-in-out',
  };

  return (
    <div style={containerStyle}>
      <div style={healthBarContainerStyle}>
        <div style={healthBarFillStyle}></div>
      </div>
      <div style={bodyStyle}></div>
      <div style={turretStyle}></div>
    </div>
  );
};

export default Player;