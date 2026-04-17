import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { TerminalSquare } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden p-4 flex flex-col relative w-full items-center justify-center scanlines overflow-y-auto">
      {/* Static Noise Overlay */}
      <div className="fixed inset-0 static-noise-bg z-0 pointer-events-none"></div>

      <div className="z-10 w-full max-w-6xl flex flex-col items-center screen-tear relative mt-12 md:mt-24 mb-16">
        {/* Header */}
        <header className="mb-10 text-center flex flex-col items-center justify-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-black border-4 border-[#00FFFF] shadow-[8px_8px_0_#FF00FF] mb-2 fast-flicker relative z-10">
            <TerminalSquare className="w-10 h-10 text-[#00FFFF]" strokeWidth={1.5} />
          </div>
          
          <div className="relative isolate py-4">
            <h1 
              className="text-3xl md:text-5xl lg:text-6xl font-pixel uppercase text-white glitch z-10"
              data-text="NEON_SERPENT.EXE"
            >
              NEON<span className="text-[#00FFFF]">_</span>SERPENT<span className="text-[#FF00FF]">.</span>EXE
            </h1>
          </div>
          
          <p className="text-[#FF00FF] font-mono tracking-widest text-xl md:text-2xl uppercase bg-black px-2 py-1 border-l-4 border-[#00FFFF] shadow-[4px_4px_0_#00FFFF]">
            &gt; SYSTEM_OVERRIDE_ACTIVE <span className="animate-pulse inline-block">_</span>
          </p>
        </header>

        {/* Main Content Layout */}
        <main className="w-full grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start max-w-[1200px]">
          {/* Game Window */}
          <section className="xl:col-span-8 flex justify-center w-full relative z-10">
            <SnakeGame />
          </section>

          {/* Player Window */}
          <section className="xl:col-span-4 flex justify-center items-start w-full relative z-10">
            <MusicPlayer />
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center text-[#00FFFF] font-mono text-xl md:text-2xl uppercase tracking-widest bg-black border-b-4 border-t-2 border-[#FF00FF] px-8 py-3 shadow-[0_8px_0_#00FFFF] mb-12">
          <p>EOF // AI_DIRECTIVE_ENFORCED</p>
        </footer>
      </div>
    </div>
  );
}
