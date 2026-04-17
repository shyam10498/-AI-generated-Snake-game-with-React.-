import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, VolumeX, Terminal, Filter } from 'lucide-react';

const TRACKS = [
  {
    title: 'DATA_STREAM_01',
    artist: 'GHOST_IN_MACHINE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '06:12'
  },
  {
    title: 'MEMORY_LEAK_02',
    artist: 'ROGUAI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '07:05'
  },
  {
    title: 'KERNEL_PANIC',
    artist: 'NULL_PTR',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '05:44'
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.warn("Autoplay strict blocked:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrackIndex, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const handlePrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  return (
    <div className="flex flex-col p-6 bg-black border-4 border-[#FF00FF] shadow-[-12px_12px_0_#00FFFF] w-full max-w-lg relative transform hover:translate-x-1 hover:translate-y-1 transition-transform">
      <audio ref={audioRef} src={currentTrack.url} onEnded={handleNext} />

      <div className="absolute px-2 py-1 bg-[#00FFFF] text-black font-pixel text-[8px] -top-3 -right-3 border-2 border-black rotate-[5deg] z-20 flex items-center gap-1">
        <Filter className="w-3 h-3" />
        <span>AUDIO_BUS_ACTIVE</span>
      </div>

      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-8 border-b-4 border-[#333] pb-6 relative">
        <div className="w-20 h-20 bg-[#111] flex items-center justify-center border-4 border-[#00FFFF] flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#00FFFF] opacity-20 pointer-events-none fast-flicker"></div>
          <Terminal className={`w-10 h-10 ${isPlaying ? 'text-[#00FFFF] fast-flicker' : 'text-[#444]'}`} />
        </div>
        <div className="flex flex-col overflow-hidden max-w-full justify-center">
          <span className="text-xl md:text-2xl font-mono text-[#00FFFF] uppercase tracking-widest bg-[#111] px-2 leading-none inline-block self-start mb-2 border border-[#333]">
            &gt; EXEC_AUDIO <span className={isPlaying ? 'animate-pulse text-[#FF00FF]' : 'text-transparent'}>_</span>
          </span>
          <h3 className="text-white font-pixel text-[10px] md:text-xs truncate uppercase mt-1 leading-relaxed">
            {currentTrack.title}
          </h3>
          <span className="text-[#FF00FF] text-2xl font-mono truncate mt-1 bg-black">{currentTrack.artist}</span>
        </div>
      </div>

      {/* Glitch Progress placeholder */}
      <div className="w-full h-6 bg-[#111] mb-8 relative border-2 border-[#444] overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,_#fff_1px,_transparent_1px)] bg-[length:10px_100%] pointer-events-none"></div>

        <div 
          className={`absolute top-0 left-0 h-full bg-[#00FFFF] border-r-4 border-white transition-all duration-1000 ${isPlaying ? 'w-2/3 shadow-[0_0_15px_#00FFFF]' : 'w-1/3'}`} 
          style={{ animation: isPlaying ? 'progress 10s linear infinite' : 'none' }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8 border-4 border-[#222] p-3 bg-black shadow-[4px_4px_0_#333]">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 border-2 transition-none font-bold text-xl ${isMuted ? 'bg-[#FF00FF] text-black border-white' : 'bg-[#111] text-[#777] border-[#333] hover:border-[#00FFFF] hover:text-[#00FFFF]'}`}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : "VOL"}
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrev}
            className="text-white hover:text-black hover:bg-[#00FFFF] p-3 border-2 border-[#444] hover:border-[#00FFFF] bg-[#111]"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={handlePlayPause}
            className="w-20 h-16 bg-black border-4 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black flex items-center justify-center shadow-[6px_6px_0_#00FFFF] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:bg-white active:border-white transition-none"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="text-white hover:text-black hover:bg-[#FF00FF] p-3 border-2 border-[#444] hover:border-[#FF00FF] bg-[#111]"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
        
        <div className="w-[52px]"></div> {/* Spacer */}
      </div>
      
      {/* Tracklist aesthetic */}
      <div className="mt-2 border-4 border-[#222] p-3 bg-[#050505]">
        <span className="text-2xl text-[#FF00FF] font-mono uppercase mb-4 block bg-[#1a1a1a] px-3 py-1 w-max border-l-4 border-[#00FFFF] shadow-[2px_2px_0_#333]">
          &gt; SELECT_MODULE
        </span>
        <div className="flex flex-col space-y-2">
          {TRACKS.map((track, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between text-xl md:text-2xl font-mono p-2 cursor-pointer transition-none border-2
                ${idx === currentTrackIndex 
                  ? 'bg-[#00FFFF] text-black border-black shadow-[4px_4px_0_#FF00FF] -translate-y-1' 
                  : 'text-[#aaa] border-transparent hover:bg-[#FF00FF] hover:text-black hover:border-black'}`}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
            >
              <div className="flex items-center space-x-3 truncate">
                <span className={`font-bold ${idx === currentTrackIndex ? 'fast-flicker' : ''}`}>
                  {idx === currentTrackIndex && isPlaying ? '>' : `[0${idx+1}]`}
                </span>
                <span className="truncate">{track.title}</span>
              </div>
              <span className={`text-lg md:text-xl font-bold ${idx === currentTrackIndex ? 'text-[#FF00FF]' : 'text-[#666]'}`}>
                {track.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
