import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole, studentId?: string, department?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'teacher@easeattend.com',
    role: 'teacher',
    department: 'Computer Science',
    password: 'teacher123'
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'student@easeattend.com',
    role: 'student',
    studentId: 'STU2024001',
    department: 'Computer Science',
    password: 'student123'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('easeattend_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('easeattend_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    studentId?: string,
    department?: string
  ): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      studentId,
      department
    };
    mockUsers.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem('easeattend_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('easeattend_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
