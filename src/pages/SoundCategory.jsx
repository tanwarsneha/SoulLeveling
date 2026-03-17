import React from "react";
import { useParams } from "react-router-dom";
import { useSounds } from "../context/SoundsContext";
import { ChevronLeft, ChevronRight, Shuffle, Heart } from "lucide-react";

const SoundCategory = () => {
  const { category } = useParams();

  const {
    soundGroups,
    favourites,
    recentlyPlayed,
    playTrack,
    currentTrack,
    isPlaying,
    play,
    pause,
    next,
    prev,
    shuffle,
    toggleFavourite,
  } = useSounds();

  const group =
    category === "favourites"
      ? { title: "Favourites", sounds: favourites }
      : soundGroups[category];

  if (!group) return <div className="p-8">No sounds found</div>;

  return (
    <div className="p-8 space-y-8">

      <h1 className="text-2xl font-bold text-yellow-500">
        {group.title}
      </h1>

      {/* Controls */}
      <div className="flex gap-4">
        <button onClick={prev}>⏮</button>

        {!isPlaying ? (
          <button onClick={play}>▶</button>
        ) : (
          <button onClick={pause}>⏸</button>
        )}

        <button onClick={next}>⏭</button>
        <button onClick={shuffle}>
          <Shuffle size={18} />
        </button>
      </div>

      {/* Playlist */}
      <div className="space-y-3">
        {group.sounds.map((sound, index) => (
          <div
            key={sound.id}
            className="flex justify-between items-center 
                       bg-[var(--card-glass)] 
                       border border-[var(--card-border)] 
                       rounded-xl p-4 hover:border-yellow-500/40 
                       transition-all duration-300 cursor-pointer"
            onClick={() => playTrack(group.sounds, index)}
          >
            <span>
              {sound.title}
              {currentTrack?.id === sound.id && (
                <span className="ml-2 text-yellow-400">
                  {isPlaying ? "🎵" : "⏸"}
                </span>
              )}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavourite(sound);
              }}
              className={`${
                favourites.find((f) => f.id === sound.id)
                  ? "text-yellow-400"
                  : "opacity-50"
              }`}
            >
              <Heart size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mt-8 mb-3 text-yellow-400">
            Recently Played
          </h2>

          <div className="space-y-2">
            {recentlyPlayed.map((track) => (
              <div
                key={track.id}
                className="text-sm opacity-70"
              >
                {track.title}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default SoundCategory;