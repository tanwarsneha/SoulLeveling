import React, { useState } from 'react';
import { motion, useTransform, AnimatePresence } from 'framer-motion';
import { Zap, Moon, Activity, BookOpen, BarChart2, Smile, Headphones, Gamepad2, Mic } from 'lucide-react';

export const FeatureScrollEngine = ({ progress }) => {
  const y = useTransform(progress, [0, 1], ["80vh", "-250vh"]);
  return (
    <motion.div style={{ y }} className="w-full max-w-2xl flex flex-col items-center gap-[20vh] md:gap-[30vh] px-4 md:px-0">
      <PhysicalWellbeingSection />
      <EmotionalWellbeingSection />
      <MentalWellbeingSection />
    </motion.div>
  );
};

const PhysicalWellbeingSection = () => (
  <div className="w-full">
    <div className="mb-6 text-center">
      <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-500 mb-2">Section 1: Foundation</h2>
      <h3 className="text-3xl md:text-5xl font-black">Physical Wellbeing</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[50vh]">
       <div className="md:col-span-2 md:row-span-2 rounded-3xl p-6 border border-[var(--card-border)] bg-[var(--card-glass)] backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-4">
             <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg"><Zap size={20}/></div>
             <h4 className="text-xl font-bold">Friction Log</h4>
          </div>
          <p className="opacity-60 text-sm mb-6">Track the resistance, not just the result.</p>
          <div className="bg-black/10 dark:bg-black/40 rounded-xl p-4">
             <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div animate={{ width: ["20%", "80%", "20%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-gradient-to-r from-green-400 to-red-500" />
             </div>
          </div>
       </div>
       <div className="rounded-3xl p-4 border border-[var(--card-border)] bg-[var(--card-glass)] backdrop-blur-md flex flex-col items-center justify-center text-center">
          <Moon className="mb-2 text-indigo-400" />
          <h4 className="font-bold">Sleep Lab</h4>
       </div>
       <div className="rounded-3xl p-4 border border-[var(--card-border)] bg-[var(--card-glass)] backdrop-blur-md flex flex-col items-center justify-center text-center">
          <Activity className="mb-2 text-green-400" />
          <h4 className="font-bold">Panic Anchor</h4>
       </div>
    </div>
  </div>
);

const EmotionalWellbeingSection = () => (
  <div className="w-full">
    <div className="mb-6 text-center">
      <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-pink-500 mb-2">Section 2: Connection</h2>
      <h3 className="text-3xl md:text-5xl font-black">Emotional Wellbeing</h3>
    </div>
    <div className="flex flex-col md:flex-row gap-4 min-h-[40vh]">
       <div className="flex-1 rounded-3xl p-6 border border-[var(--card-border)] bg-[var(--card-glass)] backdrop-blur-md"><BookOpen className="text-pink-500 mb-2" size={32} /><h4 className="text-xl font-bold">Shadow Journal</h4></div>
       <div className="flex-[1.5] rounded-3xl p-8 border border-[var(--card-border)] bg-gradient-to-br from-orange-500/10 to-pink-500/10 backdrop-blur-md"><h4 className="text-2xl font-bold mb-4">Reality Calibration</h4><BarChart2 className="text-orange-500" /></div>
       <div className="flex-1 rounded-3xl p-6 border border-[var(--card-border)] bg-[var(--card-glass)] backdrop-blur-md"><Smile className="text-blue-400 mb-2" size={32} /><h4 className="text-xl font-bold">Mood Tracker</h4></div>
    </div>
  </div>
);

const MentalWellbeingSection = () => {
  const [tab, setTab] = useState('sounds');
  const content = {
    sounds: { title: "Neuro-Tuner", icon: <Headphones size={40} className="mb-4 text-blue-400" />, text: "Binaural beats & mantras." },
    games: { title: "Mind Gym", icon: <Gamepad2 size={40} className="mb-4 text-purple-400" />, text: "Strategic puzzles." },
    affirm: { title: "Gita Affirmations", icon: <Mic size={40} className="mb-4 text-yellow-400" />, text: "Subconscious reprogramming." }
  };
  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-blue-500 mb-2">Section 3: Insight</h2>
        <h3 className="text-3xl md:text-5xl font-black">Mental Wellbeing</h3>
      </div>
      <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-glass)] backdrop-blur-md overflow-hidden min-h-[40vh] flex flex-col">
         <div className="flex border-b border-[var(--card-border)]">
           {Object.keys(content).map(k => (
             <button key={k} onClick={() => setTab(k)} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest ${tab === k ? 'bg-white/10' : 'opacity-50'}`}>{k}</button>
           ))}
         </div>
         <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                {content[tab].icon}<h4 className="text-3xl font-bold mb-4">{content[tab].title}</h4><p className="opacity-60 max-w-sm">{content[tab].text}</p>
              </motion.div>
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};