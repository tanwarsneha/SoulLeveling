import React, { createContext, useContext, useState, useEffect } from 'react';
import { affirmationGroups } from '../data/affirmations';
import { supabase } from '../services/supabaseClient';

const AffirmationsContext = createContext();

export const useAffirmations = () => useContext(AffirmationsContext);

export const AffirmationsProvider = ({ children }) => {
  // USER SESSION STATE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // DATA STATES
  const [favorites, setFavorites] = useState([]);
  const [config, setConfig] = useState({
    positive: { enabled: true, excludedQuotes: [] },
    gita: { enabled: false, excludedQuotes: [] },
    gratitude: { enabled: false, excludedQuotes: [] }
  });

  // 1. INITIALIZE & LISTEN FOR AUTH CHANGES
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      fetchData(session?.user);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      fetchData(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. FETCH DATA (Logic: If User -> DB, Else -> LocalStorage)
  const fetchData = async (currentUser) => {
    setLoading(true);

    if (currentUser) {
      // --- CLOUD MODE ---
      try {
        // A. Fetch Favorites
        const { data: favData } = await supabase
          .from('user_favorites')
          .select('quote_text');
        
        if (favData) setFavorites(favData.map(f => f.quote_text));

        // B. Fetch Preferences
        const { data: prefData } = await supabase
          .from('user_preferences')
          .select('config')
          .single();

        if (prefData) setConfig(prefData.config);

      } catch (error) {
        console.error('Error fetching cloud data:', error);
      }
    } else {
      // --- LOCAL MODE ---
      const savedFavs = localStorage.getItem('soul_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedConfig = localStorage.getItem('soul_aff_config');
      if (savedConfig) setConfig(JSON.parse(savedConfig));
    }
    setLoading(false);
  };

  // 3. ACTION: TOGGLE FAVORITE
  const toggleFavorite = async (quoteText) => {
    // Optimistic Update (Update UI immediately)
    const isLiked = favorites.includes(quoteText);
    const newFavorites = isLiked 
      ? favorites.filter(t => t !== quoteText) 
      : [...favorites, quoteText];
    
    setFavorites(newFavorites);

    if (user) {
      // Sync to Supabase
      if (isLiked) {
        await supabase.from('user_favorites').delete().match({ user_id: user.id, quote_text: quoteText });
      } else {
        await supabase.from('user_favorites').insert({ user_id: user.id, quote_text: quoteText });
      }
    } else {
      // Sync to LocalStorage
      localStorage.setItem('soul_favorites', JSON.stringify(newFavorites));
    }
  };

  // 4. ACTION: UPDATE CONFIG (Bulk Update)
  const overrideConfig = async (newConfig) => {
    setConfig(newConfig);

    if (user) {
      // Sync to Supabase (Upsert handles Insert or Update)
      await supabase.from('user_preferences').upsert({ 
        user_id: user.id, 
        config: newConfig 
      });
    } else {
      // Sync to LocalStorage
      localStorage.setItem('soul_aff_config', JSON.stringify(newConfig));
    }
  };

  // 5. HELPER: PLAYLIST GENERATOR
  const getDashboardPlaylist = () => {
    let playlist = [];
    Object.keys(affirmationGroups).forEach(key => {
      const groupConfig = config[key];
      if (groupConfig?.enabled) {
        const quotes = affirmationGroups[key].quotes.filter(q => 
          !groupConfig.excludedQuotes.includes(q.text)
        );
        playlist = [...playlist, ...quotes];
      }
    });
    if (playlist.length === 0) return affirmationGroups.positive.quotes;
    return playlist;
  };

  // Pass everything + user + loading state down
  return (
    <AffirmationsContext.Provider value={{ 
      user,
      loading,
      favorites, 
      config, 
      toggleFavorite, 
      overrideConfig,
      getDashboardPlaylist
    }}>
      {children}
    </AffirmationsContext.Provider>
  );
};