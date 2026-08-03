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
  splashEl.classList.add('splash-hidden');
  setTimeout(() => splashEl.remove(), 350);
}

const swUrl = `${import.meta.env.BASE_URL}sw.js`;
if ('serviceWorker' in navigator) {
  // When a newly-activated service worker takes control (i.e. a fresh
  // deploy has landed), reload once so the page picks up the new build
  // immediately instead of silently keeping the old cached version.
  let hasReloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hasReloaded) return;
    hasReloaded = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl, { scope: import.meta.env.BASE_URL })
      .then((registration) => {
        // Check for a newer sw.js on every load so updates are picked up
        // promptly rather than only whenever the browser happens to check.
        registration.update().catch(() => {});
      })
      .catch((err) => console.log('SW registration failed: ', err));
  });
}

