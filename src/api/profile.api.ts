import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { authSession } from '../services/auth/session.service';
import { tokenService } from '../services/auth/token.service';
import { AuthProfile, Gender } from '../types/auth.types';

export type UpdateProfileRequest = {
  full_name: string;
  dob: string;
  gender: Gender;
  nationality: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone_number: string;
  email_address: string;
};

const getErrorMessage = (payload: unknown): string => {
  if (typeof payload === 'string') {
    return payload;
  }
  if (Array.isArray(payload)) {
    return payload.map(getErrorMessage).join('\n');
  }
  if (!payload || typeof payload !== 'object') {
    return 'Something went wrong. Please try again.';
  }
  if ('detail' in payload && typeof payload.detail === 'string') {
    return payload.detail;
  }
  const values = Object.values(payload);
  return values.length
    ? values.map(value => getErrorMessage(value)).join('\n')
    : 'Something went wrong. Please try again.';
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
      throw new Error('The server returned invalid profile data. Please try again.');
    }
  }

  const trimmedText = rawText.trim();
  if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
    try {
      return JSON.parse(trimmedText);
    } catch {
      throw new Error('The server returned invalid profile data. Please try again.');
    }
  }

  if (trimmedText.startsWith('<')) {
    throw new Error(
      response.status === 401 || response.status === 403
        ? 'Your session has expired. Please log in again.'
        : 'The server returned a web page instead of profile data. Please check the app API URL and backend deployment.',
    );
  }

  return trimmedText;
};

const requestProfile = async (
  method: 'GET' | 'PATCH',
  body?: UpdateProfileRequest,
) => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  const token = tokenService.getToken();
  if (token) {
    headers.Authorization = `Token ${token}`;
  }
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.mobileProfile}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data) || 'Profile update failed. Please try again.');
  }

  authSession.updateProfile(data as AuthProfile);
  return data as AuthProfile;
};

export const getMobileProfile = () => requestProfile('GET');

export const updateMobileProfile = (request: UpdateProfileRequest) =>
  requestProfile('PATCH', request);
