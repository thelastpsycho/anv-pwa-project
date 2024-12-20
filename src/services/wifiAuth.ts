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

export async function authenticateWithWifi(
  roomNumber: string,
  password: string
): Promise<boolean> {
  try {
    const response = await fetch('/odbc/get_wifi', {
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

    return !!credential;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Unable to authenticate. Please try again.');
  }
}
