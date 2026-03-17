import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  Heart,
  Pause,
  Play,
  Radio,
  Shuffle,
  Volume2,
  Waves,
  X,
} from "lucide-react";
import { useSounds } from "../context/SoundsContext";

const Sounds = () => {
  const navigate = useNavigate();
  const {
    audioRef,
    soundGroups,
    favourites,
    playTrack,
    currentTrack,
    playlist,
    isPlaying,
    play,
    pause,
    next,
    prev,
    shuffle,
    toggleFavourite,
  } = useSounds();

  const [activeCategory, setActiveCategory] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const categoryIcons = {
    rain: CloudRain,
    ocean: Waves,
    white: Radio,
    favourites: Heart,
  };

  const activeGroup =
    activeCategory === "favourites"
      ? { title: "Favourites", sounds: favourites }
      : activeCategory
      ? soundGroups[activeCategory]
      : null;
  const activeSounds = activeGroup?.sounds || [];

  useEffect(() => {
    if (!activeCategory || activeSounds.length === 0) return;
    const isTrackInActiveGroup = activeSounds.some(
      (sound) => sound.id === currentTrack?.id
    );
    if (!isTrackInActiveGroup) {
      playTrack(activeSounds, 0);
    }
  }, [activeCategory, activeSounds, currentTrack, playTrack]);

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

  const currentSoundIndex = useMemo(() => {
    if (!currentTrack) return -1;
    return activeSounds.findIndex((sound) => sound.id === currentTrack.id);
  }, [activeSounds, currentTrack]);

  const isCurrentFavourite =
    !!currentTrack && favourites.some((item) => item.id === currentTrack.id);

  const ensureActivePlaylistThen = (action) => {
    if (!activeSounds.length) return;

    const isPlaylistActive =
      playlist.length === activeSounds.length &&
      playlist.every((track, index) => track.id === activeSounds[index].id);

    if (!isPlaylistActive) {
      const safeIndex = currentSoundIndex >= 0 ? currentSoundIndex : 0;
      playTrack(activeSounds, safeIndex);
      return;
    }

    action();
  };

  const handleSeek = (event) => {
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
    <div className="min-h-screen bg-[var(--bg-core)] text-[var(--text-primary)] px-6 pb-6 pt-28 md:px-10 md:pb-10 md:pt-32 relative overflow-hidden transition-colors duration-500">
      <div className="relative z-10 max-w-6xl mx-auto flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity text-sm font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </button>

        {activeCategory && currentTrack && (
          <button
            onClick={() => toggleFavourite(currentTrack)}
            className={`!h-10 !w-10 !min-w-0 !p-0 rounded-full border transition-all flex items-center justify-center !shadow-none ${
              isCurrentFavourite
                ? "!bg-yellow-400 !border-yellow-400 !text-black"
                : "border-[var(--card-border)] !bg-transparent text-[var(--text-primary)] hover:bg-[var(--card-hover)]"
            }`}
          >
            <Heart
              size={18}
              strokeWidth={2.4}
              fill={isCurrentFavourite ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>

      {!activeCategory ? (
        <div className="relative z-10 max-w-6xl mx-auto animate-fade-in-up">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Sound Library
            </h1>
            <p className="text-xl opacity-60 font-light">
              Choose your ambient focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              onClick={() => favourites.length > 0 && setActiveCategory("favourites")}
              className={`group relative h-64 rounded-3xl bg-[var(--card-glass)] border p-8 transition-all duration-300 overflow-hidden ${
                favourites.length > 0
                  ? "cursor-pointer hover:-translate-y-2 hover:border-yellow-500/50 border-[var(--card-border)]"
                  : "opacity-50 cursor-not-allowed border-[var(--card-border)]"
              }`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Heart size={120} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <h3 className="text-3xl font-bold mb-2 text-pink-400">Favourites</h3>
                <p className="text-sm font-mono opacity-60 uppercase tracking-widest">
                  {favourites.length} Sounds
                </p>
              </div>
            </div>

            {Object.entries(soundGroups).map(([key, group]) => (
              <div
                key={key}
                onClick={() => setActiveCategory(key)}
                className="group relative h-64 rounded-3xl bg-[var(--card-glass)] border border-[var(--card-border)] p-8 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2 hover:border-yellow-500/50"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  {React.createElement(categoryIcons[key] || Volume2, {
                    size: 120,
                  })}
                </div>
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <h3 className="text-3xl font-bold mb-2">{group.title}</h3>
                  <p className="text-sm font-mono opacity-60 uppercase tracking-widest">
                    {group.sounds.length} Sounds
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in relative z-20">
          <div className="absolute top-0 right-0 flex gap-4">
            <button
              onClick={() => setActiveCategory(null)}
              className="p-3 rounded-full border border-[var(--card-border)] hover:bg-[var(--card-hover)]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative w-full max-w-4xl py-8 px-4 text-center">
            {React.createElement(categoryIcons[activeCategory] || Volume2, {
              size: 80,
              className: "opacity-10 absolute top-0 left-0",
            })}
            <h2 className="text-3xl md:text-5xl md:leading-tight font-medium mb-4">
              {currentTrack?.title || `${activeGroup?.title} Ambience`}
            </h2>
            <div className="inline-block px-8 py-3 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
              {activeGroup?.title}
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 mt-6">
            <button
              onClick={() => ensureActivePlaylistThen(shuffle)}
              className="p-3 rounded-full border border-[var(--card-border)] hover:bg-[var(--card-hover)] transition-all"
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={() => ensureActivePlaylistThen(prev)}
              className="p-4 rounded-full border border-[var(--card-border)] hover:bg-[var(--card-hover)] transition-all hover:scale-110"
            >
              <ChevronLeft size={26} />
            </button>

            <button
              onClick={() => ensureActivePlaylistThen(isPlaying ? pause : play)}
              className="px-7 py-3 rounded-full bg-yellow-500 text-black font-bold tracking-wider uppercase text-xs hover:brightness-110 transition-all"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={() => ensureActivePlaylistThen(next)}
              className="p-4 rounded-full border border-[var(--card-border)] hover:bg-[var(--card-hover)] transition-all hover:scale-110"
            >
              <ChevronRight size={26} />
            </button>
          </div>

          <div className="w-full max-w-3xl mt-7">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-yellow-400"
              aria-label="Seek audio"
            />
            <div className="mt-2 flex items-center justify-between text-xs opacity-55">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="w-full max-w-3xl mt-10 space-y-3">
            {activeSounds.length === 0 ? (
              <div className="rounded-xl p-6 border border-[var(--card-border)] bg-[var(--card-glass)] text-center opacity-60">
                No favourite sounds yet.
              </div>
            ) : (
              activeSounds.map((sound, index) => {
                const isCurrent = currentTrack?.id === sound.id;
                const isFav = favourites.some((item) => item.id === sound.id);

                return (
                  <div
                    key={sound.id}
                    onClick={() => playTrack(activeSounds, index)}
                    className={`flex justify-between items-center rounded-xl p-4 border transition-all duration-300 cursor-pointer ${
                      isCurrent
                        ? "border-yellow-500/50 bg-yellow-500/10"
                        : "border-[var(--card-border)] bg-[var(--card-glass)] hover:border-yellow-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs opacity-50 w-6 text-left">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{sound.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">
                          {isPlaying ? "Playing" : "Paused"}
                        </span>
                      )}
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavourite(sound);
                      }}
                      className={`!h-10 !w-10 !min-w-0 !p-0 rounded-full !shadow-none border flex items-center justify-center transition-all ${
                        isFav
                          ? "!bg-yellow-400 !border-yellow-400 !text-black"
                          : "border-[var(--card-border)] !bg-transparent text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:bg-[var(--card-hover)]"
                      }`}
                    >
                      <Heart size={18} strokeWidth={2.4} fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sounds;
