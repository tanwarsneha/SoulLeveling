import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Sun, Heart, ChevronDown, ChevronUp, 
  ChevronLeft, ChevronRight, 
  Quote, X, Copy, Share2, Check, Settings, Star, Save, RotateCcw
} from 'lucide-react';
import { affirmationGroups } from '../data/affirmations';
import { useAffirmations } from '../context/AffirmationsContext';

const Affirmations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    favorites = [], 
    toggleFavorite, 
    config, overrideConfig 
  } = useAffirmations();

  // STATES
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
  // CONFIG MODE STATES
  const [isConfigMode, setIsConfigMode] = useState(false);
  const [draftConfig, setDraftConfig] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  // CHECK FOR DEEP LINKS
  useEffect(() => {
    if (location.state) {
      const { group, quoteIndex } = location.state;
      if (group && affirmationGroups[group]) {
        setActiveCategory(group);
        setCurrentQuoteIndex(quoteIndex || 0);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // CONFIG LOGIC
  const startConfigMode = () => {
    setDraftConfig(JSON.parse(JSON.stringify(config)));
    setIsConfigMode(true);
  };

  const cancelConfigMode = () => {
    setDraftConfig(null);
    setIsConfigMode(false);
  };

  const saveConfigChanges = () => {
    if (draftConfig) overrideConfig(draftConfig);
    setIsConfigMode(false);
    setDraftConfig(null);
  };

  const toggleLocalGroup = (groupId) => {
    setDraftConfig(prev => ({
      ...prev,
      [groupId]: { ...prev[groupId], enabled: !prev[groupId]?.enabled }
    }));
  };

  const toggleLocalQuote = (groupId, quoteText) => {
    setDraftConfig(prev => {
      const groupConfig = prev[groupId];
      const isExcluded = groupConfig.excludedQuotes.includes(quoteText);
      return {
        ...prev,
        [groupId]: {
          ...groupConfig,
          excludedQuotes: isExcluded
            ? groupConfig.excludedQuotes.filter(t => t !== quoteText)
            : [...groupConfig.excludedQuotes, quoteText]
        }
      };
    });
  };

  // DATA HELPERS
  const favoritesGroup = {
    id: 'favorites',
    label: 'My Favorites',
    quotes: (favorites || []).map(favText => {
      for (const group of Object.values(affirmationGroups)) {
        const found = group.quotes.find(q => q.text === favText);
        if (found) return found;
      }
      return null;
    }).filter(Boolean)
  };

  const getActiveQuotes = () => {
    if (activeCategory === 'favorites') return favoritesGroup.quotes;
    if (activeCategory && affirmationGroups[activeCategory]) {
      return affirmationGroups[activeCategory].quotes;
    }
    return [];
  };

  // NAV HANDLERS
  const handleNext = () => {
    const quotes = getActiveQuotes();
    if (quotes.length) setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrev = () => {
    const quotes = getActiveQuotes();
    if (quotes.length) setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  // COPY FUNCTION
  const copyToClipboard = () => {
    const quotes = getActiveQuotes();
    const quote = quotes[currentQuoteIndex];
    if (quote) {
      navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    }
  };

  // SHARE FUNCTION
  const shareQuote = () => {
    const quotes = getActiveQuotes();
    const quote = quotes[currentQuoteIndex];
    if (quote && navigator.share) {
      navigator.share({
        title: 'Soul Leveling Affirmation',
        text: `"${quote.text}" - ${quote.author}`,
      }).catch(console.error);
    } else {
      copyToClipboard(); 
    }
  };

  const isFavorite = () => {
    const quotes = getActiveQuotes();
    if (!quotes.length || !quotes[currentQuoteIndex]) return false;
    return favorites.includes(quotes[currentQuoteIndex].text);
  };

  // RENDER VARS
  const activeQuotesList = getActiveQuotes();
  const currentQuote = activeQuotesList[currentQuoteIndex];

  return (
    <div className="min-h-screen bg-[var(--bg-core)] text-[var(--text-primary)] px-6 pb-6 pt-28 md:px-10 md:pb-10 md:pt-32 relative overflow-hidden transition-colors duration-500">
      
      {/* HEADER */}
      <div className="relative z-10 max-w-6xl mx-auto flex justify-between items-center mb-8">
        
        {/* LEFT SIDE: Actions + Back Button */}
        <div className="flex items-center gap-4">
          
          {/* 1. BACK BUTTON (Now First) */}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Dashboard</span> <span className="sm:hidden">Back</span>
          </button>

          {/* 2. COPY & SHARE (Now Second - on the Right) */}
          {activeCategory && (
            <div className="flex items-center gap-2 animate-fade-in">
               {/* Vertical Divider (Moved to start) */}
               <div className="h-6 w-px bg-[var(--card-border)] mx-1"></div>

               <button 
                  onClick={copyToClipboard}
                  className="p-2 rounded-full border border-[var(--card-border)] bg-[var(--card-glass)] hover:bg-[var(--card-hover)] transition-all text-[var(--text-primary)]"
                  title="Copy Quote"
               >
                  {showCopyFeedback ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
               </button>
               <button 
                  onClick={shareQuote}
                  className="p-2 rounded-full border border-[var(--card-border)] bg-[var(--card-glass)] hover:bg-[var(--card-hover)] transition-all text-[var(--text-primary)]"
                  title="Share Quote"
               >
                  <Share2 size={18} />
               </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Config Buttons (Only in Library Mode) */}
        {!activeCategory && (
          <div className="flex gap-3">
             {isConfigMode ? (
               <>
                 <button onClick={cancelConfigMode} className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors">
                   <RotateCcw size={16} /> <span className="text-xs font-bold uppercase hidden sm:inline">Cancel</span>
                 </button>
                 <button onClick={saveConfigChanges} className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                   <Save size={16} /> <span className="text-xs font-bold uppercase hidden sm:inline">Save Changes</span>
                 </button>
               </>
             ) : (
               <button onClick={startConfigMode} className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--card-border)] hover:bg-[var(--card-hover)] transition-all">
                 <Settings size={16} /> <span className="text-xs font-bold uppercase hidden sm:inline">Customize Dashboard</span>
               </button>
             )}
          </div>
        )}
      </div>

      {!activeCategory ? (
        /* VIEW 1: LIBRARY */
        <div className="relative z-10 max-w-6xl mx-auto animate-fade-in-up">
          <div className="mb-12">
             <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
               {isConfigMode ? "Dashboard Configuration" : "Affirmation Library"}
             </h1>
             <p className="text-xl opacity-60 font-light">
               {isConfigMode ? "Select which groups and quotes appear on your Home Screen." : "Choose a path to focus your mind."}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!isConfigMode && (
              <div 
                onClick={() => favoritesGroup.quotes.length > 0 && setActiveCategory('favorites')}
                className={`group relative h-64 rounded-3xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-pink-500/20 p-8 transition-all duration-300 overflow-hidden ${favoritesGroup.quotes.length > 0 ? 'cursor-pointer hover:-translate-y-2 hover:border-pink-500/50' : 'opacity-50 cursor-not-allowed'}`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-20 text-pink-500"><Star size={100} fill="currentColor" /></div>
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <h3 className="text-3xl font-bold mb-2 text-pink-500">My Favorites</h3>
                  <p className="text-sm font-mono opacity-60 uppercase tracking-widest">{favoritesGroup.quotes.length} Saved Quotes</p>
                </div>
              </div>
            )}

            {Object.entries(affirmationGroups).map(([key, group]) => {
              const currentConfig = isConfigMode && draftConfig ? draftConfig : config;
              const groupConfig = currentConfig[key] || { enabled: false, excludedQuotes: [] };
              const selectedCount = group.quotes.length - groupConfig.excludedQuotes.length;
              const isExpanded = expandedGroups[key];

              return (
                <div key={key} className={`relative rounded-3xl bg-[var(--card-glass)] border transition-all duration-300 overflow-hidden ${isConfigMode ? 'border-[var(--card-border)]' : 'h-64 cursor-pointer hover:-translate-y-2 hover:border-yellow-500/50'}`}>
                  {isConfigMode ? (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <input type="checkbox" checked={groupConfig.enabled} onChange={() => toggleLocalGroup(key)} className="w-5 h-5 rounded border-gray-500 text-yellow-500 focus:ring-yellow-500" />
                           <h3 className={`text-xl font-bold text-[var(--text-primary)] ${groupConfig.enabled ? 'opacity-100' : 'opacity-50'}`}>{group.label}</h3>
                        </div>
                        <button onClick={() => setExpandedGroups(prev => ({...prev, [key]: !prev[key]}))} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                           {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                        </button>
                      </div>
                      <p className="text-xs font-mono opacity-50 uppercase tracking-widest mb-4 ml-8">{groupConfig.enabled ? `${selectedCount} / ${group.quotes.length} Selected` : "Disabled"}</p>
                      {isExpanded && groupConfig.enabled && (
                        <div className="mt-4 space-y-2 ml-8 border-t border-[var(--card-border)] pt-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {group.quotes.map((quote) => {
                            const isExcluded = groupConfig.excludedQuotes.includes(quote.text);
                            return (
                              <div key={quote.text} className="flex items-start gap-3 text-sm opacity-80 hover:opacity-100">
                                <input type="checkbox" checked={!isExcluded} onChange={() => toggleLocalQuote(key, quote.text)} className="mt-1 w-4 h-4 rounded border-gray-600 text-yellow-500" />
                                <span className={isExcluded ? 'opacity-50 line-through' : ''}>"{quote.text.substring(0, 50)}..."</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div onClick={() => setActiveCategory(key)} className="h-full p-8 relative">
                       <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                         {key === 'gita' && <BookOpen size={120} />}
                         {key === 'positive' && <Sun size={120} />}
                         {key === 'gratitude' && <Heart size={120} />}
                       </div>
                       <div className="relative z-10 h-full flex flex-col justify-end">
                         <h3 className="text-3xl font-bold mb-2">{group.label}</h3>
                         <p className="text-sm font-mono opacity-60 uppercase tracking-widest">{group.quotes.length} Quotes</p>
                       </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: FOCUS MODE */
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in relative z-20">
           {currentQuote ? (
             <>
               {/* TOP RIGHT CONTROLS (Heart & Close) */}
               <div className="absolute top-0 right-0 flex gap-4">
                   <button onClick={() => toggleFavorite(currentQuote.text)} className={`p-3 rounded-full border transition-all ${isFavorite() ? 'bg-red-500/20 border-red-500 text-red-500' : 'border-[var(--card-border)] hover:bg-[var(--card-hover)] opacity-50 hover:opacity-100'}`}>
                      <Heart size={20} fill={isFavorite() ? "currentColor" : "none"} />
                   </button>
                   <button onClick={() => setActiveCategory(null)} className="p-3 rounded-full border border-[var(--card-border)] hover:bg-[var(--card-hover)]">
                      <X size={20} />
                   </button>
               </div>

               {/* MAIN QUOTE */}
               <div className="relative w-full max-w-4xl py-12 px-4 text-center">
                  <Quote size={80} className="opacity-10 absolute top-0 left-0 scale-x-[-1]" />
                  <h2 className="text-3xl md:text-5xl md:leading-tight font-medium mb-10 selection:bg-yellow-500/30">"{currentQuote.text}"</h2>
                  <div className="inline-block px-8 py-3 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm">{currentQuote.author}</div>
               </div>

               {/* BOTTOM CONTROLS (Next/Prev) */}
               <div className="flex items-center justify-center gap-12 mt-8">
                  <button onClick={handlePrev} className="p-5 rounded-full border border-[var(--card-border)] hover:bg-[var(--card-hover)] transition-all hover:scale-110"><ChevronLeft size={32} /></button>
                  <span className="text-sm font-mono opacity-30 tracking-widest">{currentQuoteIndex + 1} / {activeQuotesList.length}</span>
                  <button onClick={handleNext} className="p-5 rounded-full border border-[var(--card-border)] hover:bg-[var(--card-hover)] transition-all hover:scale-110"><ChevronRight size={32} /></button>
               </div>
             </>
           ) : (
             <div className="flex flex-col items-center gap-4">
                <div className="text-xl opacity-50">Loading Quote...</div>
                <button onClick={() => setActiveCategory(null)} className="text-sm underline">Go Back</button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default Affirmations;