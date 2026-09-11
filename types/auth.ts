export type UserRole = 'STUDENT' | 'WARDEN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfile extends UserProfile {
  role: 'STUDENT';
  registerNumber: string;
  roomNumber: string;
  block: string;
  year: number;
  department: string;
  parentPhone?: string;
  isHostelResident: boolean;
}

export interface WardenProfile extends UserProfile {
  role: 'WARDEN';
  employeeId: string;
  assignedBlock: string;
  officeLocation?: string;
}

export interface AuthSession {
  user: UserProfile | null;
  student?: StudentProfile | null;
  warden?: WardenProfile | null;
  token?: string | null;
}
