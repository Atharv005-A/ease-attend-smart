import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bluetooth, GraduationCap, Users } from 'lucide-react';
import { UserRole } from '@/types';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await register(name, email, password, role, studentId, department);
    
    if (success) {
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Registration failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-info/10 rounded-full blur-3xl" />
      </div>
      
      <div className="w-full max-w-md relative animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Bluetooth className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">EaseAttend</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <Card variant="glass">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Register</CardTitle>
            <CardDescription>Join EaseAttend today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      role === 'student'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <GraduationCap className={`w-6 h-6 mx-auto mb-2 ${role === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className={`text-sm font-medium ${role === 'student' ? 'text-primary' : ''}`}>Student</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      role === 'teacher'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Users className={`w-6 h-6 mx-auto mb-2 ${role === 'teacher' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className={`text-sm font-medium ${role === 'teacher' ? 'text-primary' : ''}`}>Teacher</p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    placeholder="Enter your student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Enter your department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <Button type="submit" variant="gradient" className="w-full h-11" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
