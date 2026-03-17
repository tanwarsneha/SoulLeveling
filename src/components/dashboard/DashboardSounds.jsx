import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Music,
  Pause,
  Play,
  Shuffle,
} from "lucide-react";
import { useSounds } from "../../context/SoundsContext";

const DashboardSounds = () => {
  const navigate = useNavigate();
  const {
    audioRef,
    currentTrack,
    isPlaying,
    playTrack,
    play,
    pause,
    next,
    prev,
    shuffle,
    recentlyPlayed,
  } = useSounds();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const syncTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    syncTime();
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncTime);
    audio.addEventListener("durationchange", syncTime);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncTime);
      audio.removeEventListener("durationchange", syncTime);
    };
  }, [audioRef, currentTrack]);

  const handlePlayPause = (event) => {
    event.stopPropagation();

    if (!currentTrack && recentlyPlayed.length > 0) {
      playTrack(recentlyPlayed, 0);
      return;
    }

    if (!currentTrack) {
      navigate("/sounds");
      return;
    }

    if (isPlaying) pause();
    else play();
  };

  const handleSeek = (event) => {
    event.stopPropagation();
    const audio = audioRef?.current;
    if (!audio) return;
    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const formatTime = (seconds) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full mb-8">
      <div className="flex justify-between items-end mb-3 px-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 flex items-center gap-2">
          <Music size={12} />
          Sounds
        </span>

        <span className="text-[9px] opacity-40 uppercase tracking-widest">
          {recentlyPlayed.length} Recently Played
        </span>
      </div>

      <div
        onClick={() => navigate("/sounds")}
        className="relative bg-[var(--card-glass)] backdrop-blur-md border border-[var(--card-border)] rounded-2xl p-6 min-h-[220px] hover:border-yellow-500/40 transition-all duration-300 shadow-lg overflow-hidden cursor-pointer group"
      >
        <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
        <Music
          size={70}
          className="text-yellow-500/10 absolute top-4 right-5 pointer-events-none"
        />

        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1">Sounds</h3>
          <p className="text-xs opacity-60 mb-5">Rain, Ocean & White Noise</p>

          <div
            onClick={(event) => event.stopPropagation()}
            className="flex items-center gap-2 mb-4"
          >
            <button
              onClick={prev}
              className="p-2 rounded-full border border-[var(--card-border)] bg-black/15 hover:bg-[var(--card-hover)] hover:scale-105 transition-all"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={handlePlayPause}
              className="p-2.5 rounded-full border border-yellow-500/50 bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/30 hover:scale-105 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              onClick={next}
              className="p-2 rounded-full border border-[var(--card-border)] bg-black/15 hover:bg-[var(--card-hover)] hover:scale-105 transition-all"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={shuffle}
              className="p-2 rounded-full border border-[var(--card-border)] bg-black/15 hover:bg-[var(--card-hover)] hover:scale-105 transition-all"
              title="Shuffle"
            >
              <Shuffle size={14} />
            </button>
          </div>

          <div
            onClick={(event) => event.stopPropagation()}
            className="mb-4"
          >
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-yellow-400"
              aria-label="Seek audio"
            />
            <div className="mt-1 flex items-center justify-between text-[10px] opacity-50">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <p className="text-sm font-medium mb-3 truncate">
            {currentTrack ? currentTrack.title : "No sound playing"}
          </p>

          <div className="rounded-xl border border-[var(--card-border)] bg-black/10 p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60 mb-2">
              <Clock3 size={12} />
              Recently Played
            </div>

            {recentlyPlayed.length === 0 ? (
              <p className="text-xs opacity-50">No tracks yet</p>
            ) : (
              <div className="space-y-2">
                {recentlyPlayed.slice(0, 3).map((track, index) => (
                  <button
                    key={track.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      playTrack(recentlyPlayed, index);
                    }}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg border border-transparent hover:border-yellow-500/40 hover:bg-yellow-500/10 transition-all"
                  >
                    {track.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSounds;
