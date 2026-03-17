import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Square, Wind, CheckCircle2 } from 'lucide-react';

// --- THE VEDIC BREATHING PATTERNS ---
const TECHNIQUES = [
  {
    id: 'box',
    name: 'Sama Vritti',
    subtitle: 'Box Breathing',
    desc: 'Equal breath to balance the mind and ground the nervous system. Used for extreme focus.',
    color: 'from-blue-400 to-cyan-500',
    theme: 'blue',
    pattern: [
      { action: 'Inhale', duration: 4, scale: 1.5 },
      { action: 'Hold', duration: 4, scale: 1.5 },
      { action: 'Exhale', duration: 4, scale: 1 },
      { action: 'Hold', duration: 4, scale: 1 },
      { action: 'Rest', duration: 3, scale: 1 } // <--- Added Break
    ]
  },
  {
    id: 'relax',
    name: 'Visama Vritti',
    subtitle: '4-7-8 Relaxing Breath',
    desc: 'A natural tranquilizer for the nervous system. Highly effective for reducing anxiety or preparing for sleep.',
    color: 'from-purple-400 to-indigo-500',
    theme: 'purple',
    pattern: [
      { action: 'Inhale', duration: 4, scale: 1.5 },
      { action: 'Hold', duration: 7, scale: 1.5 },
      { action: 'Exhale', duration: 8, scale: 1 },
      { action: 'Rest', duration: 3, scale: 1 } // <--- Added Break
    ]
  },
  {
    id: 'ocean',
    name: 'Ujjayi',
    subtitle: 'Victorious / Ocean Breath',
    desc: 'Deep, prolonged breathing with slight throat constriction. Builds internal heat and deep meditation.',
    color: 'from-emerald-400 to-teal-500',
    theme: 'emerald',
    pattern: [
      { action: 'Inhale', duration: 5, scale: 1.5 },
      { action: 'Exhale', duration: 5, scale: 1 },
      { action: 'Rest', duration: 3, scale: 1 } // <--- Added Break
    ]
  },
  {
    id: 'nadi',
    name: 'Anulom Vilom',
    subtitle: 'Alternate Nostril',
    desc: 'Balances the left and right hemispheres of the brain (Ida and Pingala Nadis).',
    color: 'from-orange-400 to-red-500',
    theme: 'orange',
    pattern: [
      { action: 'Inhale Left', duration: 4, scale: 1.5 },
      { action: 'Hold', duration: 4, scale: 1.5 },
      { action: 'Exhale Right', duration: 6, scale: 1 },
      { action: 'Inhale Right', duration: 4, scale: 1.5 },
      { action: 'Hold', duration: 4, scale: 1.5 },
      { action: 'Exhale Left', duration: 6, scale: 1 },
      { action: 'Rest', duration: 3, scale: 1 } // <--- Added Break
    ]
  }
];

