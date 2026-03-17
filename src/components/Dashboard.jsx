import React from 'react';
import Hero from './Hero';
import Wellness from './Wellness';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <div className="pb-12 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div 
        className="fixed top-0 left-0 w-96 h-96 blur-[100px] opacity-20 rounded-full pointer-events-none"
        style={{ background: 'var(--glow-color)' }} 
      ></div>
      
      <div 
        className="fixed bottom-0 right-0 w-64 h-64 blur-[80px] opacity-10 rounded-full pointer-events-none"
        style={{ background: 'var(--text-accent)' }} 
      ></div>

      <main className="pt-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          <Hero />
          <Wellness />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          <Sidebar />
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
