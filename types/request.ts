export type RequestType = 'LOST_ITEM' | 'FOUND_ITEM' | 'ROOM_CHANGE' | 'FACILITY_ACCESS' | 'GENERAL';
export type RequestStatus = 'OPEN' | 'RESOLVED' | 'CLOSED';

export interface LostFoundItem {
  id: string;
  userId: string;
  userName?: string;
  userPhone?: string;
  type: 'LOST' | 'FOUND';
  title: string;
  description: string;
  location: string;
  itemDate: string;
  imageUrl?: string;
  contactInfo: string;
  status: RequestStatus;
  createdAt: string;
}

export interface GeneralRequest {
  id: string;
  studentId: string;
  type: RequestType;
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
