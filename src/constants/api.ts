import { ENVIRONMENT } from '../environment';

export const API_BASE_URL = ENVIRONMENT.API_BASE_URL;

export const API_ENDPOINTS = {
  mobileLogin: '/api/mobile/login/',
  mobileSignup: '/api/mobile/signup/',
  mobileChangePassword: '/api/mobile/change-password/',
  mobileReportIssue: '/api/mobile/report-issue/',
  mobileReportIssueDocuments: (reportId: string) =>
    `/api/mobile/report-issue/${encodeURIComponent(reportId)}/documents/`,
} as const;
