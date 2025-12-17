import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Bluetooth,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
  ClipboardList,
  Upload,
  TrendingUp
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary text-primary-foreground shadow-soft'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const teacherNavItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/students', icon: <Users className="w-5 h-5" />, label: 'Students' },
    { to: '/attendance', icon: <ClipboardList className="w-5 h-5" />, label: 'Attendance' },
    { to: '/reports', icon: <TrendingUp className="w-5 h-5" />, label: 'Reports' },
    { to: '/leaves', icon: <FileText className="w-5 h-5" />, label: 'Leave Requests' },
    { to: '/events', icon: <Calendar className="w-5 h-5" />, label: 'Events' },
  ];

  const studentNavItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/my-attendance', icon: <ClipboardList className="w-5 h-5" />, label: 'My Attendance' },
    { to: '/submit-work', icon: <Upload className="w-5 h-5" />, label: 'Submit Work' },
    { to: '/my-leaves', icon: <FileText className="w-5 h-5" />, label: 'Leave Requests' },
    { to: '/events', icon: <Calendar className="w-5 h-5" />, label: 'Events' },
    { to: '/alerts', icon: <Bell className="w-5 h-5" />, label: 'Alerts' },
  ];

  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bluetooth className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-text">EaseAttend</h1>
              <p className="text-xs text-muted-foreground capitalize">{user?.role} Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              isActive={location.pathname === item.to}
            />
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
