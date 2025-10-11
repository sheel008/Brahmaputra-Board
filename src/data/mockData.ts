import { User, Task, KPI, Notification, Achievement, Survey, Feedback, AuditLog, FinancialData } from '@/types/user';

export { mockProjects } from './mockProjects';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.gov.in',
    role: 'employee',
    department: 'HQ Administration',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    joinDate: '2022-01-15',
    gender: 'male'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.gov.in',
    role: 'division_head',
    department: 'Project Division',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    joinDate: '2020-06-10',
    gender: 'female'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.gov.in',
    role: 'administrator',
    department: 'Administration',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    joinDate: '2019-01-01',
    gender: 'other'
  },
  {
    id: '4',
    name: 'Amit Patel',
    email: 'amit.patel@example.gov.in',
    role: 'employee',
    department: 'Field Unit',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    joinDate: '2021-08-22',
    gender: 'male'
  },
  {
    id: '5',
    name: 'Sneha Das',
    email: 'sneha.das@example.gov.in',
    role: 'employee',
    department: 'HQ Administration',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    joinDate: '2022-03-05',
    gender: 'female'
  },
  {
    id: '6',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.gov.in',
    role: 'employee',
    department: 'Project Division',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    joinDate: '2021-05-12',
    gender: 'male'
  },
  {
    id: '7',
    name: 'Anita Desai',
    email: 'anita.desai@example.gov.in',
    role: 'employee',
    department: 'Project Division',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita',
    joinDate: '2022-09-08',
    gender: 'female'
  }
];

export const mockTasks: Task[] = [
  { id: 't1', title: 'Prepare Monthly Report', description: 'Compile data for January monthly report', status: 'todo', assignedTo: '1', assignedBy: '2', deadline: '2025-02-15', priority: 'high', project: 'HQ Operations' },
  { id: 't2', title: 'Review Project Proposal', description: 'Review flood control project proposal', status: 'in_progress', assignedTo: '1', assignedBy: '2', deadline: '2025-02-10', priority: 'medium', project: 'Flood Management' },
  { id: 't3', title: 'Site Inspection Report', description: 'Submit site inspection findings', status: 'done', assignedTo: '4', assignedBy: '2', deadline: '2025-02-05', priority: 'high', project: 'Dam Construction' },
  { id: 't4', title: 'Budget Analysis', description: 'Analyze Q1 budget utilization', status: 'todo', assignedTo: '5', assignedBy: '3', deadline: '2025-02-20', priority: 'medium', project: 'Finance' },
  { id: 't5', title: 'Team Meeting Prep', description: 'Prepare agenda for division meeting', status: 'in_progress', assignedTo: '2', deadline: '2025-02-08', priority: 'low', project: 'Administration' },
  { id: 't6', title: 'DPR Review', description: 'Review Detailed Project Report for irrigation canal', status: 'todo', assignedTo: '1', assignedBy: '2', deadline: '2025-02-18', priority: 'high', project: 'Irrigation' },
  { id: 't7', title: 'File Approval', description: 'Approve pending administrative files', status: 'in_progress', assignedTo: '6', assignedBy: '2', deadline: '2025-02-12', priority: 'medium', project: 'HQ Operations' },
  { id: 't8', title: 'Survey Upload', description: 'Upload field survey data to system', status: 'in_progress', assignedTo: '7', assignedBy: '2', deadline: '2025-02-14', priority: 'medium', project: 'Field Operations' },
  { id: 't9', title: 'Budget Review', description: 'Review budget allocations for Q2', status: 'todo', assignedTo: '6', assignedBy: '3', deadline: '2025-02-22', priority: 'high', project: 'Finance' },
  { id: 't10', title: 'Erosion Assessment', description: 'Conduct erosion control site assessment', status: 'done', assignedTo: '4', assignedBy: '2', deadline: '2025-02-03', priority: 'high', project: 'Erosion Control' },
  { id: 't11', title: 'Water Quality Test', description: 'Submit water quality testing results', status: 'done', assignedTo: '5', assignedBy: '2', deadline: '2025-02-01', priority: 'medium', project: 'Water Quality' },
  { id: 't12', title: 'Stakeholder Meeting', description: 'Organize stakeholder consultation meeting', status: 'in_progress', assignedTo: '7', assignedBy: '2', deadline: '2025-02-16', priority: 'high', project: 'Public Relations' },
  { id: 't13', title: 'Dam Safety Audit', description: 'Complete annual dam safety audit report', status: 'todo', assignedTo: '4', assignedBy: '3', deadline: '2025-02-25', priority: 'high', project: 'Dam Safety' },
  { id: 't14', title: 'Equipment Maintenance', description: 'Log equipment maintenance records', status: 'done', assignedTo: '6', assignedBy: '2', deadline: '2025-01-30', priority: 'low', project: 'Maintenance' },
  { id: 't15', title: 'Training Module', description: 'Complete digital tools training module', status: 'in_progress', assignedTo: '7', assignedBy: '3', deadline: '2025-02-17', priority: 'medium', project: 'Training' }
];

