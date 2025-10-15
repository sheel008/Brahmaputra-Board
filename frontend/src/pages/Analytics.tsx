import { User } from '@/types/user';
import { mockKPIs, mockTasks, mockUsers, mockFinancialData } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { TrendingUp, Activity, Target, DollarSign, Clock, PieChart as PieChartIcon } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface AnalyticsProps {
  currentUser: User;
}

export default function Analytics({ currentUser }: AnalyticsProps) {
  const isEmployee = currentUser.role === 'employee';
  const isDivisionHead = currentUser.role === 'division_head';
  const isAdmin = currentUser.role === 'administrator';

  // Task Distribution Data (role-based)
  const getTasksDistribution = () => {
    const tasks = isEmployee 
      ? mockTasks.filter(t => t.assignedTo === currentUser.id)
      : isDivisionHead
      ? mockTasks.filter(t => {
          const assignee = mockUsers.find(u => u.id === t.assignedTo);
          return assignee?.department === currentUser.department;
        })
      : mockTasks;

    const categories: Record<string, number> = {};
    tasks.forEach(task => {
      const project = task.project || 'Other';
      categories[project] = (categories[project] || 0) + 1;
    });

    const pieChartColors = [
      'hsl(var(--pie-green))', 'hsl(var(--pie-blue))', 'hsl(var(--pie-orange))', 
      'hsl(var(--pie-red))', 'hsl(var(--pie-teal))', 'hsl(var(--pie-purple))'
    ];
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: pieChartColors[index % pieChartColors.length]
    }));
  };

  const tasksDistribution = getTasksDistribution();

  // Employee Analytics
  const userKPIs = mockKPIs.filter(k => k.userId === currentUser.id);
  const kpiTrend = userKPIs
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(kpi => ({
      period: kpi.period.split(' ')[0],
      actual: kpi.value,
      target: kpi.target
    }));

  const userTasks = mockTasks.filter(t => t.assignedTo === currentUser.id);
  const taskCompletion = [
    { name: 'Completed', value: userTasks.filter(t => t.status === 'done').length, color: 'hsl(var(--pie-green))' },
    { name: 'In Progress', value: userTasks.filter(t => t.status === 'in_progress').length, color: 'hsl(var(--pie-blue))' },
    { name: 'Overdue', value: userTasks.filter(t => t.status === 'todo' && new Date(t.deadline) < new Date()).length, color: 'hsl(var(--pie-red))' },
    { name: 'Pending', value: userTasks.filter(t => t.status === 'todo' && new Date(t.deadline) >= new Date()).length, color: 'hsl(var(--pie-orange))' }
  ];

  // Division Head Analytics
  const teamMembers = mockUsers.filter(u => 
    u.department === currentUser.department && u.id !== currentUser.id
  );
  const teamComparison = teamMembers.map(member => {
    const memberKPIs = mockKPIs.filter(k => k.userId === member.id);
    const latestKPIs = Object.values(
      memberKPIs.reduce((acc, kpi) => {
        if (!acc[kpi.name] || new Date(kpi.timestamp) > new Date(acc[kpi.name].timestamp)) {
          acc[kpi.name] = kpi;
        }
        return acc;
      }, {} as Record<string, typeof memberKPIs[0]>)
    );
    const score = latestKPIs.reduce((sum, kpi) => sum + (kpi.value / kpi.target) * kpi.weight, 0);
    return {
      name: member.name.split(' ')[0],
      score: Math.round(score)
    };
  });

  const projectProgress = [
    { name: 'On Track', value: 12, color: 'hsl(var(--pie-green))' },
    { name: 'At Risk', value: 4, color: 'hsl(var(--pie-orange))' },
    { name: 'Delayed', value: 2, color: 'hsl(var(--pie-red))' }
  ];

  // Turnaround Time Analysis for Division Heads
  const turnaroundData = [
    { month: 'Sep', approvals: 3.2, dprs: 5.1, benchmark: 4.0 },
    { month: 'Oct', approvals: 2.8, dprs: 4.8, benchmark: 4.0 },
    { month: 'Nov', approvals: 3.5, dprs: 5.5, benchmark: 4.0 },
    { month: 'Dec', approvals: 2.5, dprs: 4.2, benchmark: 4.0 },
    { month: 'Jan', approvals: 2.9, dprs: 4.5, benchmark: 4.0 }
  ];

  // Admin Analytics
  const orgIndex = [
    { month: 'Sep', score: 78 },
    { month: 'Oct', score: 82 },
    { month: 'Nov', score: 79 },
    { month: 'Dec', score: 85 },
    { month: 'Jan', score: 88 }
  ];

  const divisionSummary = [
    { division: 'HQ Admin', kpi: 85 },
    { division: 'Project', kpi: 92 },
    { division: 'Field Unit', kpi: 87 },
    { division: 'Finance', kpi: 79 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-accent to-primary rounded-xl shadow-lg">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent" 
                style={{ fontFamily: 'Roboto, sans-serif' }}>
              Analytics & Reports
            </h1>
            <p className="text-muted-foreground">
              {isEmployee && 'Your performance insights and trends'}
              {isDivisionHead && 'Team performance and project analytics'}
              {isAdmin && 'Organization-wide insights and metrics'}
            </p>
          </div>
        </div>

      {isEmployee && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">KPI Achievement Trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={kpiTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--chart-2))" strokeWidth={3} name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-6))" strokeDasharray="5 5" strokeWidth={2} name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Activity className="h-5 w-5 text-info" />
                </div>
                <h3 className="text-lg font-semibold">Task Completion Status</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskCompletion}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--pie-navy))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-teal/10 rounded-lg">
                  <PieChartIcon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="text-lg font-semibold">Tasks Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tasksDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tasksDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--pie-navy))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Productivity Trend (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={kpiTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" fill="hsl(var(--chart-1))" name="Actual Performance" />
                  <Bar dataKey="target" fill="hsl(var(--chart-3))" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}

      {isDivisionHead && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-teal/10 rounded-lg">
                  <Target className="h-5 w-5 text-teal" />
                </div>
                <h3 className="text-lg font-semibold">Team Performance Comparison</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--chart-1))" name="Performance Score" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo/10 rounded-lg">
                  <Activity className="h-5 w-5 text-indigo" />
                </div>
                <h3 className="text-lg font-semibold">Project Status Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectProgress}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--pie-navy))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-teal/10 rounded-lg">
                  <PieChartIcon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="text-lg font-semibold">Tasks Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tasksDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tasksDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--pie-navy))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-teal/10 rounded-lg">
                  <Clock className="h-5 w-5 text-teal" />
                </div>
                <h3 className="text-lg font-semibold">Turnaround Time Analysis</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={turnaroundData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="approvals" stroke="hsl(var(--chart-2))" strokeWidth={3} name="Approvals (days)" />
                  <Line type="monotone" dataKey="dprs" stroke="hsl(var(--chart-1))" strokeWidth={3} name="DPRs (days)" />
                  <Line type="monotone" dataKey="benchmark" stroke="hsl(var(--chart-6))" strokeDasharray="5 5" strokeWidth={2} name="Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}

      {isAdmin && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-navy/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-navy" />
                </div>
                <h3 className="text-lg font-semibold">Organizational Performance Index</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={orgIndex}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={3}
                    name="Organization Score"
                    dot={{ fill: 'hsl(var(--chart-1))', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-teal/10 rounded-lg">
                  <Target className="h-5 w-5 text-teal" />
                </div>
                <h3 className="text-lg font-semibold">Division-Wise KPI Summary</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={divisionSummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="division" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="kpi" fill="hsl(var(--chart-3))" name="Average KPI Score" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-teal/10 rounded-lg">
                  <PieChartIcon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="text-lg font-semibold">Tasks Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tasksDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tasksDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--pie-navy))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-coral/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-coral" />
                </div>
                <h3 className="text-lg font-semibold">Budget Utilization vs Target</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockFinancialData.map(p => ({
                  project: p.projectName.split(' ')[0],
                  utilization: (p.spent / 10000000),
                  target: (p.budget / 10000000)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="project" stroke="hsl(var(--muted-foreground))" />
                  <YAxis label={{ value: '₹ Crores', angle: -90, position: 'insideLeft' }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                    formatter={(value) => `₹${value}Cr`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="utilization" stroke="hsl(var(--chart-2))" strokeWidth={3} name="Utilized" />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-5))" strokeWidth={3} name="Budget Target" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
