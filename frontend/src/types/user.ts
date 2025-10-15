export type UserRole = 'employee' | 'division_head' | 'administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  joinDate: string;
  gender?: 'male' | 'female' | 'other';
}

export interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  assignedTeam: string[];
  deadline: string;
  site?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assignedTo: string;
  assignedBy?: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  project?: string;
}

export interface KPI {
  id: string;
  userId: string;
  name: string;
  value: number;
  target: number;
  weight: number;
  period: string;
  evaluatedBy?: string;
  notes?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task' | 'deadline' | 'achievement' | 'alert' | 'audit';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  criteria: string;
}

export interface Survey {
  id: string;
  title: string;
  questions: SurveyQuestion[];
  submittedBy: string;
  submittedAt: string;
  evaluatedBy?: string;
  evaluation?: SurveyEvaluation;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface SurveyEvaluation {
  rating: number;
  comments: string;
  evaluatedAt: string;
}

export interface Feedback {
  id: string;
  from: string;
  to?: string;
  type: 'peer' | 'self' | 'team' | 'project';
  subject: string;
  message: string;
  rating?: number;
  anonymous: boolean;
  timestamp: string;
  replies?: FeedbackReply[];
}

export interface FeedbackReply {
  id: string;
  from: string;
  message: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  project?: string;
  siteInfo?: string;
  details: string;
}

export interface FinancialData {
  projectId: string;
  projectName: string;
  budget: number;
  spent: number;
  estimation: number;
  status: 'under' | 'on-track' | 'over';
}
