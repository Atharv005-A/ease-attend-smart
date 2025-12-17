import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { mockStudents, mockAttendanceRecords } from '@/data/mockData';
import { Bluetooth, CheckCircle2, XCircle, Clock, Users, BookOpen, FlaskConical, RefreshCw } from 'lucide-react';

const Attendance: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [bleActive, setBleActive] = useState(true);
  const [sessionType, setSessionType] = useState<'theoretical' | 'practical'>('theoretical');
  const [currentSubject, setCurrentSubject] = useState('Data Structures');

  if (!isAuthenticated || user?.role !== 'teacher') {
    return <Navigate to="/login" replace />;
  }

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <Sidebar>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-muted-foreground">Mark and manage student attendance</p>
          </div>
        </div>

        {/* BLE Control Panel */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`relative p-4 rounded-2xl ${bleActive ? 'bg-success/10' : 'bg-muted'}`}>
                  <Bluetooth className={`w-8 h-8 ${bleActive ? 'text-success' : 'text-muted-foreground'}`} />
                  {bleActive && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-success rounded-full animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">BLE Beacon Status</h3>
                  <p className="text-muted-foreground">
                    {bleActive ? 'Broadcasting - Students can mark attendance' : 'Beacon is inactive'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Session</p>
                  <p className="font-semibold">{currentSubject}</p>
                </div>
                <Button
                  variant={bleActive ? 'outline' : 'gradient'}
                  onClick={() => setBleActive(!bleActive)}
                >
                  {bleActive ? 'Stop Beacon' : 'Start Beacon'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Type Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={sessionType === 'theoretical' ? 'default' : 'outline'}
            onClick={() => setSessionType('theoretical')}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Theoretical
          </Button>
          <Button
            variant={sessionType === 'practical' ? 'default' : 'outline'}
            onClick={() => setSessionType('practical')}
            className="flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4" />
            Practical
          </Button>
          <div className="flex-1" />
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Real-time Attendance List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Real-time Attendance - {todayDate}
              </CardTitle>
              <Badge variant="secondary">{mockStudents.length} students</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((student, index) => {
                    const statuses = ['present', 'present', 'present', 'absent', 'late', 'present', 'present', 'absent'];
                    const status = statuses[index % statuses.length];
                    const times = ['09:02 AM', '09:00 AM', '08:58 AM', '-', '09:15 AM', '09:01 AM', '09:00 AM', '-'];
                    
                    return (
                      <tr key={student.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">{student.name.charAt(0)}</span>
                            </div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{student.studentId}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {status === 'present' && <CheckCircle2 className="w-4 h-4 text-success" />}
                            {status === 'absent' && <XCircle className="w-4 h-4 text-destructive" />}
                            {status === 'late' && <Clock className="w-4 h-4 text-warning" />}
                            <span className={`text-sm capitalize ${
                              status === 'present' ? 'text-success' :
                              status === 'absent' ? 'text-destructive' : 'text-warning'
                            }`}>
                              {status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{times[index % times.length]}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="uppercase text-xs">
                            {status === 'absent' ? 'Manual' : 'BLE'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default Attendance;
