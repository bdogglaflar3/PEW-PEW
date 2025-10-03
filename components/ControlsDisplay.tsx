
import React from 'react';

const Key: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`h-10 flex items-center justify-center border-2 border-gray-500 rounded bg-gray-800 font-sans text-sm mx-1 ${className || 'w-10'}`}>
    {children}
  </div>
);

const ControlsDisplay: React.FC = () => {
  return (
    <div className="flex justify-center w-full max-w-3xl mt-6 text-gray-400">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-cyan-400 mb-2">Controls</h3>
        <div className="flex items-center">
          <p className="text-sm mr-4">Move:</p>
          <div className="flex flex-col items-center">
            <Key>W</Key>
            <div className="flex">
              <Key>A</Key>
              <Key>S</Key>
              <Key>D</Key>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <p className="text-sm mr-4">Aim & Fire:</p>
          <div className="flex items-center justify-center w-20 h-12 border-2 border-gray-500 rounded bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l5-2 2 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 5.5l-3 3" />
            </svg>
          </div>
          <Key className="w-16">Click</Key>
        </div>
      </div>
    </div>
  );
};

export default ControlsDisplay;
