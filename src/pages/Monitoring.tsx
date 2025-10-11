import { User } from '@/types/user';
import { mockUsers, mockTasks, mockKPIs, mockAuditLogs, mockFinancialData, mockSurveys, mockProjects } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Search, Filter, Download, Activity, FolderKanban, MapPin, Clock, FileText, Star, CheckCircle, AlertCircle, CircleDashed } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface MonitoringProps {
  currentUser: User;
}

export default function Monitoring({ currentUser }: MonitoringProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [surveyRating, setSurveyRating] = useState(0);
  const [surveyComments, setSurveyComments] = useState('');

  const isDivisionHead = currentUser.role === 'division_head';
  const isAdmin = currentUser.role === 'administrator';
  const isEmployee = currentUser.role === 'employee';

  // Get team members
  const teamMembers = isDivisionHead
    ? mockUsers.filter(u => u.department === currentUser.department && u.id !== currentUser.id)
    : isAdmin
    ? mockUsers.filter(u => u.role !== 'administrator')
    : [];

  const getUserTasks = (userId: string) => mockTasks.filter(t => t.assignedTo === userId);
  const getUserKPIs = (userId: string) => mockKPIs.filter(k => k.userId === userId);

  // Get surveys based on role
  const userSurveys = isEmployee 
    ? mockSurveys.filter(s => s.submittedBy === currentUser.id)
    : [];
  
  const teamSurveys = isDivisionHead 
    ? mockSurveys.filter(s => {
        const submitter = mockUsers.find(u => u.id === s.submittedBy);
        return submitter?.department === currentUser.department;
      })
    : [];
  
  const allSurveys = isAdmin ? mockSurveys : [];

  const calculateUserScore = (userId: string) => {
    const userKPIs = getUserKPIs(userId);
    if (userKPIs.length === 0) return 0;
    const latestKPIs = Object.values(
      userKPIs.reduce((acc, kpi) => {
        if (!acc[kpi.name] || new Date(kpi.timestamp) > new Date(acc[kpi.name].timestamp)) {
          acc[kpi.name] = kpi;
        }
        return acc;
      }, {} as Record<string, typeof userKPIs[0]>)
    );
    const weightedScore = latestKPIs.reduce((sum, kpi) => 
      sum + (kpi.value / kpi.target) * kpi.weight, 0
    );
    return Math.round(weightedScore);
  };

  const filteredLogs = mockAuditLogs.filter(log =>
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.project?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-navy to-teal rounded-xl">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-navy to-teal bg-clip-text text-transparent">
              {isDivisionHead ? 'Team Monitoring' : 'Organization Monitoring'}
            </h1>
            <p className="text-muted-foreground">
              {isDivisionHead 
                ? 'Monitor team members, projects, and task assignments' 
                : 'View organization-wide activities and audit logs'}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue={isDivisionHead ? "team" : isEmployee ? "surveys" : "audit"} className="space-y-6">
        <TabsList>
          {isEmployee && <TabsTrigger value="surveys">My Surveys</TabsTrigger>}
          {(isDivisionHead || isAdmin) && <TabsTrigger value="team">Team Overview</TabsTrigger>}
          {isDivisionHead && <TabsTrigger value="projects">Ongoing Projects</TabsTrigger>}
          {(isDivisionHead || isAdmin) && <TabsTrigger value="surveys">Surveys</TabsTrigger>}
          {isAdmin && <TabsTrigger value="audit">Audit Logs</TabsTrigger>}
        </TabsList>

        {(isDivisionHead || isAdmin) && (
          <TabsContent value="team" className="space-y-6">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Assign Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Task Title</Label>
                      <Input 
                        value={taskTitle} 
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea 
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div>
                      <Label>Assign To</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Assign Task</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map(member => {
                const tasks = getUserTasks(member.id);
                const completedTasks = tasks.filter(t => t.status === 'done').length;
                const score = calculateUserScore(member.id);

                return (
                  <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.department}</p>
                        <Badge variant="secondary" className="mt-1">
                          {member.role.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Performance Score</span>
                          <span className="font-semibold">{score}/100</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Task Completion</span>
                          <span className="font-semibold">{completedTasks}/{tasks.length}</span>
                        </div>
                        <Progress 
                          value={tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0} 
                          className="h-2" 
                        />
                      </div>

                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2 font-semibold">Assigned Tasks ({tasks.length})</p>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {tasks.slice(0, 5).map(task => (
                            <div key={task.id} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
                              <div className="flex-1 truncate">
                                <p className="font-medium truncate">{task.title}</p>
                                <p className="text-muted-foreground text-xs">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "ml-2 text-xs",
                                  task.status === 'done' && "bg-success/10 text-success",
                                  task.status === 'in_progress' && "bg-teal/10 text-teal",
                                  task.status === 'todo' && "bg-warning/10 text-warning"
                                )}
                              >
                                {task.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          ))}
                          {tasks.length > 5 && (
                            <p className="text-xs text-center text-muted-foreground py-1">
                              +{tasks.length - 5} more tasks
                            </p>
                          )}
                          {tasks.length === 0 && (
                            <p className="text-xs text-center text-muted-foreground py-2">No tasks assigned</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1">Assign Task</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Task to {member.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Task Title</Label>
                                <Input placeholder="Enter task title" />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea placeholder="Enter task description" />
                              </div>
                              <div>
                                <Label>Deadline</Label>
                                <Input type="date" />
                              </div>
                              <div>
                                <Label>Priority</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button className="w-full">Assign Task</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        )}

        {isDivisionHead && (
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Ongoing Projects</h2>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProjects.map(project => {
                const statusIcon = project.status === 'Completed' ? CheckCircle :
                                  project.status === 'At Risk' || project.status === 'Delayed' ? AlertCircle :
                                  CircleDashed;
                const statusColor = project.status === 'Completed' ? 'text-success' :
                                   project.status === 'At Risk' ? 'text-warning' :
                                   project.status === 'Delayed' ? 'text-coral' :
                                   'text-teal';
                const StatusIcon = statusIcon;
                
                return (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-teal/10">
                          <FolderKanban className="h-5 w-5 text-teal" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{project.name}</h3>
                          <p className="text-xs text-muted-foreground">ID: {project.id}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("shrink-0", statusColor)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {project.status}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-semibold">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-indigo" />
                            <span className="text-xs font-medium">{new Date(project.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Site Location</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-teal" />
                            <span className="text-xs font-medium truncate">{project.site || 'Multiple'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2 font-semibold">Assigned Team ({project.assignedTeam.length})</p>
                        <div className="flex -space-x-2">
                          {project.assignedTeam.slice(0, 5).map(userId => {
                            const member = mockUsers.find(u => u.id === userId);
                            return member ? (
                              <Avatar key={userId} className="h-8 w-8 ring-2 ring-background">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="text-xs">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ) : null;
                          })}
                          {project.assignedTeam.length > 5 && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center ring-2 ring-background">
                              <span className="text-xs font-medium">+{project.assignedTeam.length - 5}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Accordion type="single" collapsible className="pt-2 border-t">
                        <AccordionItem value="details" className="border-0">
                          <AccordionTrigger className="text-sm py-2">View Timeline Graph</AccordionTrigger>
                          <AccordionContent>
                            <div className="p-3 bg-muted/30 rounded">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium">Timeline Progress</span>
                                <span className="text-xs text-teal">({project.progress}% complete)</span>
                              </div>
                              <Progress value={project.progress} className="h-1.5 mb-2" />
                              <p className="text-xs text-muted-foreground">
                                Target completion: {new Date(project.deadline).toLocaleDateString()}
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        )}

        <TabsContent value="surveys" className="space-y-6">
          {isEmployee && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Survey History</h2>
                <Badge variant="secondary">{userSurveys.length} Surveys</Badge>
              </div>

              {userSurveys.map(survey => (
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
                          <p className="font-medium text-sm mb-1">Evaluator Feedback</p>
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

              {userSurveys.length === 0 && (
                <Card className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No surveys submitted yet</p>
                </Card>
              )}
            </div>
          )}

          {isDivisionHead && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Team Survey Monitoring</h2>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{teamSurveys.length} Total</Badge>
                  <Badge variant="outline">{teamSurveys.filter(s => !s.evaluation).length} Pending</Badge>
                </div>
              </div>

              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter surveys" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Surveys</SelectItem>
                  <SelectItem value="evaluated">Evaluated</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>

              {teamSurveys.map(survey => {
                const submitter = mockUsers.find(u => u.id === survey.submittedBy);
                return (
                  <Card key={survey.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={submitter?.avatar} />
                          <AvatarFallback>{submitter?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{survey.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {submitter?.name} • {new Date(survey.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {survey.evaluation ? (
                        <Badge variant="default" className="bg-success">
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

                    {!survey.evaluation && (
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
                                value={surveyRating}
                                onChange={(e) => setSurveyRating(parseInt(e.target.value) || 0)}
                                placeholder="Enter rating"
                              />
                            </div>
                            <div>
                              <Label>Comments</Label>
                              <Textarea 
                                value={surveyComments}
                                onChange={(e) => setSurveyComments(e.target.value)}
                                placeholder="Provide feedback"
                                rows={4}
                              />
                            </div>
                            <Button className="w-full">Submit Evaluation</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {isAdmin && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Organization-Wide Surveys</h2>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{allSurveys.length} Total</Badge>
                  <Badge className="bg-teal text-white">{allSurveys.filter(s => s.evaluation).length} Evaluated</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Surveys</h4>
                  <p className="text-3xl font-bold">{allSurveys.length}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Evaluated</h4>
                  <p className="text-3xl font-bold text-success">{allSurveys.filter(s => s.evaluation).length}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Pending</h4>
                  <p className="text-3xl font-bold text-coral">{allSurveys.filter(s => !s.evaluation).length}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Avg. Rating</h4>
                  <p className="text-3xl font-bold text-indigo">
                    {allSurveys.filter(s => s.evaluation).length > 0 
                      ? Math.round(allSurveys.filter(s => s.evaluation).reduce((sum, s) => sum + (s.evaluation?.rating || 0), 0) / allSurveys.filter(s => s.evaluation).length)
                      : 0}/100
                  </p>
                </Card>
              </div>

              {allSurveys.slice(0, 5).map(survey => {
                const submitter = mockUsers.find(u => u.id === survey.submittedBy);
                return (
                  <Card key={survey.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={submitter?.avatar} />
                          <AvatarFallback>{submitter?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{survey.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {submitter?.name} • {submitter?.department}
                          </p>
                        </div>
                      </div>
                      {survey.evaluation && (
                        <Badge variant="default" className="bg-indigo">
                          {survey.evaluation.rating}/100
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })}

              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Survey Analytics
              </Button>
            </div>
          )}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="audit" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search logs by user, action, or project..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Site Info</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={mockUsers.find(u => u.id === log.userId)?.avatar} />
                            <AvatarFallback className="text-xs">
                              {log.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{log.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.project || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.siteInfo || '-'}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}