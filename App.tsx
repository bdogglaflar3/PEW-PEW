
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, type Player, type Laser } from './types';
import { 
  INITIAL_PLAYERS, LEVELS, PLAYER_SIZE, GAME_WIDTH, GAME_HEIGHT, 
  PLAYER_SPEED, LASER_COOLDOWN, LASER_SPEED, SERVER_TICK_RATE, 
  LASER_WIDTH, BOT_ID, LASER_DAMAGE
} from './constants';
import GameCanvas from './components/GameCanvas';
import GameStatus from './components/GameStatus';
import ControlsDisplay from './components/ControlsDisplay';
import { checkCollision, lineIntersectsRect } from './utils/collision';

const THIS_PLAYER_ID = 'player-1';

function App() {
  const [uiState, setUiState] = useState<GameState>(GameState.StartScreen);
  const [winner, setWinner] = useState<Player | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const [renderState, setRenderState] = useState({
      players: INITIAL_PLAYERS,
      lasers: [] as Laser[],
      barricades: LEVELS[0].barricades
  });

  const gameCanvasRef = useRef<HTMLDivElement>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const isMouseDown = useRef(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const lastShotTime = useRef(0);
  
  const serverState = useRef({
      players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)) as Player[],
      lasers: [] as Laser[],
  });

  const botState = useRef({
    lastShotTime: 0,
    strafeDirection: 1,
    lastStrafeChange: 0,
  });


  const resetGame = useCallback(() => {
    const currentLevel = LEVELS[currentLevelIndex];
    serverState.current = {
        players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)),
        lasers: [],
    };
    botState.current = {
      lastShotTime: 0,
      strafeDirection: 1,
      lastStrafeChange: 0,
    };
    setRenderState({
      players: serverState.current.players,
      lasers: [],
      barricades: currentLevel.barricades,
    });
    setWinner(null);
    setUiState(GameState.Playing);
  }, [currentLevelIndex]);

  const startGame = () => {
    setCurrentLevelIndex(0);
    // Use a timeout to ensure state is updated before resetGame is called
    setTimeout(resetGame, 0);
  };

  const advanceLevel = () => {
    const nextLevelIndex = currentLevelIndex + 1;
    if (nextLevelIndex < LEVELS.length) {
      setCurrentLevelIndex(nextLevelIndex);
      // Use a timeout to ensure state is updated before resetGame is called
      setTimeout(resetGame, 0);
    } else {
      setUiState(GameState.GameComplete);
    }
  }
  
  // The "Server Tick"
  useEffect(() => {
    if (uiState !== GameState.Playing) return;

    const currentLevel = LEVELS[currentLevelIndex];
    const barricades = currentLevel.barricades;
    const botConfig = currentLevel.botConfig;

    const gameLogicInterval = setInterval(() => {
      const { players, lasers } = serverState.current;
      const now = Date.now();
      
      let updatedPlayers = [...players];

      // --- Bot AI Logic ---
      const humanPlayer = updatedPlayers.find(p => p.id === THIS_PLAYER_ID);
      const botPlayer = updatedPlayers.find(p => p.id === BOT_ID);

      if (humanPlayer && botPlayer && botPlayer.isAlive && humanPlayer.isAlive) {
        const dx = humanPlayer.x - botPlayer.x;
        const dy = humanPlayer.y - botPlayer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 1. Aiming
        const angleToPlayer = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        const angleDiff = ((((angleToPlayer - botPlayer.turretAngle) % 360) + 540) % 360) - 180;
        botPlayer.turretAngle += angleDiff * botConfig.aimingFactor;

        // 2. Shooting
        if (now - botState.current.lastShotTime > LASER_COOLDOWN * botConfig.fireRateMultiplier) {
          const hasLineOfSight = !barricades.some(b => 
            lineIntersectsRect({ x: botPlayer.x, y: botPlayer.y }, { x: humanPlayer.x, y: humanPlayer.y }, b)
          );
          if (hasLineOfSight && distance < GAME_WIDTH / 1.5) {
            botState.current.lastShotTime = now;
            serverState.current.lasers.push({
              id: now + Math.random(),
              x: botPlayer.x,
              y: botPlayer.y,
              angle: botPlayer.turretAngle,
              playerId: botPlayer.id,
              color: botPlayer.color,
            });
          }
        }
        
        // 3. Movement
        let moveX = 0;
        let moveY = 0;
        const idealDistance = 250;

        if (now - botState.current.lastStrafeChange > 2000) {
            botState.current.strafeDirection *= -1;
            botState.current.lastStrafeChange = now;
        }

        if (distance > idealDistance) {
            moveX += dx / distance;
            moveY += dy / distance;
        } else {
            moveX -= dx / distance;
            moveY -= dy / distance;
        }
        moveX += (-dy / distance) * botState.current.strafeDirection * 0.7;
        moveY += (dx / distance) * botState.current.strafeDirection * 0.7;

        if (moveX !== 0 || moveY !== 0) {
            const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
            const finalMoveX = (moveX / magnitude) * PLAYER_SPEED * botConfig.speedMultiplier;
            const finalMoveY = (moveY / magnitude) * PLAYER_SPEED * botConfig.speedMultiplier;

            const nextX = botPlayer.x + finalMoveX;
            const nextY = botPlayer.y + finalMoveY;
            const playerBounds = { x: nextX, y: nextY, radius: PLAYER_SIZE / 2 };

            if (nextX - PLAYER_SIZE / 2 > 0 && nextX + PLAYER_SIZE / 2 < GAME_WIDTH &&
                nextY - PLAYER_SIZE / 2 > 0 && nextY + PLAYER_SIZE / 2 < GAME_HEIGHT &&
                !barricades.some(b => checkCollision(playerBounds, b))) {
                botPlayer.x = nextX;
                botPlayer.y = nextY;
            }
        }
      }

      // --- Update Human Player ---
      updatedPlayers = updatedPlayers.map(player => {
        if (!player.isAlive || player.id !== THIS_PLAYER_ID) return player;
        
        const canvasRect = gameCanvasRef.current?.getBoundingClientRect();
        if (canvasRect) {
            const playerCenterX = player.x + canvasRect.left;
            const playerCenterY = player.y + canvasRect.top;
            player.turretAngle = Math.atan2(
              mousePosition.current.y - playerCenterY, 
              mousePosition.current.x - playerCenterX
            ) * (180 / Math.PI) + 90;
        }

        let dx = 0;
        let dy = 0;
        if (keysPressed.current.has('w')) dy -= 1;
        if (keysPressed.current.has('s')) dy += 1;
        if (keysPressed.current.has('a')) dx -= 1;
        if (keysPressed.current.has('d')) dx += 1;
        
        if (dx !== 0 || dy !== 0) {
            const magnitude = Math.sqrt(dx * dx + dy * dy);
            const moveX = (dx / magnitude) * PLAYER_SPEED;
            const moveY = (dy / magnitude) * PLAYER_SPEED;

            const nextX = player.x + moveX;
            const nextY = player.y + moveY;
            
            const playerBounds = { x: nextX, y: nextY, radius: PLAYER_SIZE / 2 };

            if (nextX - PLAYER_SIZE / 2 < 0 || nextX + PLAYER_SIZE / 2 > GAME_WIDTH ||
                nextY - PLAYER_SIZE / 2 < 0 || nextY + PLAYER_SIZE / 2 > GAME_HEIGHT) {
            } else if (!barricades.some(b => checkCollision(playerBounds, b))) {
                player.x = nextX;
                player.y = nextY;
            }
        }

        if (isMouseDown.current) {
          if (now - lastShotTime.current > LASER_COOLDOWN) {
            lastShotTime.current = now;
            serverState.current.lasers.push({
              id: now + Math.random(),
              x: player.x,
              y: player.y,
              angle: player.turretAngle,
              playerId: player.id,
              color: player.color,
            });
          }
        }
        return player;
      });
      
      // --- Update Lasers & Check Collisions ---
      const activeLasers: Laser[] = [];
      for (const laser of lasers) {
        const rad = (laser.angle - 90) * (Math.PI / 180);
        laser.x += LASER_SPEED * Math.cos(rad);
        laser.y += LASER_SPEED * Math.sin(rad);

        if (laser.x < 0 || laser.x > GAME_WIDTH || laser.y < 0 || laser.y > GAME_HEIGHT) continue;
        
        const laserBounds = { x: laser.x, y: laser.y, radius: LASER_WIDTH / 2 };
        if (barricades.some(b => checkCollision(laserBounds, b))) continue;

        let hitPlayer = false;
        for (const player of updatedPlayers) {
          if (player.isAlive && player.id !== laser.playerId) {
            const dx = laser.x - player.x;
            const dy = laser.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < PLAYER_SIZE / 2) {
              player.health -= LASER_DAMAGE;
              
              if (player.health <= 0) {
                player.health = 0;
                player.isAlive = false;
                const winner = updatedPlayers.find(p => p.id === laser.playerId);
                setWinner(winner || null);
                
                if (winner?.id === THIS_PLAYER_ID) {
                  if (currentLevelIndex < LEVELS.length - 1) {
                    setUiState(GameState.LevelComplete);
                    setTimeout(advanceLevel, 2000);
                  } else {
                    setUiState(GameState.GameComplete);
                  }
                } else {
                  setUiState(GameState.GameOver);
                }
              }

              hitPlayer = true;
              break;
            }
          }
        }
        if (!hitPlayer) {
          activeLasers.push(laser);
        }
      }

      serverState.current.players = updatedPlayers;
      serverState.current.lasers = activeLasers;

      setRenderState(prev => ({
          ...prev,
          players: [...serverState.current.players],
          lasers: [...serverState.current.lasers],
      }));

    }, SERVER_TICK_RATE);

    return () => clearInterval(gameLogicInterval);
  }, [uiState, resetGame, currentLevelIndex]);

  // --- Client-side Input Handlers ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());
    const handleMouseMove = (e: MouseEvent) => {
        mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseDown = () => isMouseDown.current = true;
    const handleMouseUp = () => isMouseDown.current = false;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 font-mono">
      <div className="flex justify-between w-full max-w-[800px] mb-2 px-1">
        <h1 className="text-4xl font-bold text-cyan-400" style={{ textShadow: '0 0 8px #0891b2' }}>
          LASER DOTS
        </h1>
        {uiState === GameState.Playing && (
          <h2 className="text-3xl font-bold text-gray-300">
            Level: {currentLevelIndex + 1}
          </h2>
        )}
      </div>
      <div className="relative" ref={gameCanvasRef}>
        <GameStatus gameState={uiState} winner={winner} onStart={startGame} onRestart={resetGame} level={currentLevelIndex + 1}/>
        <GameCanvas players={renderState.players} lasers={renderState.lasers} barricades={renderState.barricades} />
      </div>
      <ControlsDisplay />
    </div>
  );
}

export default App;