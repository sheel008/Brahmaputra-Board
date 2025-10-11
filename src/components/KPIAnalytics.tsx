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
  const COLORS = ['hsl(var(--pie-blue))', 'hsl(var(--pie-green))', 'hsl(var(--pie-yellow))', 'hsl(var(--pie-purple))', 'hsl(var(--pie-coral))'];

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
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Mean Score</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.stats.mean.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Median</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.stats.median.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Variance</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.stats.variance.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Std Dev</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.stats.stdDev.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">CV (Variance)</p>
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
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
                  stroke="hsl(var(--pie-blue))" 
                  strokeWidth={3}
                  name="Performance Score"
                  dot={{ fill: 'hsl(var(--pie-blue))', r: 5 }}
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
                <Bar dataKey="count" fill="hsl(var(--pie-purple))" name="Number of Scores" />
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
                    fill="hsl(var(--pie-blue))"
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