import React, { useRef } from 'react';
import { useScroll, useTransform, useSpring, motion, useMotionValueEvent } from 'framer-motion';

// IMPORT SUB-COMPONENTS
import LandingHero from './landing/LandingHero';
import { LeftNadiSystem, MeditatingFigure } from './landing/LandingVisuals';
import { FeatureScrollEngine } from './landing/LandingContent';
import LandingFooter from './landing/LandingFooter';

/* --- EXTRA COMPONENT: YOGA CARD (Kept here as it's small) --- */
const YogaProgressionCard = ({ progress }) => {
  const [text, setText] = React.useState("Lock: I am the BODY");
  useMotionValueEvent(progress, "change", (latest) => {
    if (latest < 0.35) setText("Lock: I am the BODY");
    else if (latest < 0.65) setText("Lock: I am the EMOTIONS");
    else if (latest < 0.90) setText("Lock: I am the MIND");
    else setText("' I '");
  });
  return (
    <div className="p-4 rounded-xl border border-[var(--card-border)] bg-[var(--bg-core)]/90 backdrop-blur shadow-2xl w-48 md:w-64">
       <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Current State</div>
       <motion.div key={text} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">{text}</motion.div>
       <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden"><motion.div style={{ scaleX: progress }} className="h-full bg-blue-500 origin-left" /></div>
    </div>
  );
};

const Landing = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Animation Transforms
  const heroY = useTransform(scrollYProgress, [0, 0.1], ["0%", "-100%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const diagramsOpacity = useTransform(scrollYProgress, [0.08, 0.12, 0.96, 1.0], [0, 1, 1, 0]);
  const footerY = useTransform(scrollYProgress, [0.96, 1], ["100%", "0%"]);

  return (
    <div ref={containerRef} className="relative h-[800vh] bg-[var(--bg-core)] text-[var(--text-primary)] overflow-hidden transition-colors duration-500">
      
      {/* 1. HERO & AUTH */}
      <LandingHero style={{ y: heroY, opacity: heroOpacity }} />

      {/* 2. SCROLL CONTENT */}
      <motion.div style={{ opacity: diagramsOpacity }} className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Left Visuals */}
        <div className="absolute left-[-12px] md:left-0 top-1/4 -translate-y-1/4 h-[200vh] w-64 md:w-80 flex justify-center items-center z-20 opacity-50 md:opacity-100">
           <LeftNadiSystem progress={smoothProgress} />
        </div>
        {/* Progression Card */}
        <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 z-40 pointer-events-auto">
          <YogaProgressionCard progress={smoothProgress} />
        </div>
        {/* Center Features */}
        <div className="absolute inset-0 flex justify-center pointer-events-auto z-30"> 
           <FeatureScrollEngine progress={smoothProgress} />
        </div>
        {/* Right Figure */}
        <div className="absolute bottom-[-0%] right-[-40%] md:right-[-15%] w-[500px] h-[700px] md:w-[600px] md:h-[800px] opacity-80 pointer-events-none">
           <MeditatingFigure progress={smoothProgress} />
        </div>
      </motion.div>

      {/* 3. FOOTER */}
      <LandingFooter style={{ y: footerY }} />

    </div>
  );
};

export default Landing;