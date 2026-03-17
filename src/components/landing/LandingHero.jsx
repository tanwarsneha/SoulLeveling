import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAffirmations } from '../../context/AffirmationsContext'; // Get User State
import AuthModal from '../AuthModal';

const LandingHero = ({ style }) => {
  const { user } = useAffirmations();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  const handleStart = () => {
    if (user) navigate('/dashboard');
    else setShowAuth(true);
  };

  return (
    <>
      <motion.div style={style} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-[var(--bg-core)]">
        <div className="text-center pointer-events-auto max-w-5xl px-4">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card-glass)] backdrop-blur-md mb-8">
            <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase">✨ Mental Fitness Reimagined</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight tracking-tight">Level Up Your <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Inner Soul.</span></h1>
          <p className="text-lg md:text-2xl opacity-60 max-w-2xl mx-auto mb-10 font-light">Gamify your mental wellness. Track your mood, meditate with friends, and unlock your mind's true potential.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            
            {/* --- UPDATED BUTTON WITH AUTH LOGIC --- */}
            <button 
              onClick={handleStart}
              className="px-10 py-5 text-lg rounded-full font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-transform text-white"
            >
              {user ? "Go to Dashboard" : "Start Leveling Up"}
            </button>
            
            <button className="px-10 py-5 text-lg rounded-full font-bold border border-[var(--card-border)] bg-[var(--card-glass)] backdrop-blur-sm hover:bg-[var(--card-hover)] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </motion.div>

      {/* RENDER MODAL HERE */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default LandingHero;