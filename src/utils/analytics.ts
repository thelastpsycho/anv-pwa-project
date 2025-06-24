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
    
    // Configure Google Analytics with domain-specific settings
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      // Domain configuration for the new domain
      custom_map: {
        'custom_parameter_1': 'domain',
        'custom_parameter_2': 'subdomain'
      },
      // Set the domain for tracking
      page_location: window.location.href,
      // Enable cross-domain tracking if needed
      allow_google_signals: true,
      allow_ad_personalization_signals: true,
      // Custom dimensions for domain tracking
      custom_parameter_1: window.location.hostname,
      custom_parameter_2: window.location.hostname.split('.')[0] || 'main'
    });
    
    isInitialized = true;
  };

  document.head.appendChild(gtagScript);
}

export function trackEvent(category: string, action: string, label?: string) {
  if (!isInitialized || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    // Add domain information to events
    custom_parameter_1: window.location.hostname,
    custom_parameter_2: window.location.hostname.split('.')[0] || 'main'
  });
}

// New function to track domain-specific events
export function trackDomainEvent(category: string, action: string, label?: string, value?: number) {
  if (!isInitialized || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    custom_parameter_1: window.location.hostname,
    custom_parameter_2: window.location.hostname.split('.')[0] || 'main'
  });
}

// Function to track page views with domain information
export function trackPageView(pageTitle?: string, pagePath?: string) {
  if (!isInitialized || !window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_title: pageTitle || document.title,
    page_path: pagePath || window.location.pathname,
    page_location: window.location.href,
    custom_parameter_1: window.location.hostname,
    custom_parameter_2: window.location.hostname.split('.')[0] || 'main'
  });
} 