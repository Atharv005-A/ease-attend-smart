export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  profileImage?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  sessionType: 'theoretical' | 'practical';
  subject: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: 'ble' | 'manual' | 'task';
  taskSubmission?: TaskSubmission;
}

export interface TaskSubmission {
  id: string;
  studentId: string;
  files: string[];
  description: string;
  submittedAt: string;
  verified: boolean;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'medical' | 'personal' | 'emergency' | 'other';
  proofDocument?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'exam' | 'assignment' | 'holiday' | 'event';
}

export interface AttendanceStats {
  totalClasses: number;
  attended: number;
  percentage: number;
  theoretical: { total: number; attended: number };
  practical: { total: number; attended: number };
}

export interface RiskPrediction {
  studentId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  attendancePercentage: number;
  predictedEndPercentage: number;
  alerts: string[];
  recommendations: string[];
}

export interface BLEDevice {
  id: string;
  name: string;
  signalStrength: number;
  isConnected: boolean;
  lastSeen: string;
}
