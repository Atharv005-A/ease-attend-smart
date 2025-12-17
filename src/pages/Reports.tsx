import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { mockStudents, getWeeklyData, getMonthlyData, getRiskPrediction, getStudentStats } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, Users, FileText } from 'lucide-react';

const Reports: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  if (!isAuthenticated || user?.role !== 'teacher') {
    return <Navigate to="/login" replace />;
  }

  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();

  const yearlyData = [
    { month: 'Jan', attendance: 88 },
    { month: 'Feb', attendance: 92 },
    { month: 'Mar', attendance: 85 },
    { month: 'Apr', attendance: 90 },
    { month: 'May', attendance: 87 },
    { month: 'Jun', attendance: 91 },
    { month: 'Jul', attendance: 89 },
    { month: 'Aug', attendance: 93 },
    { month: 'Sep', attendance: 88 },
    { month: 'Oct', attendance: 90 },
    { month: 'Nov', attendance: 86 },
    { month: 'Dec', attendance: 84 },
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 35, color: 'hsl(142, 76%, 36%)' },
    { name: 'Medium Risk', value: 10, color: 'hsl(38, 92%, 50%)' },
    { name: 'High Risk', value: 4, color: 'hsl(0, 84%, 60%)' },
    { name: 'Critical', value: 1, color: 'hsl(0, 72%, 51%)' },
  ];

  const currentData = timeRange === 'weekly' ? weeklyData : timeRange === 'monthly' ? monthlyData : yearlyData;
  const xKey = timeRange === 'weekly' ? 'day' : timeRange === 'monthly' ? 'week' : 'month';

  return (
    <Sidebar>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive attendance insights and predictions</p>
          </div>
          <Button variant="gradient">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={timeRange === 'weekly' ? 'default' : 'outline'}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={timeRange === 'monthly' ? 'default' : 'outline'}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={timeRange === 'yearly' ? 'default' : 'outline'}
            onClick={() => setTimeRange('yearly')}
          >
            Yearly
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="stat" className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-primary">50</p>
                </div>
                <Users className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Attendance</p>
                  <p className="text-3xl font-bold text-success">87%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success/50" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <p className="text-3xl font-bold text-warning">5</p>
                </div>
                <FileText className="w-8 h-8 text-warning/50" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-info/5 border-info/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Classes Today</p>
                  <p className="text-3xl font-bold text-info">6</p>
                </div>
                <Calendar className="w-8 h-8 text-info/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="capitalize">{timeRange} Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[60, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={timeRange === 'weekly' ? 'present' : 'attendance'}
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {riskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Theory</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Practical</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Overall</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((student) => {
                    const stats = getStudentStats(student.id);
                    const risk = getRiskPrediction(student.id);
                    const theoryPct = Math.round((stats.theoretical.attended / stats.theoretical.total) * 100);
                    const practicalPct = Math.round((stats.practical.attended / stats.practical.total) * 100);
                    
                    return (
                      <tr key={student.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{student.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{student.studentId}</td>
                        <td className="py-3 px-4">
                          <span className={theoryPct >= 75 ? 'text-success' : 'text-destructive'}>
                            {theoryPct}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={practicalPct >= 75 ? 'text-success' : 'text-destructive'}>
                            {practicalPct}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${stats.percentage >= 75 ? 'text-success' : 'text-destructive'}`}>
                            {stats.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={
                            risk.riskLevel === 'critical' || risk.riskLevel === 'high' ? 'destructive' :
                            risk.riskLevel === 'medium' ? 'secondary' : 'default'
                          } className="capitalize">
                            {risk.riskLevel}
                          </Badge>
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

export default Reports;
