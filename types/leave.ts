export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveType = 'HOME' | 'OUTING' | 'EMERGENCY' | 'VACATION' | 'ACADEMIC';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName?: string;
  roomNumber?: string;
  block?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  destinationAddress: string;
  parentConsent: boolean;
  status: LeaveStatus;
  wardenRemarks?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}
