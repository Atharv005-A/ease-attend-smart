import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bluetooth, GraduationCap, Users } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Try teacher@easeattend.com / teacher123 or student@easeattend.com / student123",
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
          <p className="text-muted-foreground mt-2">Smart Attendance Management System</p>
        </div>

        <Card variant="glass">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button type="submit" variant="gradient" className="w-full h-11" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">Demo Credentials</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-accent/50 text-center">
                  <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-xs font-medium">Teacher</p>
                  <p className="text-xs text-muted-foreground">teacher@easeattend.com</p>
                  <p className="text-xs text-muted-foreground">teacher123</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/50 text-center">
                  <GraduationCap className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-xs font-medium">Student</p>
                  <p className="text-xs text-muted-foreground">student@easeattend.com</p>
                  <p className="text-xs text-muted-foreground">student123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
