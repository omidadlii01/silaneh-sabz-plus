import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const splashEl = document.getElementById('app-splash');
if (splashEl) {
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      splashEl.classList.add('splash-hidden');
      setTimeout(() => splashEl.remove(), 400);
    }, 400);
  });
}

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.log('SW registration failed: ', err));
  });
} else if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.log('SW registration failed: ', err));
  });
}

