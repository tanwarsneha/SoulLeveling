import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import AuthModal from './AuthModal'; 

const Navbar = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // --- LOCAL USER STATE ---
  const [localUser, setLocalUser] = useState(null);
  const location = useLocation();

  // Watch for local storage changes to keep the Navbar updated
  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('soul_user');
      if (stored) {
        setLocalUser(JSON.parse(stored));
      } else {
        setLocalUser(null);
      }
    };

    checkUser();
    // Re-check every time the route changes so it instantly updates when you "login"
  }, [location.pathname]); 

  // --- LOCAL SIGN OUT ---
  const handleSignOut = () => {
    localStorage.removeItem('soul_user'); 
    setLocalUser(null);
    window.location.href = '/'; 
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-[var(--bg-core)]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="text-yellow-500 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-xl tracking-tight">Soul Leveling</span>
          </Link>

          {/* DESKTOP LINKS - HIDDEN IF NOT LOGGED IN */}
          {localUser && (
            <div className="hidden md:flex items-center gap-8">
              <Link to="/dashboard" className={`text-sm font-medium hover:text-yellow-500 transition-colors ${location.pathname === '/dashboard' ? 'text-yellow-500' : 'opacity-60'}`}>Dashboard</Link>
              <Link to="/analytics" className="text-sm font-medium opacity-60 hover:text-yellow-500 transition-colors">Analytics</Link>
              <Link to="/meditation" className="text-sm font-medium opacity-60 hover:text-yellow-500 transition-colors">Wellness</Link>
            </div>
          )}

          {/* RIGHT SIDE ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100">
              {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>

            {/* AUTH BUTTONS */}
            {localUser ? (
              // If Logged In: Show User Circle + Sign Out
              <div className="flex items-center gap-3">
                 <div 
                   className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-yellow-500 font-bold text-xs"
                   title={localUser.display_name}
                  >
                    {localUser.display_name ? localUser.display_name[0].toUpperCase() : localUser.email[0].toUpperCase()}
                 </div>
                 <button onClick={handleSignOut} title="Sign Out" className="opacity-50 hover:opacity-100 hover:text-red-400 transition-colors">
                    <LogOut size={18} />
                 </button>
              </div>
            ) : (
              // If Logged Out: Show Sign In Button
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2 rounded-full bg-white text-black font-bold text-sm hover:bg-yellow-400 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button className="md:hidden p-2 opacity-60" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[var(--bg-core)] border-b border-white/10 p-6 flex flex-col gap-4 animate-fade-in">
            {localUser ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Dashboard</Link>
                <Link to="/analytics" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium opacity-60">Analytics</Link>
                <Link to="/meditation" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium opacity-60">Wellness</Link>
                <div className="h-px bg-white/10 my-2"></div>
                <button onClick={handleSignOut} className="text-left text-red-400 font-medium flex items-center gap-2">
                   <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-white text-black font-bold"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>

      {/* AUTH MODAL COMPONENT */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;