import { User } from '@/types/user';
import { mockFinancialData } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FinanceProps {
  currentUser: User;
}

export default function Finance({ currentUser }: FinanceProps) {
  const navigate = useNavigate();
  
  // Filter projects for employees to show only their related projects
  const visibleProjects = currentUser.role === 'employee' 
    ? mockFinancialData.filter(p => p.projectId === 'p1' || p.projectId === 'p4') // Mock: show limited projects
    : mockFinancialData;

  const totalBudget = mockFinancialData.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = mockFinancialData.reduce((sum, p) => sum + p.spent, 0);
  const totalEstimation = mockFinancialData.reduce((sum, p) => sum + p.estimation, 0);

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under': return <TrendingDown className="h-4 w-4 text-success" />;
      case 'on-track': return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'over': return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under': return 'Under Budget';
      case 'on-track': return 'On Track';
      case 'over': return 'Over Budget';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial Monitoring</h1>
        <p className="text-muted-foreground">
          {currentUser.role === 'employee' 
            ? 'View your project-related budgets and expenditures' 
            : 'Track budgets, expenditures, and financial targets'}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Budget</h3>
            <IndianRupee className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(totalBudget)}</p>
          <p className="text-xs text-muted-foreground">Allocated across all projects</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
            <TrendingUp className="h-5 w-5 text-warning" />
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(totalSpent)}</p>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={(totalSpent / totalBudget) * 100} className="flex-1" />
            <span className="text-xs font-medium">
              {((totalSpent / totalBudget) * 100).toFixed(1)}%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Estimated Total</h3>
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(totalEstimation)}</p>
          <p className="text-xs text-muted-foreground">
            {totalEstimation > totalBudget ? (
              <span className="text-destructive">₹{formatCurrency(totalEstimation - totalBudget)} over</span>
            ) : (
              <span className="text-success">Within budget</span>
            )}
          </p>
        </Card>
      </div>

      {/* Project-Wise Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Project-Wise Breakdown</h2>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {visibleProjects.map(project => {
            const spentPercentage = (project.spent / project.budget) * 100;
            const estimatedPercentage = (project.estimation / project.budget) * 100;

            return (
              <Card 
                key={project.projectId} 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/finance/${project.projectId}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">{project.projectName}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <Badge variant="outline">{getStatusText(project.status)}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatCurrency(project.budget)}</p>
                    <p className="text-xs text-muted-foreground">Budget</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Amount Spent</span>
                      <span className="font-semibold text-sm">
                        {formatCurrency(project.spent)} ({spentPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={spentPercentage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Estimated Cost</span>
                      <span className={`font-semibold text-sm ${
                        project.status === 'over' ? 'text-destructive' : 
                        project.status === 'under' ? 'text-success' : ''
                      }`}>
                        {formatCurrency(project.estimation)} ({estimatedPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress 
                      value={estimatedPercentage} 
                      className="h-2"
                    />
                  </div>

                  {project.status === 'over' && (
                    <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <p className="text-sm text-destructive font-medium">
                        ⚠️ Estimated cost exceeds budget by {formatCurrency(project.estimation - project.budget)}
                      </p>
                    </div>
                  )}

                  {project.status === 'under' && (
                    <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                      <p className="text-sm font-medium" style={{ color: 'hsl(var(--success))' }}>
                        ✓ Projected savings of {formatCurrency(project.budget - project.estimation)}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
