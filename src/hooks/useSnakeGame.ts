import { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // Moving up

export function useSnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  // Use refs to access latest state inside the interval without recreating it
  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const isPausedRef = useRef(isPaused);
  const gameOverRef = useRef(gameOver);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  }, [generateFood]);

  const togglePause = useCallback(() => {
    if (!gameOver) {
      setIsPaused((p) => !p);
    }
  }, [gameOver]);

  const changeDirection = useCallback((newDir: Point) => {
    const currentDir = directionRef.current;
    // Prevent 180 degree turns
    if (newDir.x === -currentDir.x && currentDir.x !== 0) return;
    if (newDir.y === -currentDir.y && currentDir.y !== 0) return;
    setDirection(newDir);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when using arrow keys, but only if not paused and not game over
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        togglePause();
        return;
      }

      if (isPausedRef.current || gameOverRef.current) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, togglePause]);

  useEffect(() => {
    const moveSnake = () => {
      if (isPausedRef.current || gameOverRef.current) return;

      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const dir = directionRef.current;
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        setFood((currentFood) => {
          if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
            setScore((s) => {
              const newScore = s + 10;
              setHighScore((hs) => Math.max(hs, newScore));
              return newScore;
            });
            generateFood(newSnake);
            // Don't pop, snake grows
            return currentFood;
          } else {
            // Did not eat food, remove tail
            newSnake.pop();
            return currentFood; // keeping food the same
          }
        });

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 120); // Snake speed
    return () => clearInterval(intervalId);
  }, [generateFood]);

  return {
    snake,
    food,
    direction,
    gameOver,
    isPaused,
    score,
    highScore,
    togglePause,
    resetGame,
    GRID_SIZE,
  };
}
