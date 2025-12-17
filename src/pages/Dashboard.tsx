import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
};

export default Dashboard;
