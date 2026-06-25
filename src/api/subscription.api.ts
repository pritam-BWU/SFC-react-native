import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { tokenService } from '../services/auth/token.service';
import {
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
} from '../types/subscription.types';

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
  if (!values.length) {
    return 'Something went wrong. Please try again.';
  }

  return values.map(value => getErrorMessage(value)).join('\n');
};

const postJson = async <TBody extends object, TResponse>(
  endpoint: string,
  body: TBody,
): Promise<TResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const token = tokenService.getToken();
    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(getErrorMessage(data));
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      throw error;
    }

    throw new Error(
      `Could not reach the Django server at ${API_BASE_URL}. Update src/environment.ts if your laptop IP changed.`,
    );
  } finally {
    clearTimeout(timeoutId);
  }
};

export const createPaymentOrder = (request: CreatePaymentOrderRequest) =>
  postJson<CreatePaymentOrderRequest, CreatePaymentOrderResponse>(
    API_ENDPOINTS.mobilePaymentCreateOrder,
    request,
  );

export const confirmPayment = (request: ConfirmPaymentRequest) =>
  postJson<ConfirmPaymentRequest, ConfirmPaymentResponse>(
    API_ENDPOINTS.mobilePaymentConfirm,
    request,
  );
