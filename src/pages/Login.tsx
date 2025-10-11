import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types/user';
import { mockUsers } from '@/data/mockData';
import { Shield, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!showOtp) {
      // First step: validate username and password
      if (username && password) {
        setShowOtp(true);
      } else {
        setError('Please enter username and password');
      }
    } else {
      // Second step: validate OTP
      if (otp === '123456') {
        // Demo: determine user based on username
        let user: User;
        if (username.toLowerCase().includes('admin')) {
          user = mockUsers.find(u => u.role === 'administrator')!;
        } else if (username.toLowerCase().includes('head') || username.toLowerCase().includes('priya')) {
          user = mockUsers.find(u => u.role === 'division_head')!;
        } else {
          user = mockUsers.find(u => u.role === 'employee')!;
        }
        
        onLogin(user);
        navigate('/dashboard');
      } else {
        setError('Invalid OTP. Use 123456 for demo');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-purple/10 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Brahmaputra Board</h1>
          <p className="text-muted-foreground">e-Office Productivity Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!showOtp ? (
            <>
              <div>
                <Label htmlFor="username">NIC Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your NIC username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Continue to 2FA
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg mb-4">
                <Lock className="h-5 w-5 text-primary" />
                <p className="text-sm">
                  Enter the 6-digit OTP sent to your registered mobile
                </p>
              </div>

              <div>
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP (use 123456)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowOtp(false)}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Login
                </Button>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </form>

        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          <p className="mb-2">Demo Credentials:</p>
          <p>Employee: username "rajesh", password: any, OTP: 123456</p>
          <p>Division Head: username "priya", password: any, OTP: 123456</p>
          <p>Administrator: username "admin", password: any, OTP: 123456</p>
        </div>
      </Card>
    </div>
  );
}
