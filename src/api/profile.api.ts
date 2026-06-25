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
  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  authSession.updateProfile(data as AuthProfile);
  return data as AuthProfile;
};

export const getMobileProfile = () => requestProfile('GET');

export const updateMobileProfile = (request: UpdateProfileRequest) =>
  requestProfile('PATCH', request);
