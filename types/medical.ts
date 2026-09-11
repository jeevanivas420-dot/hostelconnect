export type MedicalUrgency = 'ROUTINE' | 'MODERATE' | 'URGENT' | 'CRITICAL';
export type MedicalStatus = 'SUBMITTED' | 'ATTENDED' | 'HOSPITALIZED' | 'RESOLVED';

export interface MedicalRequest {
  id: string;
  studentId: string;
  studentName?: string;
  roomNumber?: string;
  symptoms: string;
  urgency: MedicalUrgency;
  temperature?: string;
  requiresAmbulance: boolean;
  status: MedicalStatus;
  firstAidGiven?: string;
  doctorNotes?: string;
  assignedMaid?: string;
  roomFoodDelivery?: boolean;
  dietNotes?: string;
  createdAt: string;
  updatedAt: string;
}
