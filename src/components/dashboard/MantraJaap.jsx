import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Settings2, ChevronDown, ChevronUp, Volume2, VolumeX, Hand } from 'lucide-react';

// --- VEDIC MANTRA DATABASE ---
const MANTRA_DB = [
  {
    category: "Panch Devta",
    desc: "The five primary deities of Vedic worship.",
    deities: [
      {
        name: "Lord Ganesha",
        mantras: [
          { id: 'g1', name_en: "Ganesh Beej Mantra", sanskrit: "ॐ गं गणपतये नमः", duration: 3 },
          { id: 'g2', name_en: "Vakratunda Mahakaya", sanskrit: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥", duration: 8 }
        ]
      },
      {
        name: "Lord Shiva",
        mantras: [
          { id: 's1', name_en: "Shiva Panchakshara", sanskrit: "ॐ नमः शिवाय", duration: 3 },
          { id: 's2', name_en: "Mahamrityunjaya", sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्॥", duration: 12 }
        ]
      },
      {
        name: "Lord Vishnu",
        mantras: [
          { id: 'v1', name_en: "Vishnu Dwadasakshara", sanskrit: "ॐ नमो भगवते वासुदेवाय", duration: 4 }
        ]
      },
      {
        name: "Maa Durga",
        mantras: [
          { id: 'd1', name_en: "Durga Beej Mantra", sanskrit: "ॐ दुं दुर्गायै नमः", duration: 3 }
        ]
      },
      {
        name: "Surya Dev",
        mantras: [
          { id: 'su1', name_en: "Surya Beej Mantra", sanskrit: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः", duration: 5 }
        ]
      }
    ]
  },
  {
    category: "Navgraha",
    desc: "Mantras for the 9 celestial bodies to harmonize planetary energies.",
    deities: [
      {
        name: "Shani Dev (Saturn)",
        mantras: [
          { id: 'sh1', name_en: "Shani Beej Mantra", sanskrit: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः", duration: 5 }
        ]
      },
      {
        name: "Brihaspati (Jupiter)",
        mantras: [
          { id: 'br1', name_en: "Guru Beej Mantra", sanskrit: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः", duration: 5 }
        ]
      }
    ]
  },
  {
    category: "Naam Jaap",
    desc: "Simple, powerful repetition of the Holy Names.",
    deities: [
      {
        name: "Sri Rama",
        mantras: [
          { id: 'n1', name_en: "Ram Naam", sanskrit: "राम", duration: 2 },
          { id: 'n2', name_en: "Sita Ram", sanskrit: "सीता राम", duration: 2 }
        ]
      },
      {
        name: "Sri Krishna",
        mantras: [
          { id: 'n3', name_en: "Maha Mantra", sanskrit: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे।\nहरे राम हरे राम राम राम हरे हरे॥", duration: 10 }
        ]
      }
    ]
  }
];

const MantraJaap = ({ onBack }) => {
  const [view, setView] = useState('select'); // 'select' | 'setup' | 'session'
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState("Panch Devta");
  
  // Setup State
  const [sankalpType, setSankalpType] = useState('chants'); // 'chants' | 'malas'
  const [sankalpValue, setSankalpValue] = useState(11);
  const [isAutoMode, setIsAutoMode] = useState(false);

  // Session State
  const [count, setCount] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100

  const targetCount = sankalpType === 'malas' ? sankalpValue * 108 : sankalpValue;
  const isComplete = count >= targetCount;

  // --- PROGRESS & AUTO ENGINE ---
  useEffect(() => {
    let interval;
    if (view === 'session' && !isPaused && progress < 100 && !isComplete && selectedMantra) {
      const updateIntervalMs = 50; 
      const durationMs = selectedMantra.duration * 1000;
      
      interval = setInterval(() => {
        setProgress((prev) => {
          const nextProgress = prev + (updateIntervalMs / durationMs) * 100;
          if (nextProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return nextProgress;
        });
      }, updateIntervalMs);
    } else if (progress >= 100 && isAutoMode && !isPaused && !isComplete) {
      // Auto-advance after a brief pause
      const autoTimeout = setTimeout(() => {
        handleNextChant();
      }, 1000);
      return () => clearTimeout(autoTimeout);
    }
    return () => clearInterval(interval);
  }, [view, isPaused, progress, isAutoMode, isComplete, selectedMantra]);

  const handleNextChant = () => {
    if (count < targetCount) {
      setCount(c => c + 1);
      setProgress(0); // Reset progress for the new chant
    }
  };

  const handleManualClick = () => {
    // Only allow manual click if in manual mode and text is fully highlighted
    if (!isAutoMode && progress >= 100 && !isComplete) {
      handleNextChant();
    }
  };

  const resetSession = () => {
    setCount(0);
    setProgress(0);
    setIsPaused(false);
    setView('select');
  };

  const toggleMode = () => setIsAutoMode(!isAutoMode);
  const togglePause = () => setIsPaused(!isPaused);

  // --- MULTILINE MANTRA RENDERER ---
  const renderMantra = () => {
    if (!selectedMantra) return null;
    const lines = selectedMantra.sanskrit.split('\n');
    const allWords = selectedMantra.sanskrit.replace(/\n/g, ' ').split(' ').filter(w => w !== '');
    const totalWords = allWords.length;
    let globalWordCounter = 0;

    return lines.map((line, lineIndex) => {
      const words = line.split(' ').filter(w => w !== '');
      return (
        <div key={lineIndex} className="text-4xl md:text-5xl lg:text-6xl font-serif leading-snug whitespace-pre-wrap mb-4">
          {words.map((word, wordIndex) => {
            const currentGlobalIndex = globalWordCounter;
            globalWordCounter++;
            
            // Calculate threshold based on word position across ALL lines
            const wordProgressThreshold = (currentGlobalIndex / totalWords) * 100;
            const isHighlighted = progress > wordProgressThreshold;

            return (
              <span
                key={wordIndex}
                className={`transition-colors duration-300 mr-4 inline-block ${
                  isHighlighted ? 'text-yellow-500' : 'text-gray-500/30'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      );
    });
  };

  // --- VIEW 1: SELECTION MENU ---
  if (view === 'select') {
    return (
      <div className="w-full max-w-5xl mx-auto pt-10 md:pt-16 px-6 animate-fade-in pb-24">
        <button onClick={onBack} className="flex items-center gap-2 opacity-50 hover:opacity-100 uppercase text-xs font-bold tracking-widest mb-8 transition-opacity">
          <ArrowLeft size={16} /> Back to Hub
        </button>
        <div className="mb-10">
          <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Mantra Jaap</h2>
          <p className="opacity-60">Select a deity and mantra for your digital mala practice.</p>
        </div>

        <div className="flex flex-col gap-4">
          {MANTRA_DB.map((cat) => (
            <div key={cat.category} className="border border-[var(--card-border)] bg-[var(--card-glass)] rounded-2xl overflow-hidden transition-all">
              <div 
                onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
                className="p-6 cursor-pointer hover:bg-white/5 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-orange-400">{cat.category}</h3>
                  <p className="text-xs opacity-50 mt-1">{cat.desc}</p>
                </div>
                {expandedCategory === cat.category ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              <AnimatePresence>
                {expandedCategory === cat.category && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-black/20">
                    <div className="p-6 pt-0 flex flex-col gap-6">
                      {cat.deities.map((deity) => (
                        <div key={deity.name}>
                          <h4 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-3 border-b border-white/10 pb-1">{deity.name}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {deity.mantras.map((mantra) => (
                              <div 
                                key={mantra.id}
                                onClick={() => { setSelectedMantra(mantra); setView('setup'); }}
                                className="p-4 rounded-xl border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 cursor-pointer transition-all group"
                              >
                                <p className="text-sm font-bold text-white group-hover:text-orange-400 mb-2">{mantra.name_en}</p>
                                <p className="text-lg font-serif text-yellow-500/80">{mantra.sanskrit}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW 2: SANKALP (SETUP) ---
  if (view === 'setup') {
    return (
      <div className="w-full max-w-xl mx-auto pt-24 px-6 animate-fade-in">
        <button onClick={() => setView('select')} className="flex items-center gap-2 opacity-50 hover:opacity-100 uppercase text-xs font-bold tracking-widest mb-8 transition-opacity">
          <ArrowLeft size={16} /> Choose Different Mantra
        </button>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2">Set Sankalp (Goal)</h2>
          <p className="text-xl font-serif text-yellow-500 mb-2">{selectedMantra.sanskrit}</p>
          <p className="text-sm opacity-60">{selectedMantra.name_en}</p>
        </div>

        <div className="bg-[var(--card-glass)] border border-[var(--card-border)] rounded-3xl p-8 flex flex-col gap-8">
          
          {/* Target Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3 block">Target Type</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setSankalpType('chants')}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${sankalpType === 'chants' ? 'bg-orange-500 text-white' : 'bg-white/5 opacity-60 hover:bg-white/10'}`}
              >
                Custom Chants
              </button>
              <button 
                onClick={() => setSankalpType('malas')}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${sankalpType === 'malas' ? 'bg-orange-500 text-white' : 'bg-white/5 opacity-60 hover:bg-white/10'}`}
              >
                Full Malas (108)
              </button>
            </div>
          </div>

          {/* Target Value */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3 block">Number of {sankalpType === 'malas' ? 'Malas' : 'Chants'}</label>
            <input 
              type="number" 
              value={sankalpValue} 
              onChange={(e) => setSankalpValue(Number(e.target.value))}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-2xl text-center font-bold focus:outline-none focus:border-orange-500"
            />
            {sankalpType === 'malas' && <p className="text-center text-xs opacity-50 mt-2">Total Chants: {sankalpValue * 108}</p>}
          </div>

          {/* Mode */}
          <div>
             <label className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3 block">Chanting Mode</label>
             <div className="flex gap-4">
              <button 
                onClick={() => setIsAutoMode(false)}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl font-bold transition-colors ${!isAutoMode ? 'bg-blue-500 text-white' : 'bg-white/5 opacity-60 hover:bg-white/10'}`}
              >
                <Hand size={18} /> Manual
              </button>
              <button 
                onClick={() => setIsAutoMode(true)}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl font-bold transition-colors ${isAutoMode ? 'bg-blue-500 text-white' : 'bg-white/5 opacity-60 hover:bg-white/10'}`}
              >
                <Settings2 size={18} /> Auto
              </button>
            </div>
          </div>

          <button 
            onClick={() => { setCount(0); setProgress(0); setView('session'); }}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-lg hover:scale-[1.02] transition-transform shadow-xl mt-4"
          >
            Start Jaap Session
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 3: ACTIVE SESSION ---
  const isBeadReady = progress >= 100;
  const beadGlowSize = progress * 0.3; // Glow grows to 30px
  const beadGlowOpacity = progress / 100;

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex flex-col animate-fade-in relative pb-24">
      
      {/* Top Header */}
      <div className="w-full p-8 flex justify-between items-start z-10">
        <button onClick={resetSession} className="flex items-center gap-2 opacity-50 hover:opacity-100 uppercase text-xs font-bold tracking-widest transition-opacity">
          <ArrowLeft size={16} /> End Session
        </button>
        <div className="text-right">
          <div className="text-2xl font-black text-orange-400">{count} / {targetCount}</div>
          <div className="text-xs opacity-50 uppercase tracking-widest">
             {sankalpType === 'malas' ? `${Math.floor(count / 108)} Malas Completed` : 'Chants'}
          </div>
        </div>
      </div>

      {/* Center: The Mantra & Controls */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 md:pr-48 text-center relative z-10">
        
        {isComplete ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
             <h2 className="text-5xl font-black text-green-400 mb-4">Sankalp Complete</h2>
             <p className="text-xl font-serif opacity-80 mb-8">ॐ शान्तिः शान्तिः शान्तिः</p>
             <button onClick={resetSession} className="px-8 py-3 bg-white text-black font-bold rounded-full">Return to Hub</button>
          </motion.div>
        ) : (
          <>
            <button 
              onClick={() => setIsAudioMuted(!isAudioMuted)} 
              className="mb-8 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              {isAudioMuted ? <VolumeX size={24} /> : <Volume2 size={24} className="text-orange-400" />}
            </button>
            
            <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-6">{selectedMantra.name_en}</p>
            
            <div className="mb-8">
              {renderMantra()}
            </div>

            {/* In-Session Controls */}
            <div className="flex items-center gap-4 mt-6 z-20">
              <button
                onClick={togglePause}
                className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-xs font-bold tracking-wider uppercase border border-white/5"
              >
                {isPaused ? <Play size={16} className="text-orange-400" /> : <Pause size={16} className="text-orange-400" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>

              <button
                onClick={toggleMode}
                className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-xs font-bold tracking-wider uppercase border border-white/5"
              >
                {isAutoMode ? <Settings2 size={16} className="text-blue-400" /> : <Hand size={16} className="text-blue-400" />}
                Mode: <span className="text-white">{isAutoMode ? 'Auto' : 'Manual'}</span>
              </button>
            </div>

            <p className={`mt-8 text-xs font-bold uppercase tracking-widest transition-opacity duration-300 ${isBeadReady && !isAutoMode ? 'text-orange-400 animate-pulse' : 'opacity-30'}`}>
              {isAutoMode ? "Auto Chanting Active" : (isBeadReady ? "Tap the mala to continue" : "Chanting in progress...")}
            </p>
          </>
        )}
      </div>

      {/* Right Side: Visual Cropped Mala (FIXED: z-index added, pointer-events-none removed) */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[80vh] w-32 flex flex-col items-center justify-center z-50"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
      >
        <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-orange-900 via-orange-500 to-orange-900 opacity-30 z-0"></div>
        
        {/* We map a few decorative small beads above and below */}
        {[...Array(3)].map((_, i) => <div key={`top-${i}`} className="w-6 h-6 rounded-full bg-[#8b4513] border border-black/50 shadow-inner my-2 z-10" />)}
        
        {/* THE ACTIVE BEAD IN HAND */}
        <motion.div 
          key={`active-bead-${count}`}
          initial={{ y: -20, scale: 1.1 }}
          animate={{ y: 0, scale: 1.2 }}
          style={{
            boxShadow: `0 0 ${beadGlowSize}px rgba(249, 115, 22, ${beadGlowOpacity})`,
          }}
          className={`w-14 h-14 rounded-full bg-gradient-to-br from-[#a0522d] to-[#5c2e0b] border-2 border-orange-900/50 shadow-[0_10px_20px_rgba(0,0,0,0.5)] my-4 z-50 flex items-center justify-center transition-all duration-300
            ${!isAutoMode && isBeadReady && !isComplete ? 'cursor-pointer hover:scale-[1.25] brightness-125' : 'opacity-80'}
          `}
          onClick={handleManualClick}
        >
          {/* Rudraksha texture illusion */}
          <div className="w-10 h-10 rounded-full border border-black/20 opacity-30 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none"></div>
        </motion.div>

        {[...Array(3)].map((_, i) => <div key={`bot-${i}`} className="w-6 h-6 rounded-full bg-[#8b4513] border border-black/50 shadow-inner my-2 z-10" />)}
      </div>

    </div>
  );
};

export default MantraJaap;