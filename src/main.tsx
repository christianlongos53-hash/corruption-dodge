import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { getChibiAvatarDataUrl } from './game/sprites/ChibiSprites';

// Dynamically set BingBong (Red Dodger / vong) chibi avatar as page favicon
try {
  const bingBongFavicon = getChibiAvatarDataUrl('vong', 64);
  const existingFavicon = document.getElementById('app-favicon') as HTMLLinkElement | null;
  if (existingFavicon && bingBongFavicon) {
    existingFavicon.href = bingBongFavicon;
  }
} catch (e) {
  console.warn('Could not set dynamic favicon:', e);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
