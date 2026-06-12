import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { tokenService } from '../services/auth/token.service';
import {
  CreateIssueReportRequest,
  CreateIssueReportResponse,
  IssueReport,
  LocalIssueReportDocument,
  UploadIssueReportDocumentsResponse,
} from '../types/report.types';

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

  if ('message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }

  const values = Object.values(payload);
  if (!values.length) {
    return 'Something went wrong. Please try again.';
  }

  return values.map(value => getErrorMessage(value)).join('\n');
};

type JsonRequestOptions = {
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: string;
};

const requestJson = async <TResponse>(
  endpoint: string,
  options: JsonRequestOptions,
): Promise<TResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    };
    const token = tokenService.getToken();

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
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

export const createIssueReport = (request: CreateIssueReportRequest) =>
  requestJson<CreateIssueReportResponse>(API_ENDPOINTS.mobileReportIssue, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: request.description.trim(),
    }),
  });

export const getIssueReports = () =>
  requestJson<IssueReport[]>(API_ENDPOINTS.mobileReportIssue, {
    method: 'GET',
  });

export const uploadIssueReportDocuments = (
  reportId: string,
  files: LocalIssueReportDocument[],
) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files[]', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);
  });

  return requestJson<UploadIssueReportDocumentsResponse>(
    API_ENDPOINTS.mobileReportIssueDocuments(reportId),
    {
      method: 'POST',
      body: formData as unknown as string,
    },
  );
};
