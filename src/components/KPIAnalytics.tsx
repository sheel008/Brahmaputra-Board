import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface AnalyticsData {
  timeline: Array<{ month: string; score: number; target: number }>;
  distribution: Array<{ range: string; count: number }>;
  categoryBreakdown: Array<{ category: string; avgScore: number }>;
  stats: {
    mean: number;
    median: number;
    variance: number;
    stdDev: number;
    cv: number;
  };
}

interface KPIAnalyticsProps {
  data: AnalyticsData;
  role: string;
}

export default function KPIAnalytics({ data, role }: KPIAnalyticsProps) {
  // High-contrast complementary colors for pie charts
  const COLORS = [
    'hsl(207, 90%, 54%)',  // Blue #2196F3
    'hsl(122, 39%, 49%)',  // Green #4CAF50
    'hsl(36, 100%, 50%)',  // Orange #FF9800
    'hsl(262, 52%, 47%)',  // Purple
    'hsl(174, 62%, 47%)',  // Teal
    'hsl(4, 90%, 58%)',    // Red
  ];

  return (
    <div className="space-y-6">
      {/* Statistical Summary */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2.5 bg-indigo/10 rounded-lg">
            <Activity className="h-5 w-5 text-indigo" />
          </div>
          <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Statistical Analysis - {role.replace('_', ' ').toUpperCase()}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-[hsl(207,90%,54%)]/10 rounded-lg border border-[hsl(207,90%,54%)]/20">
            <p className="text-xs text-muted-foreground mb-1">Mean Score</p>
            <p className="text-2xl font-bold" style={{ color: 'hsl(207, 90%, 54%)' }}>
              {data.stats.mean.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-[hsl(122,39%,49%)]/10 rounded-lg border border-[hsl(122,39%,49%)]/20">
            <p className="text-xs text-muted-foreground mb-1">Median</p>
            <p className="text-2xl font-bold" style={{ color: 'hsl(122, 39%, 49%)' }}>
              {data.stats.median.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-purple/10 rounded-lg border border-purple/20">
            <p className="text-xs text-muted-foreground mb-1">Variance</p>
            <p className="text-2xl font-bold text-purple">
              {data.stats.variance.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-[hsl(36,100%,50%)]/10 rounded-lg border border-[hsl(36,100%,50%)]/20">
            <p className="text-xs text-muted-foreground mb-1">Std Dev</p>
            <p className="text-2xl font-bold" style={{ color: 'hsl(36, 100%, 50%)' }}>
              {data.stats.stdDev.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-teal/10 rounded-lg border border-teal/20">
            <p className="text-xs text-muted-foreground mb-1">CV (Variance)</p>
            <p className="text-2xl font-bold text-teal">
              {data.stats.cv.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Interpretation:</strong> {data.stats.cv < 0.15 ? 
              'Low variance indicates consistent performance across the team.' : 
              data.stats.cv < 0.30 ? 
              'Moderate variance shows some performance variation.' : 
              'High variance suggests significant performance differences requiring attention.'}
          </p>
        </div>
      </Card>

      {/* Charts Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        {/* Timeline Chart */}
        <TabsContent value="timeline">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-teal/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-teal" />
              </div>
              <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Performance Timeline (12 Months)
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
                <YAxis 
                  domain={[0, 100]}
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
                  dataKey="score" 
                  stroke="hsl(207, 90%, 54%)" 
                  strokeWidth={3}
                  name="Performance Score"
                  dot={{ fill: 'hsl(207, 90%, 54%)', r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(122, 39%, 49%)" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Distribution Chart */}
        <TabsContent value="distribution">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-purple/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple" />
              </div>
              <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Score Distribution Analysis
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data.distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="range" 
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
                <Bar dataKey="count" fill="hsl(262, 52%, 47%)" name="Number of Scores" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Category Breakdown */}
        <TabsContent value="breakdown">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-coral/10 rounded-lg">
                <PieChartIcon className="h-5 w-5 text-coral" />
              </div>
              <h3 className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Category Performance Breakdown
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }: any) => `${category}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(207, 90%, 54%)"
                    dataKey="avgScore"
                  >
                    {data.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      fontFamily: 'Roboto, sans-serif'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3">
                {data.categoryBreakdown.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-sm">{item.category}</span>
                    </div>
                    <span className="font-bold text-lg">{item.avgScore.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}