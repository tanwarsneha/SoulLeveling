import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shuffle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useAffirmations } from '../../context/AffirmationsContext';
import { affirmationGroups } from '../../data/affirmations';

const DailyAffirmations = () => {
  const navigate = useNavigate();
  const { getDashboardPlaylist } = useAffirmations();
  
  const [activeQuotes, setActiveQuotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const playlist = getDashboardPlaylist();
    setActiveQuotes(playlist);
    // Reset index if out of bounds to prevent crash
    if (currentIndex >= playlist.length) setCurrentIndex(0);
  }, [getDashboardPlaylist]); // Removed currentIndex dependency to avoid loop

  const handleNext = (e) => {
    e.stopPropagation();
    if (activeQuotes.length > 0)
      setCurrentIndex((prev) => (prev + 1) % activeQuotes.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (activeQuotes.length > 0)
      setCurrentIndex((prev) => (prev - 1 + activeQuotes.length) % activeQuotes.length);
  };

  const handleRandom = (e) => {
    e.stopPropagation();
    if (activeQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * activeQuotes.length);
      setCurrentIndex(randomIndex);
    }
  };

  const handleCardClick = () => {
    const currentQuote = activeQuotes[currentIndex];
    if (!currentQuote) return;

    let foundGroup = null;
    let foundIndex = 0;

    // Robust Search: Find which group this quote text belongs to
    for (const [key, group] of Object.entries(affirmationGroups)) {
      const index = group.quotes.findIndex(q => q.text === currentQuote.text);
      if (index !== -1) {
        foundGroup = key;
        foundIndex = index;
        break;
      }
    }

    if (foundGroup) {
      navigate('/affirmations', { state: { group: foundGroup, quoteIndex: foundIndex } });
    } else {
      // Fallback: Just go to library if we somehow can't find the source
      navigate('/affirmations');
    }
  };

  // Prevent render if no quotes available
  if (!activeQuotes || activeQuotes.length === 0) return null;
  const quote = activeQuotes[currentIndex];

  return (
    <div className="relative w-full mb-8 group">
      <div className="flex justify-between items-end mb-3 px-1">
        <Link to="/affirmations" className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 hover:text-yellow-400 transition-colors flex items-center gap-2">
          ✨ Daily Affirmations
        </Link>
        <span className="text-[9px] opacity-40 uppercase tracking-widest">
           {activeQuotes.length} Quotes in Rotation
        </span>
      </div>

      <div 
        onClick={handleCardClick}
        className="relative bg-[var(--card-glass)] backdrop-blur-md border border-[var(--card-border)] rounded-2xl p-8 min-h-[160px] flex flex-col items-center justify-center text-center hover:border-yellow-500/30 transition-all duration-300 shadow-lg overflow-hidden cursor-pointer"
      >
        <button 
          onClick={handleRandom}
          className="absolute top-4 right-4 p-2 rounded-full opacity-50 hover:opacity-100 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all z-20"
        >
          <Shuffle size={16} />
        </button>

        <Quote size={40} className="text-yellow-500/5 absolute top-4 left-6 -scale-x-100 pointer-events-none" />

        <div className="max-w-2xl px-6 relative z-10">
           {/* Safe access to quote text */}
           <h3 
             onClick={(e) => e.stopPropagation()}
             className="text-xl md:text-2xl font-medium leading-relaxed mb-4 transition-all duration-500 cursor-text selection:bg-yellow-500/30"
           >
             "{quote?.text}"
           </h3>
           
           <div 
             onClick={(e) => e.stopPropagation()}
             className="flex items-center justify-center gap-3 opacity-60 cursor-text selection:bg-yellow-500/30"
           >
             <span className="h-[1px] w-6 bg-yellow-500/50"></span>
             <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">
               {quote?.author}
             </p>
             <span className="h-[1px] w-6 bg-yellow-500/50"></span>
           </div>
        </div>

        <button 
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-[var(--card-hover)] hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-[var(--card-hover)] hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default DailyAffirmations;