import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wind, CircleDot, Headphones, Play } from 'lucide-react';
import Pranayama from '../components/dashboard/Pranayama'; 
import MantraJaap from '../components/dashboard/MantraJaap';

const Meditation = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('menu'); 

  // --- ROUTE TO PRANAYAMA ENGINE ---
  if (activeView === 'pranayama') {
    return <Pranayama onBack={() => setActiveView('menu')} />;
  }

  // --- ROUTE TO JAAP ENGINE ---
  if (activeView === 'jaap') {
    return <MantraJaap onBack={() => setActiveView('menu')} />;
  }

  // --- MAIN MENU VIEW ---
  return (
    <div className="min-h-screen bg-[var(--bg-core)] text-[var(--text-primary)] px-6 pb-6 pt-28 md:px-10 md:pb-10 relative overflow-hidden transition-colors duration-500 animate-fade-in">
      
      {/* HEADER */}
      <div className="relative z-10 max-w-5xl mx-auto flex justify-between items-center mb-12">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity text-sm font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Dashboard</span> <span className="sm:hidden">Back</span>
        </button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto mb-12">
         <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
           Dhyana Studio
         </h1>
         <p className="text-xl opacity-60 font-light max-w-2xl">
           Choose your path to stillness. Ground your nervous system with breathwork, or anchor your mind with mantra repetition.
         </p>
      </div>

      {/* SELECTION GRID */}
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. PRANAYAMA */}
        <div 
          onClick={() => setActiveView('pranayama')}
          className="group cursor-pointer rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-8 transition-all hover:-translate-y-2 hover:border-blue-500/50 flex flex-col h-72"
        >
          <div className="p-4 bg-blue-500/20 text-blue-400 w-fit rounded-2xl mb-auto">
            <Wind size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Pranayama</h3>
            <p className="text-sm opacity-60 mb-4 line-clamp-2">Visual breathing exercises to regulate your nervous system. (Sama Vritti, 4-7-8, etc.)</p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 group-hover:text-blue-300">
              <Play size={14} fill="currentColor" /> Begin Breathwork
            </div>
          </div>
        </div>

        {/* 2. MANTRA JAAP */}
        <div 
          onClick={() => setActiveView('jaap')}
          className="group cursor-pointer rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-8 transition-all hover:-translate-y-2 hover:border-orange-500/50 flex flex-col h-72"
        >
          <div className="p-4 bg-orange-500/20 text-orange-400 w-fit rounded-2xl mb-auto">
            <CircleDot size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Mantra Jaap</h3>
            <p className="text-sm opacity-60 mb-4 line-clamp-2">A digital 108-bead mala counter with haptic feedback for deep focus.</p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400 group-hover:text-orange-300">
              <Play size={14} fill="currentColor" /> Start Chanting
            </div>
          </div>
        </div>

        {/* 3. GUIDED MEDITATION */}
        <div className="rounded-3xl bg-[var(--card-glass)] border border-[var(--card-border)] p-8 flex flex-col h-72 opacity-60 relative overflow-hidden">
          <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Coming Soon
          </div>
          <div className="p-4 bg-black/20 text-[var(--text-secondary)] w-fit rounded-2xl mb-auto">
            <Headphones size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Guided Sessions</h3>
            <p className="text-sm opacity-60 mb-4">Audio guides for body scans, non-attachment, and deep integration.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Meditation;