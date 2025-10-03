
import React from 'react';
import type { Barricade as BarricadeType } from '../types';

interface BarricadeProps {
  barricade: BarricadeType;
}

const Barricade: React.FC<BarricadeProps> = ({ barricade }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${barricade.x}px`,
    top: `${barricade.y}px`,
    width: `${barricade.width}px`,
    height: `${barricade.height}px`,
    backgroundColor: '#4b5563', // bg-gray-600
    border: '2px solid #6b7280', // border-gray-500
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
  };

  return <div style={style}></div>;
};

export default Barricade;
