import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker with aggressive update strategy
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);

      // Check for updates every time page loads
      registration.update();

      // If there's an active worker, we're good
      if (registration.active) return;

      // If there's a new worker, wait for it to be ready, then reload
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            // Clear all caches and reload
            caches.keys().then(keys => {
              keys.forEach(key => caches.delete(key));
            }).then(() => {
              window.location.reload();
            });
          }
        });
      });
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
