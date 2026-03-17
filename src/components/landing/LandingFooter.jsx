import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Instagram, Mail, Phone, Heart, Users } from 'lucide-react';

const LandingFooter = ({ style }) => (
  <motion.div 
    style={style} 
    className="fixed bottom-0 left-0 w-full z-50 border-t border-[var(--card-border)] bg-gray-100 dark:bg-[#050505] text-[var(--text-primary)] transition-colors duration-500"
  >
    <div className="max-w-7xl mx-auto px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      
      {/* 1. BRAND & MISSION */}
      <div className="col-span-1 md:col-span-1 space-y-4">
        <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Soul Leveling
        </h2>
        <p className="text-sm opacity-60 leading-relaxed">
          The world's first RPG for your inner self. We merge ancient Vedic wisdom with modern gamification to help you level up in real life.
        </p>
        <div className="flex gap-4 pt-2 opacity-60">
          <Twitter size={20} className="hover:text-blue-400 cursor-pointer transition-colors" />
          <Instagram size={20} className="hover:text-pink-500 cursor-pointer transition-colors" />
          <Github size={20} className="hover:text-[var(--text-primary)] cursor-pointer transition-colors" />
        </div>
      </div>

      {/* 2. COMPANY (Core Team) */}
      <div>
        <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-purple-500">Company</h3>
        <ul className="space-y-3 text-sm opacity-60">
          <li><a href="#" className="hover:text-purple-500 transition-colors flex items-center gap-2"><Users size={14}/> Meet the Core Team</a></li>
          <li><a href="#" className="hover:text-purple-500 transition-colors">Our Manifesto</a></li>
          <li><a href="#" className="hover:text-purple-500 transition-colors">Careers</a></li>
          <li><a href="#" className="hover:text-purple-500 transition-colors">Press Kit</a></li>
        </ul>
      </div>

      {/* 3. SUPPORT (Contact) */}
      <div>
        <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-blue-500">Support</h3>
        <ul className="space-y-3 text-sm opacity-60">
          <li className="flex items-center gap-2"><Mail size={14}/> hello@soulleveling.com</li>
          <li className="flex items-center gap-2"><Phone size={14}/> +91 98765 43210</li>
          <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
          <li><a href="#" className="hover:text-blue-500 transition-colors">Community Discord</a></li>
        </ul>
      </div>

      {/* 4. EMERGENCY / LEGAL */}
      <div>
        <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-red-500">Wellbeing</h3>
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 mb-4">
          <p className="text-[10px] uppercase font-bold text-red-500/70 mb-1">Crisis Helpline</p>
          <div className="font-bold text-lg text-red-500 flex items-center gap-2">
            <Heart size={18} fill="currentColor" /> 988
          </div>
          <p className="text-[10px] opacity-50 mt-1">Available 24/7 for support.</p>
        </div>
        <div className="flex gap-4 text-xs opacity-40">
           <a href="#" className="hover:opacity-100">Privacy</a>
           <a href="#" className="hover:opacity-100">Terms</a>
        </div>
      </div>

    </div>

    {/* SUB-FOOTER */}
    <div className="border-t border-[var(--card-border)] bg-[var(--bg-core)]/50 py-6">
       <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-40 font-mono">
          <p>© 2026 Soul Leveling Systems Inc.</p>
          <p>Built with consciousness.</p>
       </div>
    </div>
  </motion.div>
);

export default LandingFooter;