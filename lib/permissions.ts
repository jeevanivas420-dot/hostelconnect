import { UserRole } from '@/types/auth';

export function isStudent(role?: UserRole | null): boolean {
  return role === 'STUDENT';
}

export function isWarden(role?: UserRole | null): boolean {
  return role === 'WARDEN';
}

export function canApproveLeave(role?: UserRole | null): boolean {
  return role === 'WARDEN';
}

export function canManageMessMenu(role?: UserRole | null): boolean {
  return role === 'WARDEN';
}

export function canPostAnnouncements(role?: UserRole | null): boolean {
  return role === 'WARDEN';
}

export function canLogParcels(role?: UserRole | null): boolean {
  return role === 'WARDEN';
}

export function canResolveComplaints(role?: UserRole | null): boolean {
  return role === 'WARDEN';
}
