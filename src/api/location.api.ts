import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { tokenService } from '../services/auth/token.service';

export type StateOption = {
  id: number;
  name: string;
};

const parseApiResponse = async (response: Response) => {
  const rawText = await response.text();
  const contentType = response.headers.get('content-type') || '';

  if (!rawText) {
    return null;
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error('The server returned invalid state master data.');
    }
  }

  const trimmedText = rawText.trim();
  if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
    try {
      return JSON.parse(trimmedText);
    } catch {
      throw new Error('The server returned invalid state master data.');
    }
  }

  if (trimmedText.startsWith('<')) {
    throw new Error(
      response.status === 401 || response.status === 403
        ? 'Your session has expired. Please log in again.'
        : 'State list is not available from the server. Please check the API URL and backend deployment.',
    );
  }

  return trimmedText;
};

const requestLocationMaster = async <T>(params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  const token = tokenService.getToken();
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.mobileLocationMaster}?${query}`,
    { headers },
  );
  const data = await parseApiResponse(response);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? String(data.message)
        : 'Could not load location master data.';
    throw new Error(message);
  }

  return data as T;
};

export const getStates = async () => {
  const data = await requestLocationMaster<{ states: StateOption[] }>({
    level: 'states',
  });
  return data.states;
};