export const mockKPIs: KPI[] = [
  { id: 'k1', userId: '1', name: 'File Disposal Rate', value: 85, target: 90, weight: 20, period: 'January 2025', evaluatedBy: '2', notes: 'Good progress, slight delay in complex cases', timestamp: '2025-01-31' },
  { id: 'k2', userId: '1', name: 'Turnaround Time', value: 92, target: 95, weight: 15, period: 'January 2025', evaluatedBy: '2', timestamp: '2025-01-31' },
  { id: 'k3', userId: '4', name: 'DPR Timeliness', value: 95, target: 90, weight: 20, period: 'January 2025', evaluatedBy: '2', notes: 'Excellent performance', timestamp: '2025-01-31' },
  { id: 'k4', userId: '1', name: 'File Disposal Rate', value: 82, target: 90, weight: 20, period: 'December 2024', evaluatedBy: '2', timestamp: '2024-12-31' },
  { id: 'k5', userId: '1', name: 'File Disposal Rate', value: 78, target: 90, weight: 20, period: 'November 2024', evaluatedBy: '2', timestamp: '2024-11-30' },
  { id: 'k6', userId: '1', name: 'File Disposal Rate', value: 75, target: 90, weight: 20, period: 'October 2024', evaluatedBy: '2', timestamp: '2024-10-31' },
  { id: 'k7', userId: '1', name: 'Turnaround Time', value: 88, target: 95, weight: 15, period: 'December 2024', evaluatedBy: '2', timestamp: '2024-12-31' },
  { id: 'k8', userId: '1', name: 'Turnaround Time', value: 90, target: 95, weight: 15, period: 'November 2024', evaluatedBy: '2', timestamp: '2024-11-30' },
  { id: 'k9', userId: '1', name: 'Task Completion', value: 82, target: 85, weight: 25, period: 'January 2025', evaluatedBy: '2', notes: 'Strong performance on time-sensitive tasks', timestamp: '2025-01-31' },
  { id: 'k10', userId: '1', name: 'Accuracy Rate', value: 90, target: 85, weight: 20, period: 'January 2025', evaluatedBy: '2', notes: 'Exceeded target with minimal errors', timestamp: '2025-01-31' },
  { id: 'k11', userId: '4', name: 'Site Visit Rate', value: 92, target: 90, weight: 20, period: 'January 2025', evaluatedBy: '2', timestamp: '2025-01-31' },
  { id: 'k12', userId: '5', name: 'Budget Adherence', value: 88, target: 90, weight: 25, period: 'January 2025', evaluatedBy: '3', timestamp: '2025-01-31' },
  { id: 'k13', userId: '6', name: 'File Disposal Rate', value: 87, target: 90, weight: 20, period: 'January 2025', evaluatedBy: '2', timestamp: '2025-01-31' },
  { id: 'k14', userId: '7', name: 'Data Entry Accuracy', value: 93, target: 90, weight: 20, period: 'January 2025', evaluatedBy: '2', timestamp: '2025-01-31' },
  { id: 'k15', userId: '6', name: 'Response Time', value: 85, target: 90, weight: 15, period: 'January 2025', evaluatedBy: '2', timestamp: '2025-01-31' }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    type: 'deadline',
    title: 'Upcoming Deadline',
    message: 'Monthly Report due in 2 days',
    read: false,
    timestamp: '2025-02-13T10:00:00',
    link: '/workflow'
  },
  {
    id: 'n2',
    userId: '1',
    type: 'achievement',
    title: 'New Achievement!',
    message: 'You earned "On-Time Performer" badge',
    read: false,
    timestamp: '2025-02-12T14:30:00',
    link: '/achievements'
  },
  {
    id: 'n3',
    userId: '1',
    type: 'task',
    title: 'New Task Assigned',
    message: 'Budget Analysis assigned to you',
    read: true,
    timestamp: '2025-02-11T09:15:00',
    link: '/workflow'
  },
  {
    id: 'n4',
    userId: '2',
    type: 'alert',
    title: 'Overdue Task',
    message: 'Team member has an overdue task',
    read: false,
    timestamp: '2025-02-13T11:00:00',
    link: '/monitoring'
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'a1',
    name: 'On-Time Performer',
    description: '100% tasks completed on time',
    icon: 'Clock',
    earned: true,
    earnedDate: '2025-02-12',
    criteria: 'Complete all assigned tasks before deadline for one month'
  },
  {
    id: 'a2',
    name: 'Top Achiever',
    description: 'Top 10% performance score',
    icon: 'Trophy',
    earned: true,
    earnedDate: '2025-01-31',
    criteria: 'Score in top 10% of organization for a quarter'
  },
  {
    id: 'a3',
    name: 'Innovator',
    description: 'Approved process improvement',
    icon: 'Lightbulb',
    earned: false,
    criteria: 'Submit and get approval for innovative process improvement'
  },
  {
    id: 'a4',
    name: 'Ground Hero',
    description: 'Field progress >95%',
    icon: 'MapPin',
    earned: false,
    criteria: 'Achieve >95% field activity completion rate'
  },
  {
    id: 'a5',
    name: 'Team Player',
    description: 'Excellent coordination',
    icon: 'Users',
    earned: true,
    earnedDate: '2025-02-01',
    criteria: 'Receive high coordination feedback from team'
  }
];

