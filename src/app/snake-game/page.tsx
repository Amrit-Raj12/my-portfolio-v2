"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type GameState = "START" | "PLAYING" | "PAUSED" | "GAME_OVER";

interface SnakeSegment {
  x: number;
  y: number;
}

const GRID_WIDTH = 20;
const GRID_HEIGHT = 25;

export default function SnakeGamePage() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: 10, y: 12 },
    { x: 9, y: 12 },
    { x: 8, y: 12 },
  ]);
  const [, setDirection] = useState<Direction>("RIGHT");
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 15, y: 12 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(6);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Direction>("RIGHT");
  const scoreRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/snake-high-score")
      .then((res) => res.json())
      .then((data) => setHighScore(data.highScore))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/assets/audios/snake_music.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (gameState === "PLAYING") {
      audioRef.current.play().catch(() => {});
    } else if (gameState === "PAUSED" || gameState === "START" || gameState === "GAME_OVER") {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [gameState]);

  const generateFood = useCallback((): { x: number; y: number } => {
    let newFood: { x: number; y: number };
    let isOnSnake = true;
    
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
      isOnSnake = snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
      if (!isOnSnake) return newFood;
    }
    return { x: 15, y: 12 };
  }, [snake]);

  const checkCollision = useCallback((head: SnakeSegment, snakeBody: SnakeSegment[]): boolean => {
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      return true;
    }
    for (let i = 0; i < snakeBody.length - 1; i++) {
      if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
        return true;
      }
    }
    return false;
  }, []);

  const gameOver = useCallback(async (finalScore: number) => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    try {
      const res = await fetch("/api/snake-high-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: finalScore }),
      });
      const data = await res.json();
      if (data.isNewHighScore) {
        setHighScore(finalScore);
        setIsNewHighScore(true);
      }
    } catch { }
    
    setGameState("GAME_OVER");
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };
      
      switch (directionRef.current) {
        case "UP":
          newHead.y -= 1;
          break;
        case "DOWN":
          newHead.y += 1;
          break;
        case "LEFT":
          newHead.x -= 1;
          break;
        case "RIGHT":
          newHead.x += 1;
          break;
      }

      if (checkCollision(newHead, prevSnake)) {
        gameOver(scoreRef.current);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = scoreRef.current + 1;
        scoreRef.current = newScore;
        setScore(newScore);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, checkCollision, generateFood, gameOver]);

  useEffect(() => {
    if (gameState === "PLAYING") {
      gameLoopRef.current = setInterval(moveSnake, 150);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key === " " || key === "escape") {
        e.preventDefault();
        if (gameState === "PLAYING") {
          setGameState("PAUSED");
        } else if (gameState === "PAUSED") {
          setGameState("PLAYING");
        }
        return;
      }
      
      if (gameState !== "PLAYING") return;
      
      const currentDir = directionRef.current;
      
      if ((key === "w" || key === "arrowup") && currentDir !== "DOWN") {
        directionRef.current = "UP";
        setDirection("UP");
      } else if ((key === "s" || key === "arrowdown") && currentDir !== "UP") {
        directionRef.current = "DOWN";
        setDirection("DOWN");
      } else if ((key === "a" || key === "arrowleft") && currentDir !== "RIGHT") {
        directionRef.current = "LEFT";
        setDirection("LEFT");
      } else if ((key === "d" || key === "arrowright") && currentDir !== "LEFT") {
        directionRef.current = "RIGHT";
        setDirection("RIGHT");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const startGame = () => {
    setSnake([
      { x: 10, y: 12 },
      { x: 9, y: 12 },
      { x: 8, y: 12 },
    ]);
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setFood({ x: 15, y: 12 });
    setScore(0);
    scoreRef.current = 0;
    setIsNewHighScore(false);
    setGameState("PLAYING");
  };

  const restartGame = () => {
    startGame();
  };

  const resumeGame = () => {
    setGameState("PLAYING");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative" style={{
      backgroundImage: 'url(/assets/images/snake-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-[var(--cyber-bg)]/80"></div>
      <div className="relative z-10 w-full">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .retro-font {
          font-family: 'Press Start 2P', 'Oxanium', sans-serif;
        }

        .neon-glow-yellow {
          color: var(--neon-yellow);
          text-shadow: 
            0 0 10px var(--neon-yellow),
            0 0 20px var(--neon-yellow),
            0 0 40px rgba(255, 214, 0, 0.5);
        }

        .neon-glow-cyan {
          color: var(--neon-cyan);
          text-shadow: 
            0 0 10px var(--neon-cyan),
            0 0 20px var(--neon-cyan),
            0 0 40px rgba(0, 240, 255, 0.5);
        }

        .neon-glow-green {
          color: #00ff88;
          text-shadow: 
            0 0 10px #00ff88,
            0 0 20px #00ff88,
            0 0 40px rgba(0, 255, 136, 0.5);
        }

        .glassmorphism {
          background: rgba(6, 9, 13, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .game-board {
          background: rgba(10, 15, 20, 0.9);
          border: 4px solid #000;
          box-shadow: 
            0 0 20px rgba(0, 240, 255, 0.3),
            inset 0 0 60px rgba(0, 0, 0, 0.8);
        }

        .food-glow {
          box-shadow: 
            0 0 8px var(--neon-yellow),
            0 0 16px var(--neon-yellow),
            0 0 24px rgba(255, 214, 0, 0.6);
        }

        .snake-glow {
          box-shadow: 
            0 0 8px var(--neon-cyan),
            0 0 16px var(--neon-cyan),
            0 0 24px rgba(0, 240, 255, 0.6);
        }

        .play-icon {
          background: var(--neon-cyan);
          box-shadow: 
            0 0 10px var(--neon-cyan),
            0 0 20px rgba(0, 240, 255, 0.5);
        }

        .btn-glow:hover {
          box-shadow: 
            0 0 15px var(--neon-cyan),
            0 0 30px rgba(0, 240, 255, 0.6);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .pulse-anim {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <h1 className="retro-font text-2xl md:text-3xl lg:text-4xl text-center mb-4 neon-glow-yellow">
        Classic Snake Game
      </h1>

      <p className="retro-font text-xs md:text-sm lg:text-base text-center mb-6 neon-glow-cyan">
        Play and Relive the Fun!
      </p>

      <div className="flex justify-center">
        <div className="game-board w-[280px] h-[350px] md:w-[360px] md:h-[440px] lg:w-[440px] lg:h-[540px] rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 scanlines pointer-events-none"></div>
          
          {gameState === "START" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <button 
                onClick={startGame}
                className="retro-font text-xs md:text-sm play-icon w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 pulse-anim"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="var(--cyber-bg)" 
                  className="w-8 h-8 md:w-10 md:h-10 ml-1"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <p className="retro-font text-xs mt-6 neon-glow-cyan">Press to Start</p>
              <p className="retro-font text-[10px] mt-4 text-[var(--text-muted)] text-center px-4">
                Use W/A/S/D or Arrow keys to move<br/>
                Space/Esc to pause
              </p>
            </div>
          )}

          {gameState === "PAUSED" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 glassmorphism">
              <h2 className="retro-font text-lg neon-glow-yellow mb-4">PAUSED</h2>
              <button 
                onClick={resumeGame}
                className="retro-font text-xs play-icon px-6 py-3 rounded-lg cursor-pointer btn-glow"
              >
                RESUME
              </button>
            </div>
          )}

          {gameState === "GAME_OVER" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 glassmorphism">
              <h2 className="retro-font text-lg neon-glow-yellow mb-2">GAME OVER</h2>
              <p className="retro-font text-sm neon-glow-cyan mb-4">Score: {score}</p>
              {isNewHighScore && (
                <p className="retro-font text-xs neon-glow-green mb-4">NEW HIGH SCORE!</p>
              )}
              <button 
                onClick={restartGame}
                className="retro-font text-xs play-icon px-6 py-3 rounded-lg cursor-pointer btn-glow"
              >
                PLAY AGAIN
              </button>
            </div>
          )}

          {gameState !== "START" && (
            <div className="absolute inset-0 grid" style={{
              gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`,
            }}>
              {food && (
                <div 
                  className="food-glow rounded-sm" 
                  style={{
                    gridColumn: food.x + 1,
                    gridRow: food.y + 1,
                  }}
                />
              )}
              
              {snake.map((seg, i) => (
                <div 
                  key={i}
                  className={`${i === 0 ? 'snake-glow' : ''} rounded-sm`}
                  style={{
                    gridColumn: seg.x + 1,
                    gridRow: seg.y + 1,
                    backgroundColor: i === 0 ? 'var(--neon-cyan)' : 'rgba(0, 240, 255, 0.6)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between w-[280px] md:w-[360px] lg:w-[440px] mt-6 retro-font text-xs">
        <span className="neon-glow-cyan">HIGH-SCORE: {highScore}</span>
        <span className="neon-glow-cyan">SCORE: {score}</span>
      </div>
      </div>
    </main>
  );
}