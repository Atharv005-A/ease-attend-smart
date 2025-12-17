import { AttendanceRecord, LeaveRequest, Event, AttendanceStats, RiskPrediction, User } from '@/types';

export const mockStudents: User[] = [
  { id: '2', name: 'John Smith', email: 'john@student.com', role: 'student', studentId: 'STU2024001', department: 'Computer Science' },
  { id: '3', name: 'Emma Wilson', email: 'emma@student.com', role: 'student', studentId: 'STU2024002', department: 'Computer Science' },
  { id: '4', name: 'Michael Brown', email: 'michael@student.com', role: 'student', studentId: 'STU2024003', department: 'Computer Science' },
  { id: '5', name: 'Sarah Davis', email: 'sarah@student.com', role: 'student', studentId: 'STU2024004', department: 'Computer Science' },
  { id: '6', name: 'James Taylor', email: 'james@student.com', role: 'student', studentId: 'STU2024005', department: 'Computer Science' },
  { id: '7', name: 'Olivia Martinez', email: 'olivia@student.com', role: 'student', studentId: 'STU2024006', department: 'Computer Science' },
  { id: '8', name: 'William Anderson', email: 'william@student.com', role: 'student', studentId: 'STU2024007', department: 'Computer Science' },
  { id: '9', name: 'Sophia Thomas', email: 'sophia@student.com', role: 'student', studentId: 'STU2024008', department: 'Computer Science' },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: '1', studentId: '2', studentName: 'John Smith', date: '2024-01-15', sessionType: 'theoretical', subject: 'Data Structures', status: 'present', markedBy: 'ble' },
  { id: '2', studentId: '2', studentName: 'John Smith', date: '2024-01-16', sessionType: 'practical', subject: 'Data Structures Lab', status: 'present', markedBy: 'task' },
  { id: '3', studentId: '2', studentName: 'John Smith', date: '2024-01-17', sessionType: 'theoretical', subject: 'Algorithms', status: 'absent', markedBy: 'ble' },
  { id: '4', studentId: '3', studentName: 'Emma Wilson', date: '2024-01-15', sessionType: 'theoretical', subject: 'Data Structures', status: 'present', markedBy: 'ble' },
  { id: '5', studentId: '3', studentName: 'Emma Wilson', date: '2024-01-16', sessionType: 'practical', subject: 'Data Structures Lab', status: 'late', markedBy: 'task' },
  { id: '6', studentId: '4', studentName: 'Michael Brown', date: '2024-01-15', sessionType: 'theoretical', subject: 'Data Structures', status: 'absent', markedBy: 'ble' },
  { id: '7', studentId: '5', studentName: 'Sarah Davis', date: '2024-01-15', sessionType: 'theoretical', subject: 'Data Structures', status: 'present', markedBy: 'ble' },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    studentId: '2',
    studentName: 'John Smith',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    reason: 'Medical appointment',
    type: 'medical',
    proofDocument: 'medical_cert.pdf',
    status: 'pending',
    submittedAt: '2024-01-18T10:30:00Z'
  },
  {
    id: '2',
    studentId: '3',
    studentName: 'Emma Wilson',
    startDate: '2024-01-25',
    endDate: '2024-01-25',
    reason: 'Family emergency',
    type: 'emergency',
    status: 'approved',
    submittedAt: '2024-01-17T14:20:00Z'
  },
];

export const mockEvents: Event[] = [
  { id: '1', title: 'Mid-Semester Exam', description: 'Data Structures mid-semester examination', date: '2024-02-15', type: 'exam' },
  { id: '2', title: 'Assignment Due', description: 'Algorithm analysis assignment submission', date: '2024-01-25', type: 'assignment' },
  { id: '3', title: 'Technical Seminar', description: 'Guest lecture on AI/ML', date: '2024-01-30', type: 'event' },
  { id: '4', title: 'Republic Day', description: 'National Holiday', date: '2024-01-26', type: 'holiday' },
];

export const getStudentStats = (studentId: string): AttendanceStats => {
  const studentRecords = mockAttendanceRecords.filter(r => r.studentId === studentId);
  const theoretical = studentRecords.filter(r => r.sessionType === 'theoretical');
  const practical = studentRecords.filter(r => r.sessionType === 'practical');
  
  const presentTheory = theoretical.filter(r => r.status === 'present' || r.status === 'late').length;
  const presentPractical = practical.filter(r => r.status === 'present' || r.status === 'late').length;
  
  const totalAttended = presentTheory + presentPractical;
  const total = studentRecords.length;
  
  return {
    totalClasses: total || 45,
    attended: totalAttended || 38,
    percentage: total ? Math.round((totalAttended / total) * 100) : 84,
    theoretical: { total: theoretical.length || 30, attended: presentTheory || 26 },
    practical: { total: practical.length || 15, attended: presentPractical || 12 }
  };
};

export const getRiskPrediction = (studentId: string): RiskPrediction => {
  const stats = getStudentStats(studentId);
  let riskLevel: RiskPrediction['riskLevel'] = 'low';
  const alerts: string[] = [];
  const recommendations: string[] = [];

  if (stats.percentage < 60) {
    riskLevel = 'critical';
    alerts.push('Critical: Attendance below minimum requirement!');
    alerts.push('Risk of being debarred from exams');
    recommendations.push('Attend all remaining classes without fail');
    recommendations.push('Meet with academic advisor immediately');
  } else if (stats.percentage < 75) {
    riskLevel = 'high';
    alerts.push('Warning: Attendance approaching minimum threshold');
    recommendations.push('Improve attendance to avoid academic penalties');
    recommendations.push('Plan ahead to avoid missing classes');
  } else if (stats.percentage < 85) {
    riskLevel = 'medium';
    alerts.push('Notice: Room for improvement in attendance');
    recommendations.push('Maintain consistency in class attendance');
  } else {
    recommendations.push('Keep up the excellent attendance!');
  }

  return {
    studentId,
    riskLevel,
    attendancePercentage: stats.percentage,
    predictedEndPercentage: Math.max(stats.percentage - 5, 0),
    alerts,
    recommendations
  };
};

export const getWeeklyData = () => [
  { day: 'Mon', present: 45, absent: 5 },
  { day: 'Tue', present: 42, absent: 8 },
  { day: 'Wed', present: 48, absent: 2 },
  { day: 'Thu', present: 44, absent: 6 },
  { day: 'Fri', present: 40, absent: 10 },
];

export const getMonthlyData = () => [
  { week: 'Week 1', attendance: 92 },
  { week: 'Week 2', attendance: 88 },
  { week: 'Week 3', attendance: 95 },
  { week: 'Week 4', attendance: 90 },
];
