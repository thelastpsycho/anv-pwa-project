import { ref } from 'vue';

const AUTH_STORAGE_KEY = 'wifi_auth';
const AUTH_EXPIRY_DAYS = 3;
const AUTH_CONFIG = {
  BASE_URL: 'https://api.hospitality.mykg.id',
  USER_ID: 'iptv-anvaya',
  PASSWORD: 'iptvanvaya',
  HOTEL_ID: '103'
} as const;

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
  'ak': 'ak13',
} as const;

async function getAuthToken() {
  const response = await fetch(`${AUTH_CONFIG.BASE_URL}/api/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "UserId": AUTH_CONFIG.USER_ID,
      "UserPassword": AUTH_CONFIG.PASSWORD,
      "Attribute": 3600,
      "Attribute1": "__EXTENDED_TIME"
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get auth token');
  }

  const data = await response.json();
  return data.access_token;
}

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


    const token = await getAuthToken();

    // Updated hotelId to 103
    const response = await fetch(
      `${AUTH_CONFIG.BASE_URL}/api/IpTv/GuestInformation?hotelId=${AUTH_CONFIG.HOTEL_ID}&userId=${AUTH_CONFIG.USER_ID}&roomNo=${roomNumber}`, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to verify guest');
    }

    const guestData = await response.json();
    
    // Verify guest credentials
    if (guestData && guestData.roomNumber === roomNumber) {
      saveAuthState();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Unable to authenticate. Please try again.');
  }
}


export const useWifiAuth = () => {
  loadStoredAuth();
  return {
    isAuthenticated,
  };
};
