import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

export default function ApiTestPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getHealthStatus();
      setHealthStatus(response);
      toast.success('API connection successful!');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to API');
      toast.error('API connection failed');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test with demo credentials
      const response = await apiService.login('admin@brahmaputra.gov.in', 'admin123');
      toast.success('Login test successful!');
      console.log('Login response:', response);
    } catch (err: any) {
      setError(err.message || 'Login test failed');
      toast.error('Login test failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">API Integration Test</h1>
          <p className="text-muted-foreground">
            Testing connection between frontend and backend
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Check */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Health Check</h3>
              <Button 
                onClick={testApiConnection} 
                disabled={loading}
                size="sm"
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {healthStatus ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">API is running</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Status: <Badge variant="secondary">{healthStatus.status}</Badge></p>
                  <p>Environment: {healthStatus.environment}</p>
                  <p>Uptime: {Math.round(healthStatus.uptime / 60)} minutes</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-500">{error}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Testing connection...</span>
              </div>
            )}
          </Card>

          {/* Login Test */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Login Test</h3>
              <Button 
                onClick={testLogin} 
                disabled={loading}
                size="sm"
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Test Login'
                )}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Testing with demo credentials:</p>
              <p>Email: admin@brahmaputra.gov.in</p>
              <p>Password: admin123</p>
            </div>
          </Card>
        </div>

        {/* API Endpoints */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Available API Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Authentication</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>POST /api/auth/login</li>
                <li>POST /api/auth/logout</li>
                <li>GET /api/auth/me</li>
                <li>POST /api/auth/register</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Data Management</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>GET /api/tasks</li>
                <li>GET /api/kpis</li>
                <li>GET /api/scores</li>
                <li>GET /api/notifications</li>
                <li>GET /api/finance</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Environment Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Environment Configuration</h3>
          <div className="text-sm space-y-2">
            <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</p>
            <p><strong>Frontend URL:</strong> {window.location.origin}</p>
            <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
