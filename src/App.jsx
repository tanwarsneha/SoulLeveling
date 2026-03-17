import React, { useState } from 'react';
import Sounds from "./pages/Sounds";
import SoundCategory from "./pages/SoundCategory";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard'; 
import Affirmations from './pages/Affirmations';
import Analytics from './pages/Analytics';
import Meditation from './pages/Meditation';

// Wellness & Games Components
import RelaxGames from './components/wellness/RelaxGames';
import BubblePop from './components/wellness/BubblePop';

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <div className={`app-container ${theme} pt-24`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/affirmations" element={<Affirmations />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/sounds" element={<Sounds />} />
          <Route path="/sounds/:category" element={<SoundCategory />} />
          
          {/* New Relax Games Routes */}
          <Route path="/relax-games" element={<RelaxGames />} />
          <Route path="/relax-games/bubble-pop" element={<BubblePop />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;