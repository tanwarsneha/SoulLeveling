import React from 'react';

const Sidebar = () => {
  return (
    <div className="space-y-8">
      
      {/* STREAK CARD */}
      <div className="glass-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl group-hover:scale-110 transition-transform duration-500">
          🏆
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold tracking-wide uppercase text-sm opacity-70">Current Streak</h3>
            <span className="text-xl">🔥</span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold text-[var(--text-accent)]">5 Days</span>
          </div>

          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[var(--text-accent)] w-[75%] shadow-[0_0_10px_var(--text-accent)]"></div>
          </div>
          <p className="text-sm opacity-70">75% to your next badge: <strong>Zen Master</strong></p>
        </div>
      </div>

      {/* FRIEND ACTIVITY CARD */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-purple-400">👥</span>
          <h3 className="font-bold text-lg">Friend Mode</h3>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-[2px]">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" 
              alt="Friend" 
              className="w-full h-full rounded-full bg-black"
            />
          </div>
          <div>
            <p className="font-bold text-sm">Sarah M.</p>
            <p className="text-xs opacity-70">Completed a breathing challenge</p>
          </div>
        </div>

        <button className="w-full py-2 rounded-lg border border-[var(--text-accent)] text-[var(--text-primary)] hover:bg-[var(--text-accent)] hover:text-black transition-colors text-sm font-semibold">
          Send a Positive Note
        </button>
      </div>

      {/* HELP RESOURCES CARD */}
      <div className="glass-card p-6 border-l-4 border-red-400">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-400 animate-pulse">⚙️</span>
          <h3 className="font-bold text-lg">Need Help?</h3>
        </div>
        <p className="text-sm opacity-70 mb-4">
          Professional help is available 24/7 if you are feeling overwhelmed.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all text-sm font-semibold">
            Helpline
          </button>
          <button className="py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-sm font-semibold">
            Resources
          </button>
        </div>
      </div>

      {/* PREFERENCES (Mini Settings) */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-lg mb-4">Preferences</h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm opacity-80">Daily Reminder</span>
          <div className="w-10 h-5 bg-[var(--text-accent)] rounded-full relative cursor-pointer">
            <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm opacity-80">Focus Music</span>
          <span className="text-xs bg-black/20 px-2 py-1 rounded text-[var(--text-accent)]">Lo-Fi</span>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;