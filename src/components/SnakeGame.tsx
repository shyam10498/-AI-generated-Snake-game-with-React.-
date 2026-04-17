import React from 'react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { Play, RotateCcw, TerminalSquare } from 'lucide-react';

export function SnakeGame() {
  const { snake, food, gameOver, isPaused, score, highScore, togglePause, resetGame, GRID_SIZE } = useSnakeGame();

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
        const isHead = snake[0].x === x && snake[0].y === y;
        const isFood = food.x === x && food.y === y;

        grid.push(
          <div
            key={`${x}-${y}`}
            className={`w-full h-full transition-none ${
              isHead
                ? 'bg-white border-[2px] border-[#00FFFF] z-10 relative'
                : isSnake
                ? 'bg-[#00FFFF] border border-black/20'
                : isFood
                ? 'bg-[#FF00FF] fast-flicker border border-[#FF00FF]'
                : 'bg-[#111] border-[1px] border-[#222]'
            }`}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black border-4 border-[#00FFFF] shadow-[12px_12px_0_#FF00FF] relative w-full lg:max-w-2xl transform hover:-translate-x-1 hover:-translate-y-1 transition-transform">
      {/* Header Info */}
      <div className="flex justify-between w-full mb-4 font-mono text-3xl z-10 uppercase border-b-4 border-[#FF00FF] pb-4">
        <div className="flex flex-col leading-none">
          <span className="text-[#00FFFF] font-bold">PTS:{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end leading-none">
          <span className="text-[#FF00FF] font-bold">MAX:{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative p-2 bg-[#1a1a1a] border-4 border-white z-10 w-full overflow-hidden">
        {/* Subtle decorative scanlines on grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_50%,_transparent_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>

        <div
          className="grid bg-black mx-auto relative z-10"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: '100%',
            aspectRatio: '1/1',
            maxWidth: '500px'
          }}
        >
          {renderGrid()}
        </div>

        {/* Overlays */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 p-4 border-2 border-dashed border-[#FF00FF] m-2">
            <div className="text-center p-8 border-4 border-[#FF00FF] bg-black shadow-[8px_8px_0_#00FFFF] w-full max-w-[320px]">
              {gameOver ? (
                <>
                  <div className="relative overflow-hidden mb-6">
                    <h2 className="text-xl md:text-2xl font-pixel text-red-500 glitch py-2" data-text="FATAL_ERR">
                      FATAL_ERR
                    </h2>
                  </div>
                  <p className="text-white mb-8 font-mono text-3xl">&gt; MEM_DUMP: {score}</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center justify-center space-x-3 w-full px-4 py-4 bg-[#00FFFF] hover:bg-[#FF00FF] text-black font-pixel text-[10px] md:text-xs tracking-wider border-4 border-white transition-none uppercase shadow-none hover:shadow-[4px_4px_0_white]"
                  >
                    <RotateCcw className="w-6 h-6" strokeWidth={3} />
                    <span>REBOOT_SYS</span>
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-pixel text-[#00FFFF] mb-8 animate-pulse text-shadow-sm">&gt; PAUSED</h2>
                  <button
                    onClick={togglePause}
                    className="flex items-center justify-center space-x-3 w-full px-4 py-4 border-4 border-[#00FFFF] bg-black text-[#00FFFF] hover:bg-[#FF00FF] hover:border-white hover:text-white font-pixel text-[10px] md:text-xs uppercase shadow-[4px_4px_0_#FF00FF] hover:shadow-none translate-x-0 translate-y-0 transition-none"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    <span>RESUME_OP</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls Help */}
      <div className="mt-6 flex gap-4 text-xl md:text-2xl font-mono text-white z-10 w-full justify-between items-center bg-[#111] p-3 border-2 border-[#333]">
        <span className="tracking-tighter">&gt; INPUT:[WASD|ARROWS]</span>
        <button
          onClick={togglePause}
          className="flex items-center gap-2 text-[#FF00FF] hover:text-black hover:bg-[#FF00FF] px-2 py-1 border-2 border-transparent hover:border-white cursor-pointer uppercase font-bold"
          disabled={gameOver}
        >
          {isPaused ? <Play className="w-5 h-5 fill-current" /> : <TerminalSquare className="w-5 h-5" />}
          <span>[SPC]</span>
        </button>
      </div>
    </div>
  );
}