export const mockSurveys: Survey[] = [
  {
    id: 's1',
    title: 'Q1 2025 Performance Self-Assessment',
    questions: [
      { id: 'q1', question: 'Rate your timeliness this quarter', answer: 'Excellent - completed all tasks on time' },
      { id: 'q2', question: 'Key accomplishments', answer: 'Completed 3 major reports, improved filing system' },
      { id: 'q3', question: 'Areas for improvement', answer: 'Need to work on inter-departmental coordination' },
      { id: 'q4', question: 'Training needs', answer: 'Advanced data analytics and GIS tools' },
      { id: 'q5', question: 'Innovation suggestions', answer: 'Implement automated reminder system for deadlines' }
    ],
    submittedBy: '1',
    submittedAt: '2025-02-01T10:00:00',
    evaluatedBy: '2',
    evaluation: { rating: 85, comments: 'Good self-awareness, keep up the quality work', evaluatedAt: '2025-02-05T14:00:00' }
  },
  {
    id: 's2',
    title: 'Annual Satisfaction Survey 2024',
    questions: [
      { id: 'q1', question: 'Overall job satisfaction (1-5)', answer: '4 - Generally satisfied' },
      { id: 'q2', question: 'Workload management', answer: 'Manageable with occasional peak periods' },
      { id: 'q3', question: 'Team support rating', answer: 'Strong team collaboration, good support' },
      { id: 'q4', question: 'Digital tools effectiveness', answer: 'Very helpful, improved digital tools needed' },
      { id: 'q5', question: 'Management communication', answer: 'Clear and regular communication appreciated' },
      { id: 'q6', question: 'Career development opportunities', answer: 'Would like more training programs' }
    ],
    submittedBy: '1',
    submittedAt: '2025-01-15T09:30:00',
    evaluatedBy: '2',
    evaluation: { rating: 80, comments: 'Valuable feedback, will work on training programs', evaluatedAt: '2025-01-20T11:00:00' }
  },
  {
    id: 's3',
    title: 'Field Operations Feedback Survey',
    questions: [
      { id: 'q1', question: 'Site visit efficiency', answer: 'Good planning, on-time completions' },
      { id: 'q2', question: 'Equipment adequacy', answer: 'Adequate but some upgrades needed' },
      { id: 'q3', question: 'Safety protocols compliance', answer: 'Excellent adherence to safety standards' },
      { id: 'q4', question: 'Data collection tools', answer: 'Mobile app is helpful, needs offline mode' },
      { id: 'q5', question: 'Challenges faced', answer: 'Weather delays and transportation issues' }
    ],
    submittedBy: '4',
    submittedAt: '2025-01-28T14:00:00',
    evaluatedBy: '2',
    evaluation: { rating: 90, comments: 'Outstanding field performance, addressing equipment concerns', evaluatedAt: '2025-02-02T10:00:00' }
  },
  {
    id: 's4',
    title: 'Budget Management Review',
    questions: [
      { id: 'q1', question: 'Budget tracking accuracy', answer: 'Highly accurate tracking systems' },
      { id: 'q2', question: 'Expenditure control', answer: 'Good control, staying within limits' },
      { id: 'q3', question: 'Reporting timeliness', answer: 'All reports submitted on schedule' },
      { id: 'q4', question: 'Financial forecasting', answer: 'Improved forecasting models implemented' },
      { id: 'q5', question: 'Audit preparedness', answer: 'Well-prepared with organized documentation' }
    ],
    submittedBy: '5',
    submittedAt: '2025-02-03T11:00:00'
  },
  {
    id: 's5',
    title: 'Team Collaboration Assessment',
    questions: [
      { id: 'q1', question: 'Cross-team communication', answer: 'Regular meetings improve coordination' },
      { id: 'q2', question: 'Knowledge sharing', answer: 'Good practice of documenting and sharing learnings' },
      { id: 'q3', question: 'Conflict resolution', answer: 'Issues resolved promptly and professionally' },
      { id: 'q4', question: 'Support from colleagues', answer: 'Always willing to help each other' },
      { id: 'q5', question: 'Team morale', answer: 'Positive atmosphere, high motivation levels' }
    ],
    submittedBy: '6',
    submittedAt: '2025-01-25T10:30:00',
    evaluatedBy: '2',
    evaluation: { rating: 88, comments: 'Excellent team dynamics, maintain the positive spirit', evaluatedAt: '2025-01-30T15:00:00' }
  },
  {
    id: 's6',
    title: 'Digital Transformation Feedback',
    questions: [
      { id: 'q1', question: 'e-Office system usability', answer: 'User-friendly interface, easy navigation' },
      { id: 'q2', question: 'Training adequacy', answer: 'Comprehensive training received' },
      { id: 'q3', question: 'System performance', answer: 'Fast and reliable, minimal downtime' },
      { id: 'q4', question: 'Mobile accessibility', answer: 'Mobile app is very convenient for field work' },
      { id: 'q5', question: 'Feature requests', answer: 'Voice input and better search filters would help' },
      { id: 'q6', question: 'Productivity impact', answer: 'Significant improvement in work efficiency' }
    ],
    submittedBy: '7',
    submittedAt: '2025-02-06T09:00:00'
  },
  {
    id: 's7',
    title: 'Project Delivery Quality Review',
    questions: [
      { id: 'q1', question: 'Timeline adherence', answer: 'Met 90% of project deadlines' },
      { id: 'q2', question: 'Quality standards', answer: 'All deliverables met quality benchmarks' },
      { id: 'q3', question: 'Stakeholder satisfaction', answer: 'Positive feedback from stakeholders' },
      { id: 'q4', question: 'Risk management', answer: 'Proactive identification and mitigation of risks' },
      { id: 'q5', question: 'Resource utilization', answer: 'Optimal use of available resources' }
    ],
    submittedBy: '6',
    submittedAt: '2025-01-18T13:00:00',
    evaluatedBy: '2',
    evaluation: { rating: 92, comments: 'Exceptional project delivery, exemplary performance', evaluatedAt: '2025-01-22T10:00:00' }
  },
  {
    id: 's8',
    title: 'Innovation and Process Improvement',
    questions: [
      { id: 'q1', question: 'Process bottlenecks identified', answer: 'Manual data entry slows down workflow' },
      { id: 'q2', question: 'Improvement suggestions', answer: 'Automate repetitive tasks with scripts' },
      { id: 'q3', question: 'Technology adoption', answer: 'Open to trying new tools and methods' },
      { id: 'q4', question: 'Creative problem-solving', answer: 'Developed workarounds for common issues' },
      { id: 'q5', question: 'Best practices sharing', answer: 'Regularly share tips with team members' }
    ],
    submittedBy: '4',
    submittedAt: '2025-01-12T11:00:00',
    evaluatedBy: '2',
    evaluation: { rating: 85, comments: 'Great innovative thinking, will explore automation options', evaluatedAt: '2025-01-16T14:00:00' }
  },
  {
    id: 's9',
    title: 'Work-Life Balance Survey',
    questions: [
      { id: 'q1', question: 'Working hours reasonableness', answer: 'Generally reasonable, occasional overtime' },
      { id: 'q2', question: 'Workload distribution', answer: 'Fair distribution across team members' },
      { id: 'q3', question: 'Flexibility in scheduling', answer: 'Good flexibility for personal commitments' },
      { id: 'q4', question: 'Stress management', answer: 'Manageable stress levels with support' },
      { id: 'q5', question: 'Leave policy satisfaction', answer: 'Satisfied with leave policies and approvals' },
      { id: 'q6', question: 'Overall wellbeing', answer: 'Good work-life balance maintained' }
    ],
    submittedBy: '5',
    submittedAt: '2025-01-22T10:00:00'
  },
  {
    id: 's10',
    title: 'Professional Development Assessment',
    questions: [
      { id: 'q1', question: 'Skill enhancement opportunities', answer: 'Would like more advanced technical training' },
      { id: 'q2', question: 'Mentorship availability', answer: 'Good mentorship from senior colleagues' },
      { id: 'q3', question: 'Career growth clarity', answer: 'Clear career progression path provided' },
      { id: 'q4', question: 'Certification support', answer: 'Support for professional certifications appreciated' },
      { id: 'q5', question: 'Learning resources', answer: 'Access to online courses and materials' }
    ],
    submittedBy: '7',
    submittedAt: '2025-02-08T14:30:00',
    evaluatedBy: '2',
    evaluation: { rating: 87, comments: 'Committed to professional growth, will arrange technical training', evaluatedAt: '2025-02-10T11:00:00' }
  },
  {
    id: 's11',
    title: 'Environmental Compliance Review',
    questions: [
      { id: 'q1', question: 'Environmental guidelines adherence', answer: 'Strict compliance with all guidelines' },
      { id: 'q2', question: 'Sustainability practices', answer: 'Implementing green practices in operations' },
      { id: 'q3', question: 'Waste management', answer: 'Proper waste disposal and recycling followed' },
      { id: 'q4', question: 'Awareness level', answer: 'High awareness through regular training' },
      { id: 'q5', question: 'Improvement areas', answer: 'More eco-friendly equipment needed' }
    ],
    submittedBy: '4',
    submittedAt: '2025-01-20T09:00:00'
  },
  {
    id: 's12',
    title: 'Quarterly Performance Review',
    questions: [
      { id: 'q1', question: 'Target achievement rate', answer: 'Achieved 95% of quarterly targets' },
      { id: 'q2', question: 'Quality of work', answer: 'Consistently high-quality deliverables' },
      { id: 'q3', question: 'Time management', answer: 'Effective prioritization and scheduling' },
      { id: 'q4', question: 'Collaboration effectiveness', answer: 'Strong teamwork and coordination' },
      { id: 'q5', question: 'Leadership initiative', answer: 'Took lead on several critical projects' },
      { id: 'q6', question: 'Next quarter goals', answer: 'Focus on process automation and efficiency' }
    ],
    submittedBy: '6',
    submittedAt: '2025-02-05T15:00:00'
  }
];

