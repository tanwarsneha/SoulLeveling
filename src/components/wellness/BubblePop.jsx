import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, Sparkles, ChevronLeft } from 'lucide-react';

// Soft, therapeutic pastel colors
const THERAPY_COLORS = [
  '#C4B5FD', // Lavender (Calming)
  '#A7F3D0', // Mint (Refreshing)
  '#FDBA74', // Peach (Warmth)
  '#93C5FD', // Soft Blue (Peace)
  '#F9A8D4', // Rose (Comfort)
];

const BubblePop = () => {
  const [bubbles, setBubbles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [poppedCount, setPoppedCount] = useState(0);
  const navigate = useNavigate();

  // Function to generate a random bubble
  const createBubble = useCallback(() => {
    const id = Math.random().toString(36).substr(2, 9);
    const size = Math.floor(Math.random() * 40) + 40; // 40px to 80px
    const left = Math.floor(Math.random() * 80) + 10; // 10% to 90% across screen
    const color = THERAPY_COLORS[Math.floor(Math.random() * THERAPY_COLORS.length)];
    const duration = Math.floor(Math.random() * 4) + 5; // 5s to 9s float time

    return { id, size, left, color, duration };
  }, []);

  // Bubble Spawner
  useEffect(() => {
    if (!isPlaying) return;

    // Spawn a new bubble every 800ms
    const interval = setInterval(() => {
      const newBubble = createBubble();
      setBubbles((prev) => [...prev, newBubble]);

      // Auto-remove bubble after it floats off screen to prevent lag
      setTimeout(() => {
        setBubbles((current) => current.filter((b) => b.id !== newBubble.id));
      }, newBubble.duration * 1000);
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, createBubble]);

  const handlePop = (id) => {
    // Remove the popped bubble
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setPoppedCount((prev) => prev + 1);
  };

  const startGame = () => {
    setIsPlaying(true);
    setPoppedCount(0);
    setBubbles([]);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setBubbles([]);
  };

  return (
    <div className="pt-24 pb-12 max-w-4xl mx-auto px-6 relative z-10 min-h-screen">
      
      {/* NEW BACK BUTTON */}
      <button 
        onClick={() => navigate('/relax-games')}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white uppercase tracking-wider transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <ChevronLeft size={16} />
        </div>
        Back to Games
      </button>

      <div className="glass-card p-8 rounded-3xl w-full flex flex-col items-center relative overflow-hidden">
        
        {/* We use an inline style tag here for the custom float animation so you don't have to edit tailwind config */}
        <style>
          {`
            @keyframes floatUp {
              0% { transform: translateY(100px) scale(0.8); opacity: 0; }
              10% { opacity: 0.8; }
              90% { opacity: 0.8; }
              100% { transform: translateY(-500px) scale(1.1); opacity: 0; }
            }
            .animate-float {
              animation-name: floatUp;
              animation-timing-function: linear;
              animation-fill-mode: forwards;
            }
          `}
        </style>

        {/* Header Section */}
        <div className="text-center mb-6 z-10">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400" size={24} />
            Zen Bubble Pop
          </h2>
          <p className="text-white/60 text-sm">
            Pop the colors. Breathe in. Let go.
          </p>
        </div>

        {/* Game Container */}
        <div className="relative w-full max-w-md h-80 bg-black/20 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-inner mb-6 flex items-center justify-center">
          
          {!isPlaying ? (
            <button 
              onClick={startGame}
              className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold tracking-wider uppercase border border-white/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Play size={18} /> Begin Session
            </button>
          ) : (
            <>
              {/* The Bubbles */}
              {bubbles.map((bubble) => (
                <button
                  key={bubble.id}
                  onClick={() => handlePop(bubble.id)}
                  className="absolute rounded-full backdrop-blur-md cursor-pointer transition-transform hover:scale-110 active:scale-0 animate-float"
                  style={{
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    left: `${bubble.left}%`,
                    bottom: '-50px',
                    backgroundColor: `${bubble.color}40`, // 40 hex opacity
                    border: `1px solid ${bubble.color}`,
                    boxShadow: `0 0 15px ${bubble.color}60, inset 0 0 10px ${bubble.color}40`,
                    animationDuration: `${bubble.duration}s`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer / Controls */}
        <div className="flex items-center justify-between w-full max-w-md px-4 z-10">
          <div className="text-sm font-bold text-white/50 uppercase tracking-wider">
            Popped: <span className="text-yellow-400 text-lg">{poppedCount}</span>
          </div>
          
          {isPlaying && (
            <button 
              onClick={stopGame}
              className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              title="End Session"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default BubblePop;