const Pranayama = ({ onBack }) => {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // --- BREATHING ENGINE LOGIC ---
  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  useEffect(() => {
    if (isActive && timeLeft === 0 && selectedTechnique) {
      const nextIndex = (phaseIndex + 1) % selectedTechnique.pattern.length;
      
      if (nextIndex === 0) {
        setCyclesCompleted((c) => c + 1);
      }
      
      setPhaseIndex(nextIndex);
      setTimeLeft(selectedTechnique.pattern[nextIndex].duration);
    }
  }, [timeLeft, isActive, phaseIndex, selectedTechnique]);

  const handleStart = () => {
    setPhaseIndex(0);
    setTimeLeft(selectedTechnique.pattern[0].duration);
    setCyclesCompleted(0);
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setTimeLeft(0);
  };

  // --- VIEW 1: SELECTION MENU ---
  if (!selectedTechnique) {
    return (
      <div className="w-full max-w-5xl mx-auto pt-10 md:pt-16 px-6 animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 opacity-50 hover:opacity-100 uppercase text-xs font-bold tracking-widest mb-8 transition-opacity">
          <ArrowLeft size={16} /> Back to Hub
        </button>
        <div className="mb-10">
          <h2 className="text-4xl font-black mb-2">Pranayama</h2>
          <p className="opacity-60">Select a breathwork technique to regulate your nervous system.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TECHNIQUES.map((tech) => (
            <div 
              key={tech.id}
              onClick={() => setSelectedTechnique(tech)}
              className="p-6 rounded-3xl bg-[var(--card-glass)] border border-[var(--card-border)] hover:bg-white/5 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tech.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <Wind size={20} />
              </div>
              <h3 className="text-2xl font-bold">{tech.name}</h3>
              <p className="text-xs font-bold uppercase tracking-widest opacity-50 mt-1 mb-3">{tech.subtitle}</p>
              <p className="text-sm opacity-70">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW 2: THE ACTIVE BREATHING ENGINE ---
  const currentPhase = selectedTechnique.pattern[phaseIndex];

  return (
    // FIX 1: Added pt-24 md:pt-32 here to push everything down below the global Navbar!
      <div className="w-full min-h-[calc(100vh-8rem)] flex flex-col items-center animate-fade-in pb-24">      
      {/* Top Bar */}
      <div className="w-full max-w-6xl px-8 pb-6 flex justify-between items-center z-10">
        <button 
          onClick={() => { handleStop(); setSelectedTechnique(null); }} 
          className="flex items-center gap-2 opacity-50 hover:opacity-100 uppercase text-xs font-bold tracking-widest transition-opacity"
        >
          <ArrowLeft size={16} /> Select Technique
        </button>
        <div className="text-right">
          <h2 className="text-xl font-bold">{selectedTechnique.name}</h2>
          <p className="text-xs opacity-50 uppercase tracking-widest">{selectedTechnique.subtitle}</p>
        </div>
      </div>

      {/* Main Content Split: Circle & Sidebar */}
      <div className="flex-1 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 px-6 pb-24">
        
        {/* LEFT: The Breathing Circle */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mt-4">
          {isActive && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: currentPhase.scale }}
              transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${selectedTechnique.color} opacity-20 blur-3xl`}
            />
          )}
          
          <motion.div
            animate={isActive ? { scale: currentPhase.scale } : { scale: 1 }}
            transition={isActive ? { duration: currentPhase.duration, ease: "easeInOut" } : { duration: 1 }}
            className={`relative z-10 w-56 h-56 md:w-64 md:h-64 rounded-full border border-white/20 bg-gradient-to-br ${selectedTechnique.color} shadow-[0_0_50px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center text-white`}
          >
            {isActive ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPhase.action}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-2xl font-black tracking-widest uppercase mb-1 drop-shadow-md">{currentPhase.action}</div>
                  <div className="text-5xl font-light tabular-nums drop-shadow-md">{timeLeft}</div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center px-4">
                <Wind size={32} className="mx-auto mb-2 opacity-80" />
                <div className="text-sm font-bold tracking-widest uppercase opacity-80">Ready</div>
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT: Cycle Progression Sidebar */}
        <div className="w-full max-w-sm flex flex-col gap-4">
          
          {/* Cycle Counter */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Cycle Progression</h3>
            <div className="flex items-center gap-2 text-xs font-bold uppercase bg-white/10 px-3 py-1 rounded-full">
               <CheckCircle2 size={14} className={`text-${selectedTechnique.theme}-400`} /> 
               {cyclesCompleted} Completed
            </div>
          </div>

          {/* Dynamic Steps List */}
          <div className="flex flex-col gap-3">
            {selectedTechnique.pattern.map((step, idx) => {
              const isActiveStep = isActive && phaseIndex === idx;

              return (
                <div 
                  key={idx} 
                  className={`relative overflow-hidden rounded-xl border p-4 transition-colors duration-300 ${
                    isActiveStep 
                      ? `border-${selectedTechnique.theme}-500/50 bg-${selectedTechnique.theme}-500/10` 
                      : 'border-[var(--card-border)] bg-[var(--card-glass)] opacity-40'
                  }`}
                >
                  {/* FIX 2: Smooth, continuous progress fill powered purely by Framer Motion */}
                  {isActiveStep && (
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: step.duration, ease: "linear" }}
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${selectedTechnique.color} opacity-20`}
                    />
                  )}
                  
                  {/* Text Content */}
                  <div className="relative z-10 flex justify-between items-center">
                    <span className={`font-bold uppercase tracking-wider ${isActiveStep ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {idx + 1}. {step.action}
                    </span>
                    <span className="font-mono text-sm opacity-60">
                      {isActiveStep ? `${timeLeft}s` : `${step.duration}s`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-8 flex justify-center md:justify-start">
            {!isActive ? (
              <button 
                onClick={handleStart}
                className="w-full flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform"
              >
                <Play size={20} fill="currentColor" /> Begin Session
              </button>
            ) : (
              <button 
                onClick={handleStop}
                className="w-full flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all"
              >
                <Square size={20} fill="currentColor" /> Stop Session
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pranayama;