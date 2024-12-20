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
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WifiResponse = await response.json();
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
      throw new Error(
        "Unable to connect to authentication service. Please try again later."
      );
    }
    throw error;
  }
}
