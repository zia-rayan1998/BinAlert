export enum UserRole {
  CITIZEN = 'CITIZEN',
  EMPLOYEE = 'EMPLOYEE',
  EMPLOYER = 'EMPLOYER' // Municipality
}

export enum ReportStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  RESOLVED = 'RESOLVED'
}

export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL' // e.g., Fire
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface WasteReport {
  id: string;
  imageUrl: string;
  timestamp: number;
  location: GeoLocation;
  status: ReportStatus;
  urgency: UrgencyLevel;
  wasteType: string[]; // e.g., ['organic', 'plastic']
  overflowLevel: number; // 0-100
  aiAnalysisText: string;
  reporterId: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  points: number; // Gamification
  avatar: string;
}