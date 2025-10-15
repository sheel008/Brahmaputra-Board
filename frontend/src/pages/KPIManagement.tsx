import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, Users, BarChart3, FileText, Award } from 'lucide-react';
import { HQ_STAFF_KPIS, FIELD_UNIT_KPIS, DIVISION_HEAD_KPIS } from '@/types/kpi';
import { KPICard } from '@/components/KPICard';
import { CoreConceptsCard } from '@/components/CoreConceptsCard';
import { AsyncWrapper, useAsyncOperation } from '@/components/ui/async-states';
import { apiService } from '@/services/api';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { toast } from 'sonner';

interface KPIManagementProps {
  currentUser: User;
}

export default function KPIManagement({ currentUser }: KPIManagementProps) {
  const [kpis, setKpis] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  
  const { loading, error, execute } = useAsyncOperation();

  const isEmployee = currentUser.role === 'employee';
  const isDivisionHead = currentUser.role === 'division_head';
  const isAdmin = currentUser.role === 'administrator';

  const fetchKPIData = async () => {
    await execute(async () => {
      // Determine role type for KPIs
      const getUserRole = () => {
        if (currentUser.department === 'Field Unit') return 'field_unit';
        if (isDivisionHead || isAdmin) return 'division_head';
        return 'hq_staff';
      };

      const userRole = getUserRole();
      
      // Fetch KPIs and scores
      const [kpisResponse, scoresResponse] = await Promise.all([
        apiService.getKPIsByRole(userRole),
        apiService.getUserScores(currentUser.id, 'current')
      ]);

      setKpis(kpisResponse.data?.kpis || []);
      setScores(scoresResponse.data?.scores || []);
    }, undefined, (err) => {
      toast.error(err.message || 'Failed to load KPI data');
    });
  };

  useEffect(() => {
    fetchKPIData();
  }, [currentUser.id, currentUser.role, currentUser.department, isDivisionHead, isAdmin]);

  // Determine role type for KPIs
  const getUserRole = () => {
    if (currentUser.department === 'Field Unit') return 'field_unit';
    if (isDivisionHead || isAdmin) return 'division_head';
    return 'hq_staff';
  };

  const userRole = getUserRole();
  const userKPIs = kpis;

  // Get current values for KPIs (latest month)
  const getCurrentValue = (kpiId: string) => {
    const score = scores.find(s => s.kpiId === kpiId);
    return score ? score.value : 0;
  };

  // Get 6-month trend data
  const sixMonthTrend = scores
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-6)
    .map(score => ({
      month: new Date(score.createdAt).toLocaleDateString('en-US', { month: 'short' }),
      avgScore: Math.round((score.value / score.target) * 100),
      target: 85
    }));

  // Mock data for charts when no real data is available
  const mockTimelineData = [
    { month: 'Jan', value: 75, target: 85 },
    { month: 'Feb', value: 82, target: 85 },
    { month: 'Mar', value: 78, target: 85 },
    { month: 'Apr', value: 85, target: 85 },
    { month: 'May', value: 88, target: 85 },
    { month: 'Jun', value: 90, target: 85 }
  ];

  const mockSurveyData = [
    { category: 'Communication', avgRating: 4.2 },
    { category: 'Teamwork', avgRating: 4.5 },
    { category: 'Problem Solving', avgRating: 4.0 },
    { category: 'Leadership', avgRating: 3.8 }
  ];

  const getRoleIcon = () => {
    if (userRole === 'hq_staff') return <FileText className="h-5 w-5" />;
    if (userRole === 'field_unit') return <Target className="h-5 w-5" />;
    return <Users className="h-5 w-5" />;
  };

  const getRoleTitle = () => {
    if (userRole === 'hq_staff') return 'HQ Staff Performance';
    if (userRole === 'field_unit') return 'Field Unit Performance';
    return 'Division Head Performance';
  };

  return (
    <AsyncWrapper 
      loading={loading} 
      error={error} 
      onRetry={fetchKPIData}
      loadingMessage="Loading KPI data..."
    >
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-7xl">
          {/* Header - Improved spacing and alignment */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2" 
                  style={{ fontFamily: 'Roboto, sans-serif' }}>
                KPI Performance Management
              </h1>
              <p className="text-muted-foreground text-lg">
                Comprehensive performance tracking and analytics framework
              </p>
            </div>
          </div>

          {/* Core Concepts - Better spacing */}
          <CoreConceptsCard />

          {/* Main Content - Improved tab layout */}
          <Tabs defaultValue="current" className="space-y-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-4xl mx-auto" 
                      style={{ fontFamily: 'Roboto, sans-serif' }}>
              <TabsTrigger value="current" className="text-sm">Current KPIs</TabsTrigger>
              <TabsTrigger value="trends" className="text-sm">Trends</TabsTrigger>
              <TabsTrigger value="timeline" className="text-sm">Timeline</TabsTrigger>
              <TabsTrigger value="surveys" className="text-sm">Surveys</TabsTrigger>
            </TabsList>

            {/* Current KPIs Tab - Better layout */}
            <TabsContent value="current" className="space-y-8">
              <Card className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {getRoleIcon()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {getRoleTitle()}
                    </h2>
                    <p className="text-muted-foreground">
                      {userKPIs.length} Key Performance Indicators
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {userKPIs.map((kpi, index) => (
                    <KPICard 
                      key={kpi.id}
                      kpi={kpi}
                      currentValue={getCurrentValue(kpi.id)}
                      icon={index % 2 === 0 ? <Target className="h-4 w-4 text-primary" /> : <TrendingUp className="h-4 w-4 text-accent" />}
                    />
                  ))}
                </div>
              </Card>

              {/* Summary Card - Better responsive layout */}
              <Card className="p-6 lg:p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Total Weightage</p>
                    <p className="text-3xl font-bold text-primary">100%</p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Quantitative Metrics</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {Math.round((userKPIs.filter(k => k.type === 'quantitative').length / userKPIs.length) * 100)}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Qualitative Metrics</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {Math.round((userKPIs.filter(k => k.type === 'qualitative').length / userKPIs.length) * 100)}%
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Trends Tab - Better spacing */}
            <TabsContent value="trends" className="space-y-8">
              <Card className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                  <div className="p-3 bg-teal/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      6-Month Performance Trend
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Track your performance progress over time
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={sixMonthTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                        fontFamily: 'Roboto, sans-serif'
                      }}
                    />
                    <Legend wrapperStyle={{ fontFamily: 'Roboto, sans-serif' }} />
                    <Bar dataKey="avgScore" fill="hsl(var(--pie-blue))" name="Average KPI Score" />
                    <Bar dataKey="target" fill="hsl(var(--pie-green))" name="Target" opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Timeline Tab - Better spacing */}
            <TabsContent value="timeline" className="space-y-8">
              <Card className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                  <div className="p-3 bg-indigo/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-indigo" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      12-Month Performance Timeline
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Long-term performance tracking and analysis
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                    <YAxis 
                      domain={[60, 100]}
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                        fontFamily: 'Roboto, sans-serif'
                      }}
                    />
                    <Legend wrapperStyle={{ fontFamily: 'Roboto, sans-serif' }} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--pie-blue))" 
                      strokeWidth={3}
                      name="Performance Score"
                      dot={{ fill: 'hsl(var(--pie-blue))', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="hsl(var(--pie-green))" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Target"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Surveys Tab - Better spacing */}
            <TabsContent value="surveys" className="space-y-8">
              <Card className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                  <div className="p-3 bg-coral/10 rounded-lg">
                    <FileText className="h-6 w-6 text-coral" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Qualitative Survey Results
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Sample survey responses across categories
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockSurveyData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number"
                      domain={[0, 5]}
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="category" 
                      stroke="hsl(var(--muted-foreground))"
                      width={150}
                      style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                        fontFamily: 'Roboto, sans-serif'
                      }}
                    />
                    <Bar dataKey="avgRating" fill="hsl(var(--pie-purple))" name="Average Rating (1-5)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AsyncWrapper>
  );
}
