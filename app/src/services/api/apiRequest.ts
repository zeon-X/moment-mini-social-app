import config from '@/config';
import { globalLogout } from '@/utils/logout-handler';
import { getFromSecureStore } from '@/utils/useSecureStorage';

const API_URL = config.apiUrl

/**
 * Basic JSON request
 */
export const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  body?: any
) => {
  try {
    const token = await getFromSecureStore("token");
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : null;

    if (response.status === 401) {
      if (globalLogout.handler) globalLogout.handler();
    }

    if (!response.ok && !data) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    return data
  } catch (error: any) {
    // Handle network errors
    if (error.message === 'Network request failed') {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      throw new Error('Invalid response from server.');
    }

    // Re-throw other errors
    throw error;
  }
}
