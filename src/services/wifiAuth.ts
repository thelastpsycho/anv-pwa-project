import { ref } from 'vue';

const AUTH_STORAGE_KEY = 'wifi_auth';
const AUTH_EXPIRY_DAYS = 3;

const isAuthenticated = ref(false);

// Load auth state from storage
const loadStoredAuth = () => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    const { expiry } = JSON.parse(stored);
    if (new Date().getTime() < expiry) {
      isAuthenticated.value = true;
      return true;
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return false;
};

// Save auth state with expiry
const saveAuthState = () => {
  const expiry = new Date().getTime() + (AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ expiry }));
  isAuthenticated.value = true;
};

interface WifiCredential {
  id: string;
  username: string;
  attribute: string;
  op: string;
  value: string;
  date: string;
}

interface WifiResponse {
  data: WifiCredential[];
  status: number;
  description: string;
}

// Admin credentials list
const ADMIN_CREDENTIALS = {
  'oka': 'oka11',
  'suwantra': 'ketut11',
  'antara': 'antara11',
  'ayin': 'kiano24',
  'gede':'gede13',
} as const;

export async function authenticateWithWifi(
  roomNumber: string,
  password: string
): Promise<boolean> {
  try {
    // Check stored auth first
    if (loadStoredAuth()) {
      return true;
    }

    // Check admin credentials
    const normalizedUsername = roomNumber.toLowerCase();
    if (normalizedUsername in ADMIN_CREDENTIALS && 
        ADMIN_CREDENTIALS[normalizedUsername as keyof typeof ADMIN_CREDENTIALS] === password) {
      saveAuthState();
      return true;
    }

    // Use different endpoints for dev and prod
    const endpoint = import.meta.env.DEV 
      ? '/odbc/get_wifi'  // This will be proxied by Vite
      : '/.netlify/functions/wifi-proxy';

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data: WifiResponse = await response.json();
    
    // Find matching credential
    const credential = data.data.find(
      (cred) => cred.username.trim() === roomNumber && cred.value === password
    );

    if (credential) {
      saveAuthState();
    }

    return !!credential;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Unable to authenticate. Please try again.');
  }
}

// Export auth state for components
export const useWifiAuth = () => {
  loadStoredAuth();
  return {
    isAuthenticated,
  };
};
