export type IssueReportDocument = {
  id: string;
  url: string;
  original_name: string;
  uploaded_at: string;
};

export type LocalIssueReportDocument = {
  uri: string;
  name: string;
  type: string;
  size?: number | null;
};

export type IssueReport = {
  report_id: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  attachments: IssueReportDocument[];
  created_at: string;
  updated_at: string;
};

export type CreateIssueReportRequest = {
  description: string;
};

export type CreateIssueReportResponse = {
  success: boolean;
  report_id: string;
};

export type UploadIssueReportDocumentsResponse = {
  success: boolean;
  files: IssueReportDocument[];
};
