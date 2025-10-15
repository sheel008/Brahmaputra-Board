import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types/user';
import { apiService, socketService } from '@/services/api';
import { Shield, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!showOtp) {
        // First step: login with email and password
        const response = await apiService.login(email, password);
        
        if (response.data?.user?.twoFactorEnabled) {
          setRequires2FA(true);
          setShowOtp(true);
        } else {
          // Login successful, no 2FA required
          const user: User = {
            id: response.data?.user?.id || response.user?.id,
            name: response.data?.user?.name || response.user?.name,
            email: response.data?.user?.email || response.user?.email,
            role: response.data?.user?.role || response.user?.role,
            department: response.data?.user?.department || response.user?.department,
            avatar: response.data?.user?.avatar || response.user?.avatar,
            joinDate: new Date().toISOString(),
            gender: 'other'
          };
          
          // Connect to socket
          const token = response.data?.token || response.token;
          if (token) {
            socketService.connect(token);
          }
          
          onLogin(user);
          navigate('/dashboard');
          toast.success('Login successful!');
        }
      } else {
        // Second step: verify 2FA (if required)
        if (requires2FA) {
          // In a real implementation, you would verify the 2FA token here
          // For demo purposes, we'll skip 2FA verification
          toast.info('2FA verification skipped for demo');
        }
        
        // Get current user after successful login
        const userResponse = await apiService.getCurrentUser();
        const user: User = {
          id: userResponse.data?.user?.id || userResponse.user?.id,
          name: userResponse.data?.user?.name || userResponse.user?.name,
          email: userResponse.data?.user?.email || userResponse.user?.email,
          role: userResponse.data?.user?.role || userResponse.user?.role,
          department: userResponse.data?.user?.department || userResponse.user?.department,
          avatar: userResponse.data?.user?.avatar || userResponse.user?.avatar,
          joinDate: new Date().toISOString(),
          gender: 'other'
        };
        
        // Connect to socket
        const token = localStorage.getItem('token');
        if (token) {
          socketService.connect(token);
        }
        
        onLogin(user);
        navigate('/dashboard');
        toast.success('Login successful!');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-purple/10 p-4">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8 shadow-xl">
          {/* Header Section - Centered with proper spacing */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-foreground">Brahmaputra Board</h1>
            <p className="text-muted-foreground text-sm">e-Office Productivity Management</p>
          </div>

          {/* Form Section - Improved spacing and alignment */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!showOtp ? (
              <>
                {/* Email Input - Better spacing */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
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

                {/* Password Input - Better spacing */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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

                {/* Login Button - Full width with proper height */}
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </>
            ) : (
              <>
                {/* 2FA Info - Better visual hierarchy */}
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">
                    Enter the 6-digit OTP sent to your registered mobile number
                  </p>
                </div>

                {/* OTP Input - Better spacing */}
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP (use 123456)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    className="h-11 text-center text-lg tracking-widest"
                  />
                </div>

                {/* Action Buttons - Better layout */}
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 h-11"
                    onClick={() => setShowOtp(false)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 h-11" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Login'
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Error Message - Better positioning */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}
          </form>

          {/* Demo Credentials - Better organization */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-4">Demo Credentials</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="p-2 bg-muted/50 rounded">
                  <p className="font-medium">Employee</p>
                  <p>rajesh.kumar@brahmaputra.gov.in / password123</p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="font-medium">Division Head</p>
                  <p>priya.sharma@brahmaputra.gov.in / password123</p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="font-medium">Administrator</p>
                  <p>admin@brahmaputra.gov.in / admin123</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
