import React, { useState } from 'react';
import { X, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- We need this to route the user

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  if (!isOpen) return null;

  // --- LOCAL STORAGE "LOGIN" ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    // We simulate a tiny network delay so the button animation still looks cool
    setTimeout(() => {
      // 1. Create a local user profile
      const localUser = {
        id: 'user-' + Date.now(),
        email: email,
        display_name: email.split('@')[0], // Uses the first part of their email as a temporary name
      };

      // 2. Save it to the browser
      localStorage.setItem('soul_user', JSON.stringify(localUser));

      // 3. Clean up and route
      setLoading(false);
      onClose();
      
      // If signing up, send to setup. If signing in, send to dashboard.
      if (isSignUp) {
        navigate('/profile-setup');
      } else {
        navigate('/dashboard');
      }
    }, 600); 
  };

  // --- GUEST ACCESS ---
  const handleGuestAccess = () => {
    const guestUser = {
      id: 'guest-123',
      email: 'seeker@soul.com',
      display_name: 'Seeker',
    };
    localStorage.setItem('soul_user', JSON.stringify(guestUser));
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#1E1E24] border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {isSignUp ? "Begin Your Journey" : "Welcome Back"}
          </h2>
          <p className="text-white/50 text-sm">
            {isSignUp ? "Create a local profile to save your progress." : "Enter the temple to resume your training."}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-yellow-500/50 focus:bg-black/40 transition-all placeholder:text-white/10"
                placeholder="seeker@soul.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-yellow-500/50 focus:bg-black/40 transition-all placeholder:text-white/10"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-yellow-500 text-black font-bold uppercase tracking-wider hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Create Profile" : "Enter Dashboard")}
            {!loading && <ArrowRight size={18} />}
          </button>
          
          {/* --- NEW GUEST BUTTON --- */}
          <button 
            type="button"
            onClick={handleGuestAccess}
            className="w-full py-4 rounded-xl bg-white/5 text-white font-bold uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center mt-2"
          >
            Continue without Sign In
          </button>

        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-white/40 hover:text-yellow-500 transition-colors"
          >
            {isSignUp ? "Already have a profile? Sign In" : "New here? Create Profile"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;