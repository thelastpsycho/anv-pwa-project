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

export async function getWifiCredentials(): Promise<WifiResponse> {
  try {
    const response = await fetch("/api/odbc/get_wifi/");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wifi credentials:", error);
    throw error;
  }
}
