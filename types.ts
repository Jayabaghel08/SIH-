
export enum Page {
  Home = 'Home',
  Learn = 'Learn',
  Status = 'Status',
  ActionPlan = 'ActionPlan',
  Grievance = 'Grievance',
}

export interface StatusResult {
  aadhaarNumber: string;
  isSeeded: boolean;
  bankName: string | null;
  lastUpdated: string | null;
  scholarshipStatus: 'Approved' | 'Pending' | 'Rejected' | 'Not Applied';
  scholarshipName: string | null;
}

export interface Grievance {
    type: 'Not Seeded' | 'Multiple Accounts' | 'Details Mismatch' | 'Other';
    description: string;
    aadhaar: string;
}

export interface GrievanceTicket extends Grievance {
    ticketId: string;
    status: 'Submitted';
    submittedAt: string;
}
