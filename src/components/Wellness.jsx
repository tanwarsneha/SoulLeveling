import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  Pause,
  Play,
} from "lucide-react";
import { useSounds } from "../context/SoundsContext";



const Wellness = () => {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    playTrack,
    play,
    pause,
    next,
    prev,
    recentlyPlayed,
  } = useSounds();

  const cards = [
    {
      title: "Meditation",
      desc: "Guided sessions & Body scans",
      icon: "fa-spa",
      color: "text-blue-400",
      bg: "bg-blue-500/20",
      action: "Resume Session",
      hasAction: true,
      route: "/meditation",
    },
    {
      title: "Sounds",
      desc: "Rain, Ocean & White Noise",
      icon: "fa-music",
      color: "text-green-400",
      bg: "bg-green-500/20",
      hasAction: true,
      action: "Open Sounds",
      route: "/sounds",
    },
    {
      title: "Relax Games",
      desc: "Color therapy & Puzzles",
      icon: "fa-gamepad",
      color: "text-purple-400",
      bg: "bg-purple-500/20",
      badge: "New: Bubble Pop",
      hasAction: true,          // Changed to true
      action: "Open Games",     // Added action text
      route: "/relax-games",
    },
  ];

  const ensureTrack = (action) => {
    if (!currentTrack) {
      if (recentlyPlayed.length > 0) {
        playTrack(recentlyPlayed, 0);
      } else {
        navigate("/sounds");
      }
      return;
    }
    action();
  };

// ... (keep all your existing functions and arrays above this line)

  return (
    <div className="space-y-8"> {/* Added this wrapper to space things out */}
      
      {/* YOUR EXISTING 3 CARDS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const isSounds = card.title === "Sounds";

          return (
            <div
              key={index}
              onClick={() => card.route && navigate(card.route)}
              className="glass-card p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition cursor-pointer group"
            >
              <div
                className={`w-12 h-12 rounded-full ${card.bg} ${card.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition`}
              >
                {isSounds ? <Headphones size={22} /> : <i className={`fa-solid ${card.icon}`}></i>}
              </div>

              <h3 className="font-bold text-lg mb-1">{card.title}</h3>
              <p className="text-xs text-gray-400">{card.desc}</p>

              {isSounds && (
                <div className="mt-4 space-y-2" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => ensureTrack(prev)}
                      className="!h-8 !w-10 !min-w-0 !px-0 !py-0 !rounded-full !bg-yellow-400 !text-black !shadow-none hover:!brightness-110 transition-all flex items-center justify-center"
                      title="Previous"
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() =>
                        ensureTrack(() => {
                          if (isPlaying) pause();
                          else play();
                        })
                      }
                      className="!h-8 !w-10 !min-w-0 !px-0 !py-0 !rounded-full !bg-yellow-400 !text-black !shadow-none hover:!brightness-110 transition-all flex items-center justify-center"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={14} strokeWidth={2.5} /> : <Play size={14} strokeWidth={2.5} />}
                    </button>
                    <button
                      onClick={() => ensureTrack(next)}
                      className="!h-8 !w-10 !min-w-0 !px-0 !py-0 !rounded-full !bg-yellow-400 !text-black !shadow-none hover:!brightness-110 transition-all flex items-center justify-center"
                      title="Next"
                    >
                      <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1.5">
                      Recently Played
                    </p>
                    {recentlyPlayed.length === 0 ? (
                      <p className="text-xs text-white/50">No tracks yet</p>
                    ) : (
                      <div className="space-y-1">
                        {recentlyPlayed.slice(0, 2).map((track, i) => (
                          <button
                            key={track.id}
                            onClick={() => playTrack(recentlyPlayed, i)}
                            className="w-full text-left text-xs px-3 py-2 rounded-full !bg-yellow-400 !text-black !shadow-none hover:!brightness-110 transition"
                          >
                            {track.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {card.hasAction && !isSounds && (
                <div className="mt-4 flex items-center text-xs text-brand-teal">
                  <i className="fa-solid fa-play mr-2"></i> {card.action}
                </div>
              )}

              {card.badge && (
                <span className="mt-2 inline-block px-2 py-1 bg-brand-accent/20 text-brand-accent text-[10px] rounded">
                  {card.badge}
                </span>
              )}
            </div>
          );
        })}
      </section>



    </div>
  );
};

export default Wellness;
