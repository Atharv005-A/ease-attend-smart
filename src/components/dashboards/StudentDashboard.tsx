import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bluetooth,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingUp,
  BookOpen,
  FlaskConical,
  Bell,
  ChevronRight
} from 'lucide-react';
import { getStudentStats, getRiskPrediction, mockEvents, mockAttendanceRecords } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bleConnected, setBleConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const stats = getStudentStats(user?.id || '2');
  const risk = getRiskPrediction(user?.id || '2');
  
  const attendanceTrend = [
    { week: 'W1', percentage: 95 },
    { week: 'W2', percentage: 88 },
    { week: 'W3', percentage: 92 },
    { week: 'W4', percentage: 85 },
    { week: 'W5', percentage: 90 },
    { week: 'W6', percentage: stats.percentage },
  ];

  const upcomingEvents = mockEvents.slice(0, 3);
  const recentAttendance = mockAttendanceRecords.filter(r => r.studentId === '2').slice(0, 5);

  const simulateBLEScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setBleConnected(true);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <Sidebar>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Here's your attendance overview</p>
          </div>
          
          {/* BLE Status */}
          <Card className={`px-6 py-4 ${bleConnected ? 'bg-success/5 border-success/20' : 'bg-muted'}`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bluetooth className={`w-8 h-8 ${bleConnected ? 'text-success' : 'text-muted-foreground'}`} />
                {bleConnected && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-success/30 animate-ping" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full" />
                  </>
                )}
              </div>
              <div>
                <p className={`font-medium ${bleConnected ? 'text-success' : 'text-muted-foreground'}`}>
                  {isScanning ? 'Scanning...' : bleConnected ? 'Connected to Class' : 'Not in Class'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {bleConnected ? 'Attendance marked automatically' : 'Tap to scan for class beacon'}
                </p>
              </div>
              {!bleConnected && (
                <Button variant="gradient" size="sm" onClick={simulateBLEScan} disabled={isScanning}>
                  {isScanning ? 'Scanning...' : 'Scan'}
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Risk Alert */}
        {risk.riskLevel !== 'low' && (
          <Card className={`mb-6 ${
            risk.riskLevel === 'critical' ? 'bg-destructive/5 border-destructive/30' :
            risk.riskLevel === 'high' ? 'bg-warning/5 border-warning/30' : 'bg-info/5 border-info/30'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  risk.riskLevel === 'critical' ? 'bg-destructive/10' :
                  risk.riskLevel === 'high' ? 'bg-warning/10' : 'bg-info/10'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    risk.riskLevel === 'critical' ? 'text-destructive' :
                    risk.riskLevel === 'high' ? 'text-warning' : 'text-info'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    risk.riskLevel === 'critical' ? 'text-destructive' :
                    risk.riskLevel === 'high' ? 'text-warning' : 'text-info'
                  }`}>
                    Attendance Alert - {risk.riskLevel.charAt(0).toUpperCase() + risk.riskLevel.slice(1)} Risk
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {risk.alerts.map((alert, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {alert}</li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Recommendations:</p>
                    <ul className="space-y-1">
                      {risk.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-muted-foreground">→ {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="stat">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Overall Attendance</p>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.percentage}%</p>
              <Progress value={stats.percentage} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.attended} of {stats.totalClasses} classes
              </p>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-info/5 border-info/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Theory Classes</p>
                <BookOpen className="w-5 h-5 text-info" />
              </div>
              <p className="text-3xl font-bold text-info">
                {Math.round((stats.theoretical.attended / stats.theoretical.total) * 100)}%
              </p>
              <Progress value={(stats.theoretical.attended / stats.theoretical.total) * 100} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.theoretical.attended} of {stats.theoretical.total} lectures
              </p>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Practical Classes</p>
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {Math.round((stats.practical.attended / stats.practical.total) * 100)}%
              </p>
              <Progress value={(stats.practical.attended / stats.practical.total) * 100} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.practical.attended} of {stats.practical.total} labs
              </p>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Classes Missed</p>
                <XCircle className="w-5 h-5 text-warning" />
              </div>
              <p className="text-3xl font-bold text-warning">
                {stats.totalClasses - stats.attended}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                You can miss {Math.max(0, Math.floor(stats.totalClasses * 0.25) - (stats.totalClasses - stats.attended))} more classes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Attendance Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={attendanceTrend}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[60, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="percentage"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAttendance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.type === 'exam' ? 'bg-destructive/10' :
                      event.type === 'assignment' ? 'bg-warning/10' :
                      event.type === 'holiday' ? 'bg-success/10' : 'bg-info/10'
                    }`}>
                      {event.type === 'exam' && <AlertTriangle className="w-5 h-5 text-destructive" />}
                      {event.type === 'assignment' && <Clock className="w-5 h-5 text-warning" />}
                      {event.type === 'holiday' && <Calendar className="w-5 h-5 text-success" />}
                      {event.type === 'event' && <Bell className="w-5 h-5 text-info" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Attendance</CardTitle>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Marked By</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((record) => (
                    <tr key={record.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm">{record.date}</td>
                      <td className="py-3 px-4 text-sm font-medium">{record.subject}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="capitalize">
                          {record.sessionType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {record.status === 'present' && <CheckCircle2 className="w-4 h-4 text-success" />}
                          {record.status === 'absent' && <XCircle className="w-4 h-4 text-destructive" />}
                          {record.status === 'late' && <Clock className="w-4 h-4 text-warning" />}
                          <span className={`text-sm capitalize ${
                            record.status === 'present' ? 'text-success' :
                            record.status === 'absent' ? 'text-destructive' : 'text-warning'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="uppercase text-xs">
                          {record.markedBy}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default StudentDashboard;
