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

const WIFI_API_URL = import.meta.env.VITE_WIFI_API_URL || '/api/odbc/get_wifi';

export async function authenticateWithWifi(
  roomNumber: string,
  password: string
): Promise<boolean> {
  try {
    console.log("Attempting to authenticate with WiFi API...");
    const response = await fetch(WIFI_API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('Response status:', response.status);
      console.error('Response text:', responseText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data: WifiResponse;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.error('Raw response:', responseText);
      throw new Error('Invalid JSON response from server');
    }

    console.log("WiFi API Response:", data);

    // Find matching credential
    const credential = data.data.find(
      (cred) => cred.username.trim() === roomNumber && cred.value === password
    );

    console.log("Found credential:", credential);
    return !!credential;
  } catch (error) {
    console.error("Error authenticating with WiFi credentials:", error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw new Error(
      "Unable to connect to authentication service. Please try again later."
    );
  }
}
