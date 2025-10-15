import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { User } from '@/types/user';
import { apiService, socketService } from '@/services/api';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import ApiTest from './pages/ApiTest';

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
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
          setCurrentUser(user);
          
          // Connect to socket
          socketService.connect(token);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          socketService.disconnect();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      socketService.disconnect();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
            <Route path="/api-test" element={<ApiTest />} />
            <Route 
              path="/*" 
              element={
                currentUser ? (
                  <DashboardLayout currentUser={currentUser} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
