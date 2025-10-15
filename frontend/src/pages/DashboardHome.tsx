import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DraggableWorkflowBoard } from '@/components/DraggableWorkflowBoard';
import { AsyncWrapper, useAsyncOperation } from '@/components/ui/async-states';
import { apiService } from '@/services/api';
import { 
  FileText, TrendingUp, CheckCircle, AlertCircle,
  Users, IndianRupee, Target, Award, LayoutDashboard, ListTodo
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface DashboardHomeProps {
  currentUser: User;
}

export default function DashboardHome({ currentUser }: DashboardHomeProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState<any[]>([]);
  
  const { loading, error, execute, reset } = useAsyncOperation();

  const isEmployee = currentUser.role === 'employee';
  const isDivisionHead = currentUser.role === 'division_head';
  const isAdmin = currentUser.role === 'administrator';

  const fetchDashboardData = async () => {
    await execute(async () => {
      // Fetch tasks based on user role
      const taskParams = isEmployee 
        ? { assignedTo: currentUser.id }
        : isDivisionHead
        ? { department: currentUser.department }
        : {};

      const [tasksResponse, usersResponse, scoresResponse, financialResponse] = await Promise.all([
        apiService.getTasks(taskParams),
        isAdmin ? apiService.getAllUsers() : Promise.resolve({ data: { users: [] } }),
        apiService.getUserScores(currentUser.id, 'current'),
        apiService.getFinancialData()
      ]);

      setTasks(tasksResponse.data?.tasks || []);
      setUsers(usersResponse.data?.users || []);
      setScores(scoresResponse.data?.scores || []);
      setFinancialData(financialResponse.data?.finances || []);
    }, undefined, (err) => {
      toast.error(err.message || 'Failed to load dashboard data');
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser.id, currentUser.role, currentUser.department, isEmployee, isDivisionHead, isAdmin]);

  const allTasks = tasks;
  const completedTasks = allTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'in_progress').length;
  const overdueTasks = allTasks.filter(t => 
    t.status !== 'done' && new Date(t.deadline) < new Date()
  ).length;

  // Calculate performance score from KPI scores
  const performanceScore = scores.length > 0
    ? Math.round(scores.reduce((sum, score) => sum + (score.value / score.target) * 100, 0) / scores.length)
    : 0;

  // Create trend data from scores
  const kpiTrend = scores
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-6)
    .map(score => ({
      month: new Date(score.createdAt).toLocaleDateString('en-US', { month: 'short' }),
      score: Math.round((score.value / score.target) * 100)
    }));

  const totalBudget = financialData.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalSpent = financialData.reduce((sum, p) => sum + (p.spent || 0), 0);

  const handleTaskUpdate = async (taskId: string, newStatus: string) => {
    await execute(async () => {
      await apiService.updateTaskStatus(taskId, newStatus);
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    }, () => {
      toast.success('Task updated successfully');
    }, (err) => {
      toast.error(err.message || 'Failed to update task');
    });
  };

  return (
    <AsyncWrapper 
      loading={loading} 
      error={error} 
      onRetry={fetchDashboardData}
      loadingMessage="Loading dashboard..."
    >
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-7xl">
          {/* Welcome Header - Improved spacing and alignment */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Welcome, {currentUser.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {isEmployee && 'Here\'s your productivity overview'}
                {isDivisionHead && 'Monitor your team\'s performance'}
                {isAdmin && 'Organization-wide productivity insights'}
              </p>
            </div>
          </div>

          {/* Key Metrics - Improved grid layout and spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Performance Score</h3>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-2">{performanceScore}/100</p>
              <Progress value={performanceScore} className="h-2" />
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-info">
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

            <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-destructive">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Alerts</h3>
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-2">{overdueTasks}</p>
              <p className="text-sm text-muted-foreground">Overdue tasks</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-success">
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

          {/* Workflow Board Section - Better spacing and layout */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-teal to-info rounded-lg shadow-md">
                <ListTodo className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-teal to-info bg-clip-text text-transparent">
                  Workflow Board
                </h2>
                <p className="text-muted-foreground">Track and manage your tasks in real-time</p>
              </div>
            </div>
            <DraggableWorkflowBoard 
              tasks={allTasks}
              users={users}
              currentUserId={currentUser.id}
              isEmployee={isEmployee}
              onTaskUpdate={handleTaskUpdate}
            />
          </div>

          {/* Charts Section - Improved responsive layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">
                  {isEmployee && 'Personal Performance Trend'}
                  {isDivisionHead && 'Team Performance Trend'}
                  {isAdmin && 'Organizational Performance Index'}
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
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
              <p className="text-xs text-muted-foreground mt-3 text-center">
                {isEmployee && 'Monthly personal productivity scores'}
                {isDivisionHead && 'Average team performance by month'}
                {isAdmin && 'Organization-wide performance index'}
              </p>
            </Card>

            {!isAdmin && (
              <Card className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-info" />
                  </div>
                  <h3 className="text-lg font-semibold">Task Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
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
              <Card className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <IndianRupee className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold">Budget Utilization vs Target</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={financialData.map(p => ({
                    project: p.projectName?.split(' ').slice(0, 2).join(' ') || 'Project',
                    utilized: ((p.spent || 0) / 10000000).toFixed(1),
                    budget: ((p.budget || 0) / 10000000).toFixed(1)
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

          {/* Recent Activities - Improved layout */}
          <Card className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Recent Tasks</h3>
            </div>
            <div className="space-y-3">
              {allTasks.slice(0, 5).map(task => {
                const assignedUser = users.find(u => u.id === task.assignedTo);
                return (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {assignedUser?.name || 'Unknown User'} • Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      task.status === 'done' ? 'default' : 
                      task.status === 'in_progress' ? 'secondary' : 'outline'
                    } className="ml-3 flex-shrink-0">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </AsyncWrapper>
  );
}