export const mockFeedback: Feedback[] = [
  {
    id: 'f1',
    from: '5',
    to: '1',
    type: 'peer',
    subject: 'Great collaboration on report',
    message: 'Rajesh was very helpful in coordinating data collection for the monthly report.',
    rating: 5,
    anonymous: false,
    timestamp: '2025-02-10T11:00:00',
    replies: [
      {
        id: 'r1',
        from: '1',
        message: 'Thank you! Happy to help anytime.',
        timestamp: '2025-02-10T15:00:00'
      }
    ]
  },
  {
    id: 'f2',
    from: '2',
    to: '1',
    type: 'team',
    subject: 'Performance Feedback',
    message: 'Excellent work on the project proposal review. Very thorough analysis.',
    rating: 4,
    anonymous: false,
    timestamp: '2025-02-11T09:30:00'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'l1',
    timestamp: '2025-02-13T10:30:00',
    userId: '1',
    userName: 'Rajesh Kumar',
    action: 'Updated Task Status',
    project: 'HQ Operations',
    siteInfo: 'HQ Office',
    details: 'Moved "Prepare Monthly Report" from To Do to In Progress'
  },
  {
    id: 'l2',
    timestamp: '2025-02-13T09:15:00',
    userId: '2',
    userName: 'Priya Sharma',
    action: 'Assigned Task',
    project: 'Flood Management',
    siteInfo: 'Project Division',
    details: 'Assigned "Review Project Proposal" to Rajesh Kumar'
  },
  {
    id: 'l3',
    timestamp: '2025-02-12T16:45:00',
    userId: '4',
    userName: 'Amit Patel',
    action: 'Submitted Report',
    project: 'Dam Construction',
    siteInfo: 'Field Site A',
    details: 'Submitted Site Inspection Report for January'
  },
  {
    id: 'l4',
    timestamp: '2025-02-12T14:20:00',
    userId: '3',
    userName: 'Admin User',
    action: 'Updated KPI Target',
    project: 'Organization-wide',
    siteInfo: 'Admin Panel',
    details: 'Updated File Disposal Rate target from 85% to 90%'
  }
];

