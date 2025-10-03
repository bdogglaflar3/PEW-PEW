
import React from 'react';
import type { Laser as LaserType } from '../types';
import { LASER_LENGTH, LASER_WIDTH } from '../constants';

interface LaserProps {
  laser: LaserType;
}

const Laser: React.FC<LaserProps> = ({ laser }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${laser.x}px`,
    top: `${laser.y}px`,
    width: `${LASER_WIDTH}px`,
    height: `${LASER_LENGTH}px`,
    backgroundColor: laser.color,
    transform: `translate(-50%, -50%) rotate(${laser.angle}deg)`,
    boxShadow: `0 0 10px ${laser.color}, 0 0 15px ${laser.color}`,
    borderRadius: '2px',
  };

  return <div style={style}></div>;
};

export default Laser;
