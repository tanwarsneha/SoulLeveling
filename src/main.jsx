import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SoundsProvider } from "./context/SoundsContext.jsx";
import { AffirmationsProvider } from "./context/AffirmationsContext.jsx";
import { MoodProvider } from './context/MoodContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AffirmationsProvider>
      <SoundsProvider>
        <MoodProvider>
          <App />
        </MoodProvider>
      </SoundsProvider>
    </AffirmationsProvider>
  </StrictMode>
);
