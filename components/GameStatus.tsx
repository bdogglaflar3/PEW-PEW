import React from 'react';
import { GameState, type Player } from '../types';
import { BOT_ID } from '../constants';

interface GameStatusProps {
  gameState: GameState;
  winner: Player | null;
  level: number;
  onStart: () => void;
  onRestart: () => void;
}

const NeonButton: React.FC<{ onClick: () => void; children: React.ReactNode; color: string }> = ({ onClick, children, color }) => {
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.color = '#111827'; // bg-gray-900
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = color;
    }

    return (
        <button
            onClick={onClick}
            className="px-8 py-3 font-bold text-xl uppercase border-2 rounded-lg transition-all duration-300"
            style={{
                borderColor: color,
                color: color,
                textShadow: `0 0 8px ${color}`,
                boxShadow: `0 0 8px 0px ${color}, inset 0 0 8px 0px ${color}`
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </button>
    );
};


const GameStatus: React.FC<GameStatusProps> = ({ gameState, winner, onStart, onRestart, level }) => {
  if (gameState === GameState.Playing) return null;

  const renderContent = () => {
    switch (gameState) {
      case GameState.StartScreen:
        return (
          <>
            <h2 className="text-3xl mb-2">Player vs. Computer</h2>
            <p className="text-lg text-gray-400 mb-8">First to land a shot wins. Beat all 3 levels.</p>
            <NeonButton onClick={onStart} color="cyan">Start Game</NeonButton>
          </>
        );
      case GameState.LevelComplete:
        return (
            <h2 className="text-5xl mb-4" style={{ color: 'cyan', textShadow: `0 0 10px cyan` }}>
                Level {level - 1} Complete!
            </h2>
        );
      case GameState.GameOver:
        const title = winner?.id === BOT_ID ? "Computer Wins!" : "You Win!";
        return (
          <>
            <h2 className="text-5xl mb-4" style={{ color: winner?.color, textShadow: `0 0 10px ${winner?.color}` }}>
              {title}
            </h2>
            <NeonButton onClick={onRestart} color={winner?.color || 'white'}>Try Again</NeonButton>
          </>
        );
      case GameState.GameComplete:
        return (
            <>
                <h2 className="text-5xl mb-4" style={{ color: 'cyan', textShadow: `0 0 10px cyan` }}>
                    Congratulations!
                </h2>
                <p className="text-lg text-gray-400 mb-8">You beat all levels!</p>
                <NeonButton onClick={onStart} color="cyan">Play Again</NeonButton>
            </>
        )
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10 text-center">
      {renderContent()}
    </div>
  );
};

export default GameStatus;