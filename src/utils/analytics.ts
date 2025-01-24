declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let isInitialized = false;

export function initializeGoogleAnalytics() {
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
  
  gtagScript.onload = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
    isInitialized = true;
  };

  document.head.appendChild(gtagScript);
}

export function trackEvent(category: string, action: string, label?: string) {
  if (!isInitialized || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
  });
} 