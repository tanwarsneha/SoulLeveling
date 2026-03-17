import React, { useState, useEffect } from 'react';
import DailyAffirmations from './dashboard/DailyAffirmations'; 
import { useMood } from '../context/MoodContext';

const Hero = () => {
  const { addMood } = useMood();
  const [selectMood, setSelectMood] = useState(null);
  const [displayName, setDisplayName] = useState('sj'); // Default fallback based on your preference

  // --- FETCH LOCAL PROFILE NAME ---
  useEffect(() => {
    const fetchLocalName = () => {
      const storedUser = localStorage.getItem('soul_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.display_name) {
            setDisplayName(parsedUser.display_name);
          }
        } catch (err) {
          console.error("Error reading local user:", err);
        }
      }
    };

    fetchLocalName();
  }, []);

  const handleMoodClick = (label, value) => {
    setSelectMood(label);
    addMood(value,label);
  };

  return (
    // 1. WE USE "glass-card" CLASS HERE. 
    // This automatically handles the background color, border, and blur for BOTH modes.
    <div className="glass-card p-8 rounded-3xl w-full">
      
      {/* HEADER SECTION */}
      <div className="mb-8">
        {/* Dynamic Name Replacement */}
        <h1 className="text-4xl font-bold mb-2">
          Hello, {displayName} <span className="animate-wave inline-block origin-bottom-right">👋</span>
        </h1>
        <p className="text-lg opacity-80">
          Ready to nurture your mind today?
        </p>
      </div>

      {/* AFFIRMATIONS WIDGET */}
      <DailyAffirmations />

      {/* MOOD TRACKER SECTION */}
      <div>
        <p className="mb-4 text-sm font-semibold tracking-wide uppercase opacity-70">
          HOW ARE YOU FEELING RIGHT NOW?
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {/* Mood Buttons */}
          <MoodButton 
            emoji="🤩" 
            label="Great"
            value={5}
            selectMood = {selectMood}
            onClick={handleMoodClick}
          />
          <MoodButton 
            emoji="🙂" 
            label="Good" 
            value={4}
            selectMood = {selectMood}
            onClick = {handleMoodClick}
          />
          <MoodButton 
            emoji="😐"
            label="Okay"
            value = {3}
            selectMood = {selectMood}
            onClick = {handleMoodClick}
          />
          <MoodButton emoji="😔" 
            label="Low" 
            value={2}
            selectMood = {selectMood}
            onClick = {handleMoodClick}
          />
          <MoodButton 
            emoji="😰" 
            label="Anxious"
            value = {1}
            selectMood = {selectMood}
            onClick = {handleMoodClick}
          />
        </div>
      </div>

    </div>
  );
};

// ... Your commented out MoodButton code history remains here ...

const MoodButton = ({ emoji, label, value, selectMood, onClick }) => {
  const isSelected = selectMood === label;

  return (
    <button
      onClick={() => onClick(label, value)}
      className={`
        flex flex-col items-center justify-center p-4 rounded-xl
        transition-all duration-300
        ${
          isSelected
            ? `
              bg-yellow-400 
              text-black 
              border-4 border-yellow-300
              shadow-[0_0_35px_rgba(250,204,21,0.9)]
              scale-105
            `
            : `
              bg-[var(--card-glass)] 
              text-white/80 
              border border-[var(--card-border)]
              hover:bg-[var(--card-hover)]
            `
        }
      `}
    >
      <span
        className={`text-3xl mb-2 transition-transform ${
          isSelected ? "scale-110" : ""
        }`}
      >
        {emoji}
      </span>
      <span
        className={`text-sm font-semibold ${
          isSelected ? "text-black" : ""
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default Hero;