import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { soundGroups } from "../data/sounds";

const SoundsContext = createContext();

export const SoundsProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favouriteSounds");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  // Save favourites in localStorage
  useEffect(() => {
    localStorage.setItem("favouriteSounds", JSON.stringify(favourites));
  }, [favourites]);

  // Keep audio element in sync with current play state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  const playTrack = (list, index) => {
    setPlaylist(list);
    setCurrentIndex(index);
    setCurrentTrack(list[index]);
    setIsPlaying(true);

    setRecentlyPlayed((prev) => {
      const updated = [list[index], ...prev.filter(p => p.id !== list[index].id)];
      return updated.slice(0, 5);
    });
  };

  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.play().catch(() => {
      setIsPlaying(false);
    });
    setIsPlaying(true);
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const next = () => {
    const newIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(newIndex);
    setCurrentTrack(playlist[newIndex]);
  };

  const prev = () => {
    const newIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(newIndex);
    setCurrentTrack(playlist[newIndex]);
  };

  const shuffle = () => {
    const randomIndex = Math.floor(Math.random() * playlist.length);
    setCurrentIndex(randomIndex);
    setCurrentTrack(playlist[randomIndex]);
  };

  const toggleFavourite = (track) => {
    setFavourites((prev) => {
      if (prev.find(t => t.id === track.id)) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  return (
    <SoundsContext.Provider
      value={{
        audioRef,
        soundGroups,
        currentTrack,
        playlist,
        currentIndex,
        isPlaying,
        favourites,
        recentlyPlayed,
        playTrack,
        play,
        pause,
        next,
        prev,
        shuffle,
        toggleFavourite,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={currentTrack?.file}
        onEnded={next}
      />
    </SoundsContext.Provider>
  );
};

export const useSounds = () => useContext(SoundsContext);
