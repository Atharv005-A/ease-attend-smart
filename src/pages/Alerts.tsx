import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getRiskPrediction, getStudentStats } from '@/data/mockData';
import { AlertTriangle, TrendingDown, Calendar, CheckCircle, Bell, Lightbulb, Shield, Clock } from 'lucide-react';

const Alerts: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  const risk = getRiskPrediction(user?.id || '2');
  const stats = getStudentStats(user?.id || '2');

  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Attendance Below Threshold',
      message: 'Your attendance is currently at 84%. Maintain above 75% to avoid academic penalties.',
      date: '2024-01-18',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Practical Submission Reminder',
      message: 'Data Structures Lab work submission is due tomorrow. Don\'t forget to upload your work.',
      date: '2024-01-17',
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'BLE Attendance Marked',
      message: 'Your attendance for Algorithm class was automatically marked via BLE beacon.',
      date: '2024-01-16',
      read: true,
    },
    {
      id: '4',
      type: 'alert',
      title: 'Leave Request Approved',
      message: 'Your medical leave request for Jan 20-22 has been approved.',
      date: '2024-01-15',
      read: true,
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'info': return <Bell className="w-5 h-5 text-info" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'alert': return <Shield className="w-5 h-5 text-primary" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-warning/5 border-warning/20';
      case 'info': return 'bg-info/5 border-info/20';
      case 'success': return 'bg-success/5 border-success/20';
      case 'alert': return 'bg-primary/5 border-primary/20';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <Sidebar>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
            <p className="text-muted-foreground">Stay informed about your attendance and deadlines</p>
          </div>
          <Button variant="outline">Mark All Read</Button>
        </div>

        {/* AI Risk Analysis Card */}
        <Card className={`mb-8 ${
          risk.riskLevel === 'critical' ? 'bg-destructive/5 border-destructive/30' :
          risk.riskLevel === 'high' ? 'bg-warning/5 border-warning/30' :
          risk.riskLevel === 'medium' ? 'bg-info/5 border-info/30' : 'bg-success/5 border-success/30'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className={`w-5 h-5 ${
                risk.riskLevel === 'critical' || risk.riskLevel === 'high' ? 'text-warning' : 'text-success'
              }`} />
              AI Attendance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    risk.riskLevel === 'critical' || risk.riskLevel === 'high' ? 'destructive' :
                    risk.riskLevel === 'medium' ? 'secondary' : 'default'
                  } className="capitalize text-sm px-3 py-1">
                    {risk.riskLevel} Risk
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Attendance</p>
                <p className="text-2xl font-bold">{stats.percentage}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Predicted End Semester</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {risk.predictedEndPercentage}%
                  <TrendingDown className="w-5 h-5 text-warning" />
                </p>
              </div>
            </div>

            {risk.alerts.length > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-background/50">
                <p className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Alerts
                </p>
                <ul className="space-y-1">
                  {risk.alerts.map((alert, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {alert}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 p-4 rounded-lg bg-background/50">
              <p className="font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-info" />
                AI Recommendations
              </p>
              <ul className="space-y-1">
                {risk.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground">→ {rec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${!alert.read ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      alert.type === 'warning' ? 'bg-warning/10' :
                      alert.type === 'info' ? 'bg-info/10' :
                      alert.type === 'success' ? 'bg-success/10' : 'bg-primary/10'
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{alert.title}</h3>
                        {!alert.read && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {alert.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default Alerts;
