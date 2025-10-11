import { User } from '@/types/user';
import { mockTasks, mockKPIs, mockUsers, mockFinancialData } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DraggableWorkflowBoard } from '@/components/DraggableWorkflowBoard';
import { 
  FileText, TrendingUp, CheckCircle, AlertCircle,
  Users, IndianRupee, Target, Award, LayoutDashboard, ListTodo
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardHomeProps {
  currentUser: User;
}

export default function DashboardHome({ currentUser }: DashboardHomeProps) {
  const isEmployee = currentUser.role === 'employee';
  const isDivisionHead = currentUser.role === 'division_head';
  const isAdmin = currentUser.role === 'administrator';

  const allTasks = isEmployee 
    ? mockTasks.filter(t => t.assignedTo === currentUser.id)
    : isDivisionHead
    ? mockTasks.filter(t => {
        const assignedUser = mockUsers.find(u => u.id === t.assignedTo);
        return assignedUser?.department === currentUser.department;
      })
    : mockTasks;

  const completedTasks = allTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'in_progress').length;
  const overdueTasks = allTasks.filter(t => 
    t.status !== 'done' && new Date(t.deadline) < new Date()
  ).length;

  const userKPIs = mockKPIs.filter(k => k.userId === currentUser.id);
  const latestKPIs = Object.values(
    userKPIs.reduce((acc, kpi) => {
      if (!acc[kpi.name] || new Date(kpi.timestamp) > new Date(acc[kpi.name].timestamp)) {
        acc[kpi.name] = kpi;
      }
      return acc;
    }, {} as Record<string, typeof userKPIs[0]>)
  );
  const performanceScore = latestKPIs.length > 0
    ? Math.round(latestKPIs.reduce((sum, kpi) => sum + (kpi.value / kpi.target) * kpi.weight, 0))
    : 0;

  const kpiTrend = userKPIs
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-6)
    .map(kpi => ({
      month: kpi.period.split(' ')[0],
      score: Math.round((kpi.value / kpi.target) * 100)
    }));

  const totalBudget = mockFinancialData.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = mockFinancialData.reduce((sum, p) => sum + p.spent, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
          <LayoutDashboard className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-muted-foreground">
            {isEmployee && 'Here\'s your productivity overview'}
            {isDivisionHead && 'Monitor your team\'s performance'}
            {isAdmin && 'Organization-wide productivity insights'}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Performance Score</h3>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{performanceScore}/100</p>
          <Progress value={performanceScore} className="h-2" />
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-info">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {isEmployee ? 'My Tasks' : 'Team Tasks'}
            </h3>
            <div className="p-2 bg-info/10 rounded-lg">
              <FileText className="h-5 w-5 text-info" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{allTasks.length}</p>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">{completedTasks} done</Badge>
            <Badge variant="outline">{inProgressTasks} active</Badge>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-destructive">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Alerts</h3>
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{overdueTasks}</p>
          <p className="text-sm text-muted-foreground">Overdue tasks</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-success">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Budget Status</h3>
            <div className="p-2 bg-success/10 rounded-lg">
              <IndianRupee className="h-5 w-5 text-success" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">
            {((totalSpent / totalBudget) * 100).toFixed(1)}%
          </p>
          <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
        </Card>
      </div>

      {/* Workflow Board Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal to-info rounded-lg">
            <ListTodo className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal to-info bg-clip-text text-transparent">
              Workflow Board
            </h2>
            <p className="text-sm text-muted-foreground">Track and manage your tasks in real-time</p>
          </div>
        </div>
        <DraggableWorkflowBoard 
          tasks={allTasks}
          users={mockUsers}
          currentUserId={currentUser.id}
          isEmployee={isEmployee}
          onTaskUpdate={(taskId, newStatus) => {
            console.log(`Task ${taskId} updated to ${newStatus}`);
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">
              {isEmployee && 'Personal Performance Trend'}
              {isDivisionHead && 'Team Performance Trend'}
              {isAdmin && 'Organizational Performance Index'}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart 
              data={kpiTrend.length > 0 ? kpiTrend : [
                { month: 'Jan', score: 75 },
                { month: 'Feb', score: 82 },
                { month: 'Mar', score: 78 },
                { month: 'Apr', score: 85 },
                { month: 'May', score: 88 },
                { month: 'Jun', score: 90 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={isEmployee ? "hsl(var(--chart-2))" : isDivisionHead ? "hsl(var(--chart-1))" : "hsl(var(--chart-3))"} 
                strokeWidth={3}
                dot={{ fill: isEmployee ? "hsl(var(--chart-2))" : isDivisionHead ? "hsl(var(--chart-1))" : "hsl(var(--chart-3))", r: 5 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {isEmployee && 'Monthly personal productivity scores'}
            {isDivisionHead && 'Average team performance by month'}
            {isAdmin && 'Organization-wide performance index'}
          </p>
        </Card>

        {!isAdmin && (
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-info/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-info" />
              </div>
              <h3 className="text-lg font-semibold">Task Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { status: 'To Do', count: allTasks.filter(t => t.status === 'todo').length },
                { status: 'In Progress', count: inProgressTasks },
                { status: 'Done', count: completedTasks }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {isAdmin && (
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-success/10 rounded-lg">
                <IndianRupee className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-lg font-semibold">Budget Utilization vs Target</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockFinancialData.map(p => ({
                project: p.projectName.split(' ').slice(0, 2).join(' '),
                utilized: (p.spent / 10000000).toFixed(1),
                budget: (p.budget / 10000000).toFixed(1)
              })).slice(0, 4)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project" />
                <YAxis label={{ value: '₹ Crores', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="utilized" fill="hsl(var(--chart-2))" name="Utilized" animationDuration={1000} />
                <Bar dataKey="budget" fill="hsl(var(--chart-6))" name="Budget" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Recent Activities */}
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Recent Tasks</h3>
        </div>
        <div className="space-y-3">
          {allTasks.slice(0, 5).map(task => {
            const assignedUser = mockUsers.find(u => u.id === task.assignedTo);
            return (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {assignedUser?.name} • Due: {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={
                  task.status === 'done' ? 'default' : 
                  task.status === 'in_progress' ? 'secondary' : 'outline'
                }>
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}