import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Bluetooth,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { mockStudents, mockAttendanceRecords, mockLeaveRequests, getWeeklyData, getMonthlyData, getRiskPrediction } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const TeacherDashboard: React.FC = () => {
  const [bleActive, setBleActive] = useState(true);
  
  const todayAttendance = {
    present: 42,
    absent: 6,
    late: 2,
    total: 50
  };

  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();
  
  const pieData = [
    { name: 'Present', value: todayAttendance.present, color: 'hsl(142, 76%, 36%)' },
    { name: 'Absent', value: todayAttendance.absent, color: 'hsl(0, 84%, 60%)' },
    { name: 'Late', value: todayAttendance.late, color: 'hsl(38, 92%, 50%)' },
  ];

  const atRiskStudents = mockStudents.filter(s => {
    const risk = getRiskPrediction(s.id);
    return risk.riskLevel === 'high' || risk.riskLevel === 'critical';
  });

  const pendingLeaves = mockLeaveRequests.filter(l => l.status === 'pending');

  return (
    <Sidebar>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's today's overview.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${bleActive ? 'bg-success/10' : 'bg-muted'}`}>
              <div className="relative">
                <Bluetooth className={`w-5 h-5 ${bleActive ? 'text-success' : 'text-muted-foreground'}`} />
                {bleActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
                )}
              </div>
              <span className={`text-sm font-medium ${bleActive ? 'text-success' : 'text-muted-foreground'}`}>
                {bleActive ? 'BLE Beacon Active' : 'BLE Inactive'}
              </span>
            </div>
            <Button
              variant={bleActive ? 'outline' : 'gradient'}
              onClick={() => setBleActive(!bleActive)}
            >
              {bleActive ? 'Stop Beacon' : 'Start Beacon'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="stat" className="bg-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Present Today</p>
                  <p className="text-3xl font-bold text-success">{todayAttendance.present}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((todayAttendance.present / todayAttendance.total) * 100)}% of class
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Absent Today</p>
                  <p className="text-3xl font-bold text-destructive">{todayAttendance.absent}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((todayAttendance.absent / todayAttendance.total) * 100)}% of class
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <UserX className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Late Arrivals</p>
                  <p className="text-3xl font-bold text-warning">{todayAttendance.late}</p>
                  <p className="text-xs text-muted-foreground mt-1">Within grace period</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-primary">{todayAttendance.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">In your classes</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Weekly Attendance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="present" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Today's Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* At Risk Students */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                At-Risk Students
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudents.slice(0, 4).map((student) => {
                  const risk = getRiskPrediction(student.id);
                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.studentId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          risk.riskLevel === 'critical' ? 'destructive' :
                          risk.riskLevel === 'high' ? 'destructive' :
                          risk.riskLevel === 'medium' ? 'secondary' : 'default'
                        }>
                          {risk.attendancePercentage}%
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">{risk.riskLevel} risk</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pending Leave Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-info" />
                Pending Leave Requests
              </CardTitle>
              <Badge variant="secondary">{pendingLeaves.length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeaveRequests.map((leave) => (
                  <div key={leave.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{leave.studentName}</p>
                      <Badge variant={
                        leave.status === 'approved' ? 'default' :
                        leave.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {leave.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{leave.reason}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {leave.startDate} - {leave.endDate}
                      </p>
                      {leave.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="success">Approve</Button>
                          <Button size="sm" variant="outline">Reject</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Sidebar>
  );
};

export default TeacherDashboard;
