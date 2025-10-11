import { User } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, Users, BarChart3, FileText, Award } from 'lucide-react';
import { HQ_STAFF_KPIS, FIELD_UNIT_KPIS, DIVISION_HEAD_KPIS } from '@/types/kpi';
import { KPICard } from '@/components/KPICard';
import { CoreConceptsCard } from '@/components/CoreConceptsCard';
import { allKPIRecords, allTimelineData, allSurveyData } from '@/data/comprehensiveKPIData';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface KPIManagementProps {
  currentUser: User;
}

export default function KPIManagement({ currentUser }: KPIManagementProps) {
  const isEmployee = currentUser.role === 'employee';
  const isDivisionHead = currentUser.role === 'division_head';
  const isAdmin = currentUser.role === 'administrator';

  // Determine role type for KPIs
  const getUserRole = () => {
    if (currentUser.department === 'Field Unit') return 'field_unit';
    if (isDivisionHead || isAdmin) return 'division_head';
    return 'hq_staff';
  };

  const userRole = getUserRole();
  const userKPIs = userRole === 'hq_staff' ? HQ_STAFF_KPIS : 
                   userRole === 'field_unit' ? FIELD_UNIT_KPIS : 
                   DIVISION_HEAD_KPIS;

  // Get current values for KPIs (latest month)
  const userKPIRecords = allKPIRecords.filter(r => r.userId === currentUser.id && r.month === 'Jan');
  const getCurrentValue = (kpiId: string) => {
    const record = userKPIRecords.find(r => r.kpiId === kpiId);
    return record ? record.value : 0;
  };

  // Get 6-month trend data
  const sixMonthTrend = allKPIRecords
    .filter(r => r.userId === currentUser.id)
    .reduce((acc, record) => {
      const existing = acc.find(item => item.month === record.month);
      if (existing) {
        existing.avgScore = ((existing.avgScore + record.value) / 2);
      } else {
        acc.push({
          month: record.month,
          avgScore: record.value,
          target: 85
        });
      }
      return acc;
    }, [] as { month: string; avgScore: number; target: number }[])
    .sort((a, b) => {
      const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

  // Get 12-month timeline
  const twelveMonthTimeline = allTimelineData[currentUser.id as keyof typeof allTimelineData] || [];

  // Get user survey data
  const userSurveys = allSurveyData.filter((s: any) => s.userId === currentUser.id);
  const surveyByCategory = userSurveys.reduce((acc: any, survey: any) => {
    if (!acc[survey.category]) {
      acc[survey.category] = { total: 0, count: 0 };
    }
    acc[survey.category].total += survey.rating;
    acc[survey.category].count += 1;
    return acc;
  }, {});

  const surveyChartData = Object.entries(surveyByCategory).map(([category, data]: [string, any]) => ({
    category,
    avgRating: Math.round((data.total / data.count) * 10) / 10
  }));

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
            <Award className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" 
                style={{ fontFamily: 'Roboto, sans-serif' }}>
              KPI Performance Management
            </h1>
            <p className="text-muted-foreground">
              Comprehensive performance tracking and analytics framework
            </p>
          </div>
        </div>

        {/* Core Concepts */}
        <CoreConceptsCard />

        {/* Main Content */}
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <TabsTrigger value="current">Current KPIs</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
          </TabsList>

          {/* Current KPIs Tab */}
          <TabsContent value="current" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  {getRoleIcon()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {getRoleTitle()}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {userKPIs.length} Key Performance Indicators
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

            {/* Summary Card */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Weightage</p>
                  <p className="text-3xl font-bold text-primary">100%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Quantitative Metrics</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Math.round((userKPIs.filter(k => k.type === 'quantitative').length / userKPIs.length) * 100)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Qualitative Metrics</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {Math.round((userKPIs.filter(k => k.type === 'qualitative').length / userKPIs.length) * 100)}%
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2.5 bg-teal/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-teal" />
                </div>
                <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  6-Month Performance Trend
                </h3>
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

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2.5 bg-indigo/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-indigo" />
                </div>
                <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  12-Month Performance Timeline
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={twelveMonthTimeline}>
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

          {/* Surveys Tab */}
          <TabsContent value="surveys" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2.5 bg-coral/10 rounded-lg">
                  <FileText className="h-5 w-5 text-coral" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Qualitative Survey Results
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {userSurveys.length} survey responses across categories
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={surveyChartData} layout="horizontal">
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
  );
}
