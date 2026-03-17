import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, Lock, Gamepad2 } from 'lucide-react';

const RelaxGames = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-6 relative z-10 min-h-screen">
      
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gamepad2 className="text-purple-400" size={28} />
            Relax Games
          </h1>
          <p className="text-white/60 text-sm mt-1">Unwind with soothing, low-stakes activities.</p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Game 1: Bubble Pop (Active) */}
        <div 
          onClick={() => navigate('/relax-games/bubble-pop')}
          className="glass-card p-6 border border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Sparkles size={28} />
          </div>
          <h3 className="text-xl font-bold mb-2">Zen Bubble Pop</h3>
          <p className="text-sm text-white/60 mb-6">
            Pop floating pastel colors. Breathe in. Let go. No timers, no stress.
          </p>
          <div className="text-purple-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
            Play Now <ChevronLeft className="rotate-180" size={16} />
          </div>
        </div>

        {/* Game 2: Coming Soon (Disabled) */}
        <div className="glass-card p-6 border border-white/5 rounded-3xl bg-black/20 opacity-70 cursor-not-allowed">
          <div className="w-14 h-14 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center mb-6">
            <Lock size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white/60">Color Flow</h3>
          <p className="text-sm text-white/40 mb-6">
            A mesmerizing puzzle to connect flowing colors. Currently in development.
          </p>
          <div className="text-white/30 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
            Coming Soon
          </div>
        </div>

      </div>
    </div>
  );
};

export default RelaxGames;