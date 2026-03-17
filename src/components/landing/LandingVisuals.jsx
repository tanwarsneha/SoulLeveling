import React, { useState } from 'react';
import { motion, useTransform, useMotionValueEvent } from 'framer-motion';
import { Lock } from 'lucide-react';

/* =========================================================
   1. SHARED/INTERNAL COMPONENTS 
   ========================================================= */

const InternalKnot = ({ trigger, bottom, color, progress }) => {
  const [isBroken, setIsBroken] = useState(false);
  useMotionValueEvent(progress, "change", (latest) => { if (latest > trigger) setIsBroken(true); else setIsBroken(false); });
  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center transition-all duration-700" style={{ bottom: bottom }}>
      <motion.div animate={{ scale: isBroken ? 0 : 1, opacity: isBroken ? 0 : 1 }} className="drop-shadow-[0_0_5px_rgba(100,100,100,0.5)]"><Lock size={20} color={color} /></motion.div>
      {isBroken && <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 rounded-full border-2" style={{ borderColor: color }} />}
    </div>
  );
};

const DescendingRing = ({ range, color, title, sub, icon, progress, centerX }) => {
  const opacity = useTransform(progress, [range[0], range[0] + 0.02, range[1] - 0.02, range[1]], [0, 1, 1, 0]);
  const cy = useTransform(progress, [range[0], range[1]], [55, 230]);
  const rangeWidth = range[1] - range[0];
  const localProgress = useTransform(progress, (v) => {
    const p = (v - range[0]) / rangeWidth; 
    return Math.sin(Math.max(0, Math.min(1, p)) * Math.PI); 
  });
  const r = useTransform(localProgress, [0, 1], [0, 28]);

  return (
    <g>
       <motion.circle cx={centerX} cy={cy} r={useTransform(r, v => v * 1.5)} fill={color} style={{ opacity: useTransform(opacity, v => v * 0.4) }} className="blur-[20px]" />
       <motion.circle cx={centerX} cy={cy} r={r} stroke={color} strokeWidth="2" fill="none" style={{ opacity }} />
       <motion.text x={centerX - 40} y={cy} dy="5" textAnchor="end" fill={color} style={{ opacity, textShadow: `0 0 10px ${color}40`, fontSize: "12px", fontWeight: "bold", letterSpacing: "1px" }}>{title}</motion.text>
       <motion.text x={centerX} y={cy} dy="9" textAnchor="middle" style={{ opacity, fontSize: "24px", filter: "drop-shadow(0 0 5px black)" }}>{icon}</motion.text>
       <motion.text x={centerX + 40} y={cy} textAnchor="start" fill="var(--text-secondary)" style={{ opacity }}>
         <tspan x={centerX + 40} dy="0" fontSize="12px" fontWeight="bold">{sub}</tspan>
         <tspan x={centerX + 40} dy="1.2em" fontSize="9px" opacity="0.7">Chakra</tspan>
       </motion.text>
    </g>
  );
};

const CubicSnake = ({ phase, width, tipY, isOffset, baseColor, strokeColor, centerX }) => {
  const pathD = useTransform([phase, width], ([p, w]) => {
    const basePhase = isOffset ? p + Math.PI : p;
    const cp1x = centerX + (Math.sin(basePhase) * w); 
    const cp2x = centerX + (Math.sin(basePhase + Math.PI / 2) * w); 
    const tipX = centerX + (Math.sin(basePhase + Math.PI) * w);
    return `M ${centerX},400 C ${cp1x},310 ${cp2x},${tipY + 90} ${tipX},${tipY}`;
  });

  return (
    <motion.path 
      d={pathD} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round"
      style={{ filter: `drop-shadow(0 0 10px ${baseColor})` }}
    />
  );
};

/* =========================================================
   2. ASHTANGA OVERLAY (THE MISSING PIECE)
   ========================================================= */

const AscendingCard = ({ range, progress, children }) => {
  const opacity = useTransform(progress, [range[0], range[0] + 0.02, range[1] - 0.02, range[1]], [0, 1, 1, 0]);
  const y = useTransform(progress, [range[0], range[1]], [50, -50]);
  const scale = useTransform(progress, [range[0], range[1]], [0.9, 1.05]);

  return (
    <motion.div style={{ opacity, y, scale, display: useTransform(opacity, v => v > 0 ? "block" : "none") }} className="absolute w-full flex justify-center">
      {children}
    </motion.div>
  );
};

const AshtangaOverlay = ({ progress }) => {
  const limbs = [
    { range: [0.05, 0.16], title: "1. Yama", desc: "Moral Restraints" },
    { range: [0.16, 0.27], title: "2. Niyama", desc: "Observances" },
    { range: [0.28, 0.39], title: "3. Asana", desc: "Posture" },
    { range: [0.40, 0.51], title: "4. Pranayama", desc: "Breath Control" },
    { range: [0.52, 0.63], title: "5. Pratyahara", desc: "Sense Withdrawal" },
    { range: [0.64, 0.75], title: "6. Dharana", desc: "Concentration" },
    { range: [0.76, 0.87], title: "7. Dhyana", desc: "Meditation" },
    { range: [0.88, 0.99], title: "8. Samadhi", desc: "Absorption" },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 -translate-y-[20%]">
      {limbs.map((limb, i) => (
        <AscendingCard key={i} range={limb.range} progress={progress}>
          <div className="text-center bg-[var(--card-glass)]/90 backdrop-blur-md px-6 py-3 rounded-xl border border-[var(--card-border)] shadow-lg mx-4">
            <h4 className="text-lg md:text-xl font-bold text-[var(--text-primary)]">{limb.title}</h4>
            <p className="text-[10px] uppercase tracking-widest opacity-60 text-[var(--text-secondary)]">{limb.desc}</p>
          </div>
        </AscendingCard>
      ))}
    </div>
  );
};