export const mockFinancialData: FinancialData[] = [
  { projectId: 'p1', projectName: 'Flood Management Initiative', budget: 50000000, spent: 32000000, estimation: 35000000, status: 'on-track' },
  { projectId: 'p2', projectName: 'Dam Construction Phase 2', budget: 120000000, spent: 98000000, estimation: 95000000, status: 'over' },
  { projectId: 'p3', projectName: 'Irrigation Canal Modernization', budget: 75000000, spent: 42000000, estimation: 50000000, status: 'under' },
  { projectId: 'p4', projectName: 'Water Quality Monitoring', budget: 15000000, spent: 8500000, estimation: 10000000, status: 'on-track' },
  { projectId: 'p5', projectName: 'Erosion Control Project', budget: 35000000, spent: 22000000, estimation: 28000000, status: 'on-track' },
  { projectId: 'p6', projectName: 'Drainage System Upgrade', budget: 42000000, spent: 38000000, estimation: 45000000, status: 'over' },
  { projectId: 'p7', projectName: 'Rural Water Supply', budget: 28000000, spent: 15000000, estimation: 20000000, status: 'under' },
  { projectId: 'p8', projectName: 'Flood Forecasting System', budget: 18000000, spent: 12000000, estimation: 14000000, status: 'on-track' },
  { projectId: 'p9', projectName: 'Embankment Strengthening', budget: 55000000, spent: 48000000, estimation: 52000000, status: 'on-track' },
  { projectId: 'p10', projectName: 'Agricultural Irrigation', budget: 32000000, spent: 18000000, estimation: 24000000, status: 'under' }
];
