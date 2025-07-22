import { ref } from 'vue';

const AUTH_STORAGE_KEY = 'wifi_auth';
const AUTH_EXPIRY_DAYS = 3;
const AUTH_CONFIG = {
  BASE_URL: 'https://pms-radius.anvayabali.com/odbc/get_wifi/'
} as const;

const isAuthenticated = ref(false);

// Load auth state from storage
const loadStoredAuth = () => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      const { expiry, roomNumber } = JSON.parse(stored);
      if (new Date().getTime() < expiry) {
        isAuthenticated.value = true;
        return { roomNumber };
      }
    } catch (e) {
      console.error("Error parsing stored auth:", e);
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return null;
};

// Save auth state with expiry
const saveAuthState = (roomNumber: string) => {
  const expiry = new Date().getTime() + (AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ expiry, roomNumber }));
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
  'ak': 'ak13',
} as const;

export async function authenticateWithWifi(
  username: string,
  password: string
): Promise<boolean> {
  try {
    // Check stored auth first
    if (loadStoredAuth()) {
      console.log('[WifiAuth] Using stored authentication');
      return true;
    }

    // Check admin credentials
    const normalizedUsername = username.toLowerCase();
    if (normalizedUsername in ADMIN_CREDENTIALS && 
        ADMIN_CREDENTIALS[normalizedUsername as keyof typeof ADMIN_CREDENTIALS] === password) {
      console.log('[WifiAuth] Authenticated as admin:', normalizedUsername);
      saveAuthState(username);
      return true;
    }

    // Fetch wifi credentials from the new API
    console.log('[WifiAuth] Fetching wifi credentials from API:', AUTH_CONFIG.BASE_URL);
    const response = await fetch(AUTH_CONFIG.BASE_URL);
    
    if (!response.ok) {
      console.error('[WifiAuth] Failed to fetch wifi credentials:', response.status, response.statusText);
      throw new Error('Failed to fetch wifi credentials');
    }

    const wifiData: WifiResponse = await response.json();
    console.log('[WifiAuth] API response data:', wifiData);
    console.log('[WifiAuth] Input username:', username, 'Input password:', password);
    
    // Find matching credentials
    const matchingCredential = wifiData.data.find(
      cred => cred.username.trim().toLowerCase() === username.trim().toLowerCase() && 
              cred.value === password
    );
    console.log('[WifiAuth] Matching credential:', matchingCredential);

    if (matchingCredential) {
      console.log('[WifiAuth] Authenticated successfully for user:', username);
      saveAuthState(username);
      return true;
    }

    console.warn('[WifiAuth] No matching credentials found for user:', username);
    return false;
  } catch (error) {
    console.error('[WifiAuth] Authentication error:', error);
    throw new Error('Unable to authenticate. Please try again.');
  }
}

export const useWifiAuth = () => {
  const authData = loadStoredAuth();
  return {
    isAuthenticated: isAuthenticated.value,
    roomNumber: authData?.roomNumber || null
  };
};