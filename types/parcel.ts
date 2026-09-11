export type ParcelStatus = 'ARRIVED' | 'COLLECTED' | 'RETURNED';

export interface Parcel {
  id: string;
  studentId: string;
  studentName?: string;
  roomNumber?: string;
  trackingNumber: string;
  courierCompany: string;
  receivedByWardenId?: string;
  arrivalDate: string;
  collectionDate?: string;
  otpCode?: string;
  status: ParcelStatus;
  notes?: string;
  createdAt: string;
}
