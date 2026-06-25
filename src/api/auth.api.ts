import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import {
  AuthResponse,
  LoginRequest,
  PasswordChangeRequest,
  SignupRequest,
} from '../types/auth.types';
import { authSession } from '../services/auth/session.service';

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

  const values = Object.values(payload);
  if (!values.length) {
    return 'Something went wrong. Please try again.';
  }

  return values.map(value => getErrorMessage(value)).join('\n');
};

const postAuth = async <TBody extends object>(
  endpoint: string,
  body: TBody,
): Promise<AuthResponse> => {
  let response: Awaited<ReturnType<typeof fetch>>;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new Error(
      `Could not reach the Django server at ${API_BASE_URL}. Update src/environment.ts if your laptop IP changed.`,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  authSession.setAuth(data);
  return data;
};

const postJson = async <TBody extends object, TResponse extends object>(
  endpoint: string,
  body: TBody,
): Promise<TResponse> => {
  let response: Awaited<ReturnType<typeof fetch>>;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new Error(
      `Could not reach the Django server at ${API_BASE_URL}. Update src/environment.ts if your laptop IP changed.`,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data;
};

const normalizeLoginId = (value: string) => value.trim().toLowerCase();

const buildSignupBody = (request: SignupRequest) => {
  const loginId = normalizeLoginId(request.login_id);
  const isEmail = loginId.includes('@');
  const phoneNumber = loginId.replace(/[^\d+]/g, '');

  return {
    username: isEmail ? loginId : phoneNumber,
    full_name: request.full_name.trim(),
    email_address: isEmail ? loginId : '',
    phone_number: isEmail ? '' : phoneNumber,
    gender: request.gender,
    password: request.password,
    referral_code: request.referral_code?.trim().toUpperCase() || '',
  };
};

export const loginUser = (request: LoginRequest) =>
  postAuth(API_ENDPOINTS.mobileLogin, {
    login_id: normalizeLoginId(request.login_id),
    password: request.password,
  });

export const signupUser = (request: SignupRequest) =>
  postAuth(API_ENDPOINTS.mobileSignup, buildSignupBody(request));

export const changePassword = (request: PasswordChangeRequest) =>
  postJson<PasswordChangeRequest, { message: string }>(
    API_ENDPOINTS.mobileChangePassword,
    {
      login_id: normalizeLoginId(request.login_id),
      new_password: request.new_password,
      confirm_password: request.confirm_password,
    },
  );
