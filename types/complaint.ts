export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ComplaintCategory = 'ELECTRICAL' | 'PLUMBING' | 'CARPENTRY' | 'CLEANLINESS' | 'WIFI' | 'MESS' | 'OTHER';

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  updatedBy: string;
  updaterRole: 'STUDENT' | 'WARDEN' | 'STAFF';
  message: string;
  statusChange?: ComplaintStatus;
  createdAt: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName?: string;
  roomNumber?: string;
  block?: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  imageUrl?: string;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
  updates?: ComplaintUpdate[];
}