/* =========================================================
   3. EXPORTED COMPONENTS (LeftNadiSystem & MeditatingFigure)
   ========================================================= */

export const MeditatingFigure = ({ progress }) => {
  const spineHeight = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-2xl">
        <path d="M100,60 C120,60 135,75 140,90 C145,110 160,180 160,240 C160,280 140,290 100,290 C60,290 40,280 40,240 C40,180 55,110 60,90 C65,75 80,60 100,60" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" className="opacity-30"/>
        <path d="M40,240 Q10,270 50,290" fill="none" stroke="var(--text-primary)" strokeWidth="1" className="opacity-20" />
        <path d="M160,240 Q190,270 150,290" fill="none" stroke="var(--text-primary)" strokeWidth="1" className="opacity-20" />
        <line x1="100" y1="280" x2="100" y2="70" stroke="var(--text-secondary)" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
      </svg>
      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-1.5 bg-[var(--text-secondary)]/20 rounded-full h-[81%] overflow-hidden">
        <motion.div className="w-full absolute bottom-0 bg-gradient-to-t from-red-600 via-yellow-400 to-white box-shadow-[0_0_15px_var(--text-primary)]" style={{ height: spineHeight }} />
      </div>
      <InternalKnot trigger={0.20} bottom="20%" color="brown" progress={progress} />
      <InternalKnot trigger={0.50} bottom="45%" color="silver" progress={progress} />
      <InternalKnot trigger={0.80} bottom="70%" color="gold" progress={progress} />
    </div>
  );
};

export const LeftNadiSystem = ({ progress }) => {
  const fixedTipY = 130; 
  const centerX = 150; 

  const ringStages = [
    { range: [0.15, 0.28], color: "#ff4d4d", title: "Muladhara", sub: "Root", icon: "🪨" },
    { range: [0.29, 0.42], color: "#ffa500", title: "Swadhisthana", sub: "Sacral", icon: "🌊" },
    { range: [0.43, 0.56], color: "#ffff00", title: "Manipura", sub: "Solar", icon: "🔥" },
    { range: [0.57, 0.70], color: "#00ff00", title: "Anahata", sub: "Heart", icon: "💚" },
    { range: [0.71, 0.84], color: "#0000ff", title: "Vishuddhi", sub: "Throat", icon: "🗣️" },
    { range: [0.85, 0.95], color: "#4b0082", title: "Ajna", sub: "Third Eye", icon: "👁️" },
    { range: [0.96, 1.00], color: "#ee82ee", title: "Sahasrara", sub: "Crown", icon: "🪷" },
  ];

  const wavePhase = useTransform(progress, [0, 0.22, 0.36, 0.50, 0.64, 0.78, 0.90, 0.98], [0, Math.PI, Math.PI*2, Math.PI*3, Math.PI*4, Math.PI*5, Math.PI*6, Math.PI*7]);
  const width = useTransform(progress, [0, 0.15, 0.22, 0.29, 0.36, 0.43, 0.50, 0.57, 0.64, 0.71, 0.78, 0.84, 0.90, 0.94, 0.98], [40, 80, 40, 80, 40, 80, 40, 80, 40, 80, 40, 80, 40, 80, 40]);
  const color = useTransform(progress, [0, 0.22, 0.36, 0.50, 0.64, 0.78, 0.90, 0.98], ["var(--text-primary)", "#ff4d4d", "#ffa500", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#ee82ee"]);

  return (
    <div className="relative h-[100%] w-full flex items-center justify-center">
      {/* 1. THE NADI SYSTEM SVG */}
      <svg viewBox="0 0 300 400" className="w-full h-full overflow-visible absolute top-0 left-0 z-10">
        <motion.line x1={centerX} y1="400" x2={centerX} y2={fixedTipY} stroke="var(--text-primary)" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4"/>
        {ringStages.map((stage, i) => (<DescendingRing key={i} range={stage.range} color={stage.color} title={stage.title} sub={stage.sub} icon={stage.icon} progress={progress} centerX={centerX}/>))}
        <CubicSnake phase={wavePhase} width={width} tipY={fixedTipY} isOffset={false} baseColor="#00ffff" strokeColor={color} centerX={centerX} />
        <CubicSnake phase={wavePhase} width={width} tipY={fixedTipY} isOffset={true} baseColor="#ff00ff" strokeColor={color} centerX={centerX} />
      </svg>
      
      {/* 2. THE ASHTANGA CARDS (Restored) */}
      <AshtangaOverlay progress={progress} />
    </div>
  );
};