// Function to register for periodic sync
export async function registerPeriodicSync() {
  if ('periodicSync' in navigator.serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.periodicSync.register('update-content', {
        minInterval: 24 * 60 * 60 * 1000 // 24 hours
      });
      console.log('Periodic sync registered');
    } catch (error) {
      console.error('Periodic sync registration failed:', error);
    }
  }
}

// Function to request push notification permission
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
      });
      console.log('Push notification subscription:', subscription);
      return subscription;
    }
  } catch (error) {
    console.error('Push notification permission request failed:', error);
  }
}

// Function to initialize PWA features
export async function initializePWA() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Register for periodic sync
      await registerPeriodicSync();
      
      // Request notification permission
      await requestNotificationPermission();
      
      console.log('PWA features initialized successfully');
    } catch (error) {
      console.error('PWA initialization failed:', error);
    }
  }
} 