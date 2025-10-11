import { User, KPI, Survey } from '@/types/user';
import { mockKPIs, mockSurveys, mockUsers } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Plus, Target, Download, Calculator, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import KPICalculator from '@/components/KPICalculator';

interface TrackingProps {
  currentUser: User;
}

export default function Tracking({ currentUser }: TrackingProps) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [kpiValue, setKpiValue] = useState('');
  const [kpiNotes, setKpiNotes] = useState('');
  const [selectedKpi, setSelectedKpi] = useState('');
  
  const isDivisionHead = currentUser.role === 'division_head';
  const isAdmin = currentUser.role === 'administrator';
  
  const userKPIs = mockKPIs.filter(k => k.userId === currentUser.id);
  const userSurveys = mockSurveys.filter(s => s.submittedBy === currentUser.id);
  
  // For division heads, get team surveys
  const teamSurveys = isDivisionHead 
    ? mockSurveys.filter(s => {
        const submitter = mockUsers.find(u => u.id === s.submittedBy);
        return submitter?.department === currentUser.department;
      })
    : [];

  // For administrators, get all surveys
  const allSurveys = isAdmin ? mockSurveys : [];

  // Group KPIs by name for timeline
  const kpiGroups = userKPIs.reduce((acc, kpi) => {
    if (!acc[kpi.name]) {
      acc[kpi.name] = [];
    }
    acc[kpi.name].push(kpi);
    return acc;
  }, {} as Record<string, KPI[]>);

  const getStatusColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 95) return 'default';
    if (percentage >= 80) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-teal rounded-xl">
            <Target className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
              Performance Tracking
            </h1>
            <p className="text-muted-foreground">Monitor your KPIs and submit self-assessments</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="scoring" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scoring">KPI Scoring</TabsTrigger>
          <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
          <TabsTrigger value="surveys">{isDivisionHead ? 'My Surveys' : isAdmin ? 'Organization Surveys' : 'Surveys'}</TabsTrigger>
          {isDivisionHead && <TabsTrigger value="team-surveys">Team Surveys</TabsTrigger>}
        </TabsList>

        <TabsContent value="scoring" className="space-y-6">
          {/* Overview Card */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  KPI Scoring System
                </h2>
                <p className="text-muted-foreground">Interactive scoring with weighted formulas</p>
              </div>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border">
              <h3 className="font-semibold mb-2 text-primary">Scoring Formula</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Final KPI Score = Σ(Individual KPI Score × Weight) for all KPIs
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-pie-blue/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">Quantitative KPIs</p>
                  <p className="text-lg font-bold text-pie-blue">70-80%</p>
                  <p className="text-xs text-muted-foreground">Auto-tracked metrics</p>
                </div>
                <div className="p-3 bg-pie-green/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">Qualitative KPIs</p>
                  <p className="text-lg font-bold text-pie-green">20-30%</p>
                  <p className="text-xs text-muted-foreground">Manual assessments</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Role-based Scoring Tabs */}
          <Tabs defaultValue="hq_staff" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="hq_staff">HQ Staff</TabsTrigger>
              <TabsTrigger value="field_unit">Field Units</TabsTrigger>
              <TabsTrigger value="division_head">Division Heads</TabsTrigger>
            </TabsList>

            <TabsContent value="hq_staff" className="space-y-6">
              <KPICalculator role="hq_staff" />
            </TabsContent>

            <TabsContent value="field_unit" className="space-y-6">
              <KPICalculator role="field_unit" />
            </TabsContent>

            <TabsContent value="division_head" className="space-y-6">
              <KPICalculator role="division_head" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="data-entry" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Update Performance Data</h3>
            <div className="space-y-4">
              <div>
                <Label>Select KPI</Label>
                <select 
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  value={selectedKpi}
                  onChange={(e) => setSelectedKpi(e.target.value)}
                >
                  <option value="">Choose KPI to update...</option>
                  <option value="task-completion">Task Completion Rate</option>
                  <option value="dpr-submission">DPR Submission Rate</option>
                  <option value="site-visits">Site Visit Completion</option>
                  <option value="budget-adherence">Budget Adherence</option>
                </select>
              </div>

              <div>
                <Label>Value (completed tasks/DPRs/visits)</Label>
                <Input 
                  type="number"
                  value={kpiValue}
                  onChange={(e) => setKpiValue(e.target.value)}
                  placeholder="Enter current value"
                />
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Textarea 
                  value={kpiNotes}
                  onChange={(e) => setKpiNotes(e.target.value)}
                  placeholder="Add any relevant notes about this update"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" onClick={() => {
                  setSelectedKpi('');
                  setKpiValue('');
                  setKpiNotes('');
                }}>
                  Reset
                </Button>
                <Button className="flex-1" onClick={() => {
                  // Submit logic here
                  console.log('Submitting KPI update:', { selectedKpi, kpiValue, kpiNotes });
                }}>
                  Submit Update
                </Button>
              </div>

              <div className="mt-6 p-4 bg-info/5 border border-info/20 rounded-lg">
                <p className="text-sm text-info-foreground">
                  <strong>Note:</strong> Updates are auto-validated and synced with e-Office logs for accuracy. 
                  Your submissions will be reflected in the Performance Trend graphs.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="surveys" className="space-y-6">
          {!isAdmin && (
            <div className="flex justify-end">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Submit New Survey
              </Button>
            </div>
          )}

          {isAdmin && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Organization Survey Overview</h2>
                <Badge variant="secondary" className="text-lg">{allSurveys.length} Total Surveys</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Submitted</h4>
                  <p className="text-3xl font-bold text-teal">{allSurveys.length}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Evaluated</h4>
                  <p className="text-3xl font-bold text-indigo">{allSurveys.filter(s => s.evaluation).length}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Avg. Rating</h4>
                  <p className="text-3xl font-bold text-primary">
                    {allSurveys.filter(s => s.evaluation).length > 0 
                      ? Math.round(allSurveys.filter(s => s.evaluation).reduce((sum, s) => sum + (s.evaluation?.rating || 0), 0) / allSurveys.filter(s => s.evaluation).length)
                      : 0}/100
                  </p>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Survey Analytics</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { 
                      category: 'Excellent', 
                      count: allSurveys.filter(s => s.evaluation && s.evaluation.rating >= 90).length 
                    },
                    { 
                      category: 'Good', 
                      count: allSurveys.filter(s => s.evaluation && s.evaluation.rating >= 75 && s.evaluation.rating < 90).length 
                    },
                    { 
                      category: 'Average', 
                      count: allSurveys.filter(s => s.evaluation && s.evaluation.rating >= 60 && s.evaluation.rating < 75).length 
                    },
                    { 
                      category: 'Needs Improvement', 
                      count: allSurveys.filter(s => s.evaluation && s.evaluation.rating < 60).length 
                    }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--teal))" animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Survey Report
              </Button>
            </div>
          )}

          {!isAdmin && userSurveys.map(survey => (
            <Card key={survey.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{survey.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {new Date(survey.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                {survey.evaluation && (
                  <Badge variant="secondary" className="text-lg">
                    Score: {survey.evaluation.rating}/100
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-4">
                {survey.questions.map(q => (
                  <div key={q.id} className="p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm mb-1">{q.question}</p>
                    <p className="text-sm text-muted-foreground">{q.answer}</p>
                  </div>
                ))}
              </div>

              {survey.evaluation && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">Evaluator Comments</p>
                      <p className="text-sm text-muted-foreground">{survey.evaluation.comments}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Evaluated: {new Date(survey.evaluation.evaluatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        {isDivisionHead && (
          <TabsContent value="team-surveys" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Team Survey Evaluations</h2>
              <Badge variant="secondary">{teamSurveys.length} Surveys</Badge>
            </div>

            {teamSurveys.map(survey => {
              const submitter = mockUsers.find(u => u.id === survey.submittedBy);
              
              return (
                <Card key={survey.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{survey.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted by: {submitter?.name} • {new Date(survey.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {survey.evaluation ? (
                      <Badge variant="default" className="text-lg bg-success">
                        Evaluated: {survey.evaluation.rating}/100
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-coral">
                        Pending Evaluation
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    {survey.questions.map(q => (
                      <div key={q.id} className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium text-sm mb-1">{q.question}</p>
                        <p className="text-sm text-muted-foreground">{q.answer}</p>
                      </div>
                    ))}
                  </div>

                  {survey.evaluation ? (
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-success mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-1">Your Evaluation</p>
                          <p className="text-sm text-muted-foreground">{survey.evaluation.comments}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Evaluated: {new Date(survey.evaluation.evaluatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Star className="mr-2 h-4 w-4" />
                          Evaluate Survey
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Evaluate {submitter?.name}'s Survey</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Rating (out of 100)</Label>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              value={rating}
                              onChange={(e) => setRating(parseInt(e.target.value) || 0)}
                              placeholder="Enter rating"
                            />
                          </div>
                          <div>
                            <Label>Comments</Label>
                            <Textarea 
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              placeholder="Provide feedback and comments"
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1" variant="outline">Cancel</Button>
                            <Button className="flex-1">Submit Evaluation</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </Card>
              );
            })}

            {teamSurveys.length === 0 && (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No team surveys to evaluate</p>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
