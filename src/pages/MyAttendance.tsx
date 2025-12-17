import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getStudentStats, mockAttendanceRecords } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, XCircle, Clock, BookOpen, FlaskConical, Calendar } from 'lucide-react';

const MyAttendance: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  const stats = getStudentStats(user?.id || '2');
  const studentRecords = mockAttendanceRecords.filter(r => r.studentId === '2');

  const monthlyTrend = [
    { month: 'Aug', theoretical: 95, practical: 90 },
    { month: 'Sep', theoretical: 88, practical: 85 },
    { month: 'Oct', theoretical: 92, practical: 88 },
    { month: 'Nov', theoretical: 85, practical: 82 },
    { month: 'Dec', theoretical: stats.theoretical.attended / stats.theoretical.total * 100, practical: stats.practical.attended / stats.practical.total * 100 },
  ];

  const theoryPct = Math.round((stats.theoretical.attended / stats.theoretical.total) * 100);
  const practicalPct = Math.round((stats.practical.attended / stats.practical.total) * 100);

  return (
    <Sidebar>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Attendance</h1>
            <p className="text-muted-foreground">Track your attendance across all subjects</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="stat" className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Overall Attendance</p>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.percentage}%</p>
              <Progress value={stats.percentage} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.attended} of {stats.totalClasses} classes attended
              </p>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-info/5 border-info/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Theoretical Classes</p>
                <BookOpen className="w-5 h-5 text-info" />
              </div>
              <p className="text-3xl font-bold text-info">{theoryPct}%</p>
              <Progress value={theoryPct} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.theoretical.attended} of {stats.theoretical.total} lectures
              </p>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Practical Classes</p>
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">{practicalPct}%</p>
              <Progress value={practicalPct} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.practical.attended} of {stats.practical.total} labs
              </p>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Classes Missed</p>
                <XCircle className="w-5 h-5 text-warning" />
              </div>
              <p className="text-3xl font-bold text-warning">{stats.totalClasses - stats.attended}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Can miss {Math.max(0, Math.floor(stats.totalClasses * 0.25) - (stats.totalClasses - stats.attended))} more
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Trend Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Attendance Trend (Theory vs Practical)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorTheory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPractical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[60, 100]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="theoretical" stroke="hsl(var(--info))" fill="url(#colorTheory)" strokeWidth={2} />
                <Area type="monotone" dataKey="practical" stroke="hsl(var(--primary))" fill="url(#colorPractical)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-info" />
                <span className="text-sm text-muted-foreground">Theoretical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Practical</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance Records</CardTitle>
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
                  {studentRecords.map((record) => (
                    <tr key={record.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm">{record.date}</td>
                      <td className="py-3 px-4 font-medium">{record.subject}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="capitalize">
                          {record.sessionType === 'theoretical' ? (
                            <><BookOpen className="w-3 h-3 mr-1" /> Theory</>
                          ) : (
                            <><FlaskConical className="w-3 h-3 mr-1" /> Lab</>
                          )}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {record.status === 'present' && <CheckCircle2 className="w-4 h-4 text-success" />}
                          {record.status === 'absent' && <XCircle className="w-4 h-4 text-destructive" />}
                          {record.status === 'late' && <Clock className="w-4 h-4 text-warning" />}
                          <span className={`capitalize ${
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

export default MyAttendance;
