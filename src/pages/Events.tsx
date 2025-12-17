import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { mockEvents } from '@/data/mockData';
import { Calendar, AlertTriangle, Clock, Bell, GraduationCap, Plus } from 'lucide-react';

const Events: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isTeacher = user?.role === 'teacher';

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'assignment': return <Clock className="w-5 h-5 text-warning" />;
      case 'holiday': return <Calendar className="w-5 h-5 text-success" />;
      default: return <Bell className="w-5 h-5 text-info" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-destructive/10 border-destructive/20';
      case 'assignment': return 'bg-warning/10 border-warning/20';
      case 'holiday': return 'bg-success/10 border-success/20';
      default: return 'bg-info/10 border-info/20';
    }
  };

  return (
    <Sidebar>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Academic Events</h1>
            <p className="text-muted-foreground">View upcoming exams, assignments, and events</p>
          </div>
          {isTeacher && (
            <Button variant="gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          )}
        </div>

        {/* Event Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="stat" className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Exams</p>
                  <p className="text-3xl font-bold text-destructive">
                    {mockEvents.filter(e => e.type === 'exam').length}
                  </p>
                </div>
                <GraduationCap className="w-8 h-8 text-destructive/50" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assignments Due</p>
                  <p className="text-3xl font-bold text-warning">
                    {mockEvents.filter(e => e.type === 'assignment').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning/50" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Holidays</p>
                  <p className="text-3xl font-bold text-success">
                    {mockEvents.filter(e => e.type === 'holiday').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-success/50" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-info/5 border-info/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Events</p>
                  <p className="text-3xl font-bold text-info">
                    {mockEvents.filter(e => e.type === 'event').length}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-info/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockEvents.map((event) => (
            <Card key={event.id} className={`${getEventColor(event.type)} border`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    event.type === 'exam' ? 'bg-destructive/10' :
                    event.type === 'assignment' ? 'bg-warning/10' :
                    event.type === 'holiday' ? 'bg-success/10' : 'bg-info/10'
                  }`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge variant="secondary" className="capitalize">{event.type}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{event.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default Events;
