import { User } from '@/types/user';
import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationBell } from '@/components/NotificationBell';
import { mockNotifications, mockAchievements } from '@/data/mockData';
import { 
  LayoutDashboard, Target, Activity, 
  TrendingUp, IndianRupee, Users, Trophy, LogOut,
  Menu, X, UserCircle2, User as UserIcon
} from 'lucide-react';
import DashboardHome from '@/pages/DashboardHome';
import Tracking from '@/pages/Tracking';
import Monitoring from '@/pages/Monitoring';
import Engagement from '@/pages/Engagement';
import Analytics from '@/pages/Analytics';
import Finance from '@/pages/Finance';
import KPIManagement from '@/pages/KPIManagement';
import KPIScoring from '@/pages/KPIScoring';
import { cn } from '@/lib/utils';
import logo from '@/assets/brahmaputra-logo-new.png';

interface DashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
}

export default function DashboardLayout({ currentUser, onLogout }: DashboardLayoutProps) {
  const location = useLocation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const earnedAchievements = mockAchievements.filter(a => a.earned && currentUser.id === '1');

  // Gender-based avatar icon
  const getGenderIcon = () => {
    if (currentUser.gender === 'male') {
      return <UserCircle2 className="h-5 w-5 text-white" />;
    } else if (currentUser.gender === 'female') {
      return <UserIcon className="h-5 w-5 text-white" />;
    } else {
      return <UserCircle2 className="h-5 w-5 text-white" />;
    }
  };

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['employee', 'division_head', 'administrator'] },
    { name: 'KPIs', path: '/kpi', icon: Target, roles: ['employee', 'division_head', 'administrator'] },
    { name: 'KPI Scoring', path: '/kpi-scoring', icon: Target, roles: ['employee', 'division_head', 'administrator'] },
    { name: 'Tracking', path: '/tracking', icon: Activity, roles: ['employee', 'division_head', 'administrator'] },
    { name: 'Monitoring', path: '/monitoring', icon: Activity, roles: ['division_head', 'administrator'] },
    { name: 'Engagement', path: '/engagement', icon: Users, roles: ['employee', 'division_head', 'administrator'] },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp, roles: ['employee', 'division_head', 'administrator'] },
    { name: 'Finance', path: '/finance', icon: IndianRupee, roles: ['division_head', 'administrator'] },
  ];

  const filteredNav = navigation.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-navy via-primary to-navy/90 shadow-lg">
        <div className="flex h-16 items-center px-6 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-all duration-200">
              <img src={logo} alt="Brahmaputra Board Logo" className="w-10 h-10 ring-2 ring-white/20 rounded-lg" />
              <div className="text-white">
                <h1 className="font-bold text-lg leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>Brahmaputra Board</h1>
                <p className="text-xs text-white/70">e-Office Management</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 items-center gap-1 ml-6">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-white/90 hover:bg-white/15 hover:text-white transition-all duration-200",
                      isActive && "bg-white/20 text-white font-semibold shadow-md"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Achievements */}
            <Link to="/engagement">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/15 relative transition-all duration-200">
                <Trophy className="h-5 w-5" />
                {earnedAchievements.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-warning text-warning-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold shadow-md">
                    {earnedAchievements.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* Notifications */}
            <div className="text-white [&_button]:text-white [&_button]:hover:bg-white/15 [&_button]:transition-all [&_button]:duration-200">
              <NotificationBell 
                notifications={notifications} 
                onMarkAsRead={handleMarkAsRead}
              />
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/20">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">{currentUser.name}</p>
                <p className="text-xs text-white/70 capitalize">{currentUser.role.replace('_', ' ')}</p>
              </div>
              <Avatar className="h-9 w-9 ring-2 ring-white/30">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-white/20 text-white">
                  {getGenderIcon()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Logout */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onLogout}
              className="text-white hover:bg-white/15 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {sidebarOpen && (
          <div className="lg:hidden border-t border-white/20 bg-navy/95">
            <nav className="p-4 space-y-1">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-white/90 hover:bg-white/15 hover:text-white transition-all duration-200",
                        isActive && "bg-white/20 text-white font-semibold"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full">
        <Routes>
          <Route path="/dashboard" element={<DashboardHome currentUser={currentUser} />} />
          <Route path="/kpi" element={<KPIManagement currentUser={currentUser} />} />
          <Route path="/kpi-scoring" element={<KPIScoring />} />
          <Route path="/tracking" element={<Tracking currentUser={currentUser} />} />
          <Route path="/monitoring" element={<Monitoring currentUser={currentUser} />} />
          <Route path="/engagement" element={<Engagement currentUser={currentUser} />} />
          <Route path="/analytics" element={<Analytics currentUser={currentUser} />} />
          <Route path="/finance" element={<Finance currentUser={currentUser} />} />
          <Route path="/" element={<DashboardHome currentUser={currentUser} />} />
        </Routes>
      </main>
    </div>
  );
}
