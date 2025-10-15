const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const KPI = require('../models/KPI');
const Score = require('../models/Score');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const Finance = require('../models/Finance');
const AuditLog = require('../models/AuditLog');

// Clear existing data
const clearDatabase = async () => {
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await KPI.deleteMany({});
  await Score.deleteMany({});
  await Task.deleteMany({});
  await Notification.deleteMany({});
  await Finance.deleteMany({});
  await AuditLog.deleteMany({});
  console.log('Database cleared.');
};

// Create users
const createUsers = async () => {
  console.log('Creating users...');
  
  const users = [
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@brahmaputra.gov.in',
      password: 'password123',
      role: 'employee',
      department: 'HQ Administration',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      joinDate: new Date('2022-01-15'),
      gender: 'male'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@brahmaputra.gov.in',
      password: 'password123',
      role: 'division_head',
      department: 'Project Division',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      joinDate: new Date('2020-06-10'),
      gender: 'female'
    },
    {
      name: 'Admin User',
      email: 'admin@brahmaputra.gov.in',
      password: 'admin123',
      role: 'administrator',
      department: 'Administration',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      joinDate: new Date('2019-01-01'),
      gender: 'other'
    },
    {
      name: 'Amit Patel',
      email: 'amit.patel@brahmaputra.gov.in',
      password: 'password123',
      role: 'employee',
      department: 'Field Unit',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      joinDate: new Date('2021-08-22'),
      gender: 'male'
    },
    {
      name: 'Sneha Das',
      email: 'sneha.das@brahmaputra.gov.in',
      password: 'password123',
      role: 'employee',
      department: 'HQ Administration',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
      joinDate: new Date('2022-03-05'),
      gender: 'female'
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@brahmaputra.gov.in',
      password: 'password123',
      role: 'employee',
      department: 'Project Division',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
      joinDate: new Date('2021-05-12'),
      gender: 'male'
    },
    {
      name: 'Anita Desai',
      email: 'anita.desai@brahmaputra.gov.in',
      password: 'password123',
      role: 'employee',
      department: 'Project Division',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita',
      joinDate: new Date('2022-09-08'),
      gender: 'female'
    },
    {
      name: 'Dr. Rajesh Verma',
      email: 'rajesh.verma@brahmaputra.gov.in',
      password: 'password123',
      role: 'division_head',
      department: 'Field Unit',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshVerma',
      joinDate: new Date('2018-03-15'),
      gender: 'male'
    },
    {
      name: 'Meera Joshi',
      email: 'meera.joshi@brahmaputra.gov.in',
      password: 'password123',
      role: 'employee',
      department: 'Finance',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
      joinDate: new Date('2021-11-20'),
      gender: 'female'
    },
    {
      name: 'Arjun Reddy',
      email: 'arjun.reddy@brahmaputra.gov.in',
      password: 'password123',
      role: 'employee',
      department: 'Field Unit',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
      joinDate: new Date('2020-07-10'),
      gender: 'male'
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`Created ${createdUsers.length} users.`);
  return createdUsers;
};

// Create KPIs
const createKPIs = async (adminUser) => {
  console.log('Creating KPIs...');
  
  const kpis = [
    // HQ Staff KPIs
    {
      name: 'File Disposal Rate',
      description: 'Percentage of files processed and disposed within stipulated timelines',
      weight: 20,
      type: 'quantitative',
      unit: '%',
      targetValue: 90,
      role: 'hq_staff',
      category: 'Efficiency',
      createdBy: adminUser._id
    },
    {
      name: 'Turnaround Time (TAT)',
      description: 'Average time taken to complete assigned tasks from receipt to completion',
      weight: 15,
      type: 'quantitative',
      unit: 'days',
      targetValue: 3,
      role: 'hq_staff',
      category: 'Speed',
      createdBy: adminUser._id
    },
    {
      name: 'Timely Report Submission',
      description: 'Percentage of reports submitted on or before the deadline',
      weight: 10,
      type: 'quantitative',
      unit: '%',
      targetValue: 95,
      role: 'hq_staff',
      category: 'Reliability',
      createdBy: adminUser._id
    },
    {
      name: 'Attendance & Punctuality',
      description: 'Regular attendance and punctuality record including on-time logins to e-Office',
      weight: 10,
      type: 'quantitative',
      unit: '%',
      targetValue: 98,
      role: 'hq_staff',
      category: 'Discipline',
      createdBy: adminUser._id
    },
    {
      name: 'Quality of Drafting',
      description: 'Accuracy, clarity, and compliance of drafted notes, letters, and documents',
      weight: 15,
      type: 'qualitative',
      unit: 'score',
      targetValue: 85,
      role: 'hq_staff',
      category: 'Quality',
      createdBy: adminUser._id
    },
    {
      name: 'Digital Tool Adoption',
      description: 'Effective utilization of e-Office features and digital workflow tools',
      weight: 10,
      type: 'quantitative',
      unit: '%',
      targetValue: 90,
      role: 'hq_staff',
      category: 'Technology',
      createdBy: adminUser._id
    },
    {
      name: 'Initiative & Innovation',
      description: 'Proactive suggestions for process improvements and innovative solutions',
      weight: 10,
      type: 'qualitative',
      unit: 'score',
      targetValue: 75,
      role: 'hq_staff',
      category: 'Innovation',
      createdBy: adminUser._id
    },
    {
      name: 'Collaboration & Teamwork',
      description: 'Cooperation with colleagues, interdepartmental coordination, and team support',
      weight: 10,
      type: 'qualitative',
      unit: 'score',
      targetValue: 80,
      role: 'hq_staff',
      category: 'Teamwork',
      createdBy: adminUser._id
    },

    // Field Unit KPIs
    {
      name: 'DPR Submission Timeliness',
      description: 'Percentage of Daily Progress Reports submitted on schedule without delays',
      weight: 20,
      type: 'quantitative',
      unit: '%',
      targetValue: 95,
      role: 'field_unit',
      category: 'Reporting',
      createdBy: adminUser._id
    },
    {
      name: 'Physical Progress Achievement',
      description: 'Percentage of project milestones completed as per approved timelines',
      weight: 25,
      type: 'quantitative',
      unit: '%',
      targetValue: 90,
      role: 'field_unit',
      category: 'Execution',
      createdBy: adminUser._id
    },
    {
      name: 'Budget Adherence',
      description: 'Variance between actual expenditure and approved budget allocations',
      weight: 15,
      type: 'quantitative',
      unit: '%',
      targetValue: 5,
      role: 'field_unit',
      category: 'Finance',
      createdBy: adminUser._id
    },
    {
      name: 'Survey & Data Accuracy',
      description: 'Error rate in field measurements, surveys, and data collection activities',
      weight: 10,
      type: 'quantitative',
      unit: '%',
      targetValue: 2,
      role: 'field_unit',
      category: 'Quality',
      createdBy: adminUser._id
    },
    {
      name: 'Quality Control Compliance',
      description: 'Adherence to technical specifications, standards, and quality benchmarks',
      weight: 10,
      type: 'qualitative',
      unit: 'score',
      targetValue: 90,
      role: 'field_unit',
      category: 'Standards',
      createdBy: adminUser._id
    },
    {
      name: 'Safety Compliance',
      description: 'Number of safety incidents and adherence to safety protocols on site',
      weight: 10,
      type: 'quantitative',
      unit: 'incidents',
      targetValue: 0,
      role: 'field_unit',
      category: 'Safety',
      createdBy: adminUser._id
    },
    {
      name: 'Resource Utilization Efficiency',
      description: 'Optimal use of equipment, materials, and manpower at project sites',
      weight: 10,
      type: 'qualitative',
      unit: 'score',
      targetValue: 85,
      role: 'field_unit',
      category: 'Efficiency',
      createdBy: adminUser._id
    },

    // Division Head KPIs
    {
      name: 'Team Performance Score',
      description: 'Average KPI achievement of all team members under supervision',
      weight: 25,
      type: 'quantitative',
      unit: '%',
      targetValue: 85,
      role: 'division_head',
      category: 'Leadership',
      createdBy: adminUser._id
    },
    {
      name: 'Project Milestone Monitoring',
      description: 'Percentage of project milestones tracked and achieved on schedule',
      weight: 25,
      type: 'quantitative',
      unit: '%',
      targetValue: 90,
      role: 'division_head',
      category: 'Management',
      createdBy: adminUser._id
    },
    {
      name: 'Approval & Decision Timeliness',
      description: 'Average time taken for file approvals and administrative decisions',
      weight: 15,
      type: 'quantitative',
      unit: 'days',
      targetValue: 2,
      role: 'division_head',
      category: 'Speed',
      createdBy: adminUser._id
    },
    {
      name: 'Budget Utilization Management',
      description: 'Effectiveness in budget allocation, monitoring, and utilization for division',
      weight: 10,
      type: 'quantitative',
      unit: '%',
      targetValue: 95,
      role: 'division_head',
      category: 'Finance',
      createdBy: adminUser._id
    },
    {
      name: 'Communication & Coordination',
      description: 'Quality of interdepartmental coordination and stakeholder communication',
      weight: 10,
      type: 'qualitative',
      unit: 'score',
      targetValue: 85,
      role: 'division_head',
      category: 'Communication',
      createdBy: adminUser._id
    },
    {
      name: 'Staff Development & Mentorship',
      description: 'Efforts in team capacity building, training, and performance guidance',
      weight: 10,
      type: 'qualitative',
      unit: 'score',
      targetValue: 80,
      role: 'division_head',
      category: 'Development',
      createdBy: adminUser._id
    },
    {
      name: 'Grievance Resolution Time',
      description: 'Average time taken to address and resolve team member grievances',
      weight: 5,
      type: 'quantitative',
      unit: 'days',
      targetValue: 5,
      role: 'division_head',
      category: 'Welfare',
      createdBy: adminUser._id
    }
  ];

  const createdKPIs = await KPI.insertMany(kpis);
  console.log(`Created ${createdKPIs.length} KPIs.`);
  return createdKPIs;
};

// Create scores
const createScores = async (users, kpis) => {
  console.log('Creating scores...');
  
  const scores = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = 2025;
  
  // Generate scores for each user
  for (const user of users) {
    if (user.role === 'administrator') continue;
    
    // Determine user's KPI role
    const userRole = user.department === 'Field Unit' ? 'field_unit' : 
                    user.role === 'division_head' ? 'division_head' : 'hq_staff';
    
    const userKPIs = kpis.filter(kpi => kpi.role === userRole);
    
    // Generate scores for last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = months[11 - i];
      const year = i === 0 ? currentYear : currentYear - 1;
      
      for (const kpi of userKPIs) {
        // Generate realistic score based on KPI type and target
        let value;
        if (kpi.type === 'quantitative') {
          const baseValue = kpi.targetValue * 0.8; // Start at 80% of target
          const improvement = (5 - i) * 0.02; // Gradual improvement
          const randomVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
          value = Math.min(kpi.targetValue * 1.1, baseValue + improvement + randomVariation);
        } else {
          const baseValue = kpi.targetValue * 0.85; // Start at 85% of target
          const improvement = (5 - i) * 0.015; // Gradual improvement
          const randomVariation = (Math.random() - 0.5) * 0.08; // ±4% variation
          value = Math.min(kpi.targetValue * 1.05, baseValue + improvement + randomVariation);
        }
        
        // Round to appropriate decimal places
        value = Math.round(value * 10) / 10;
        
        scores.push({
          userId: user._id,
          kpiId: kpi._id,
          value,
          target: kpi.targetValue,
          month,
          year,
          period: `${month} ${year}`,
          evaluatedBy: user.role === 'employee' ? 
            users.find(u => u.role === 'division_head' && u.department === user.department)?._id : 
            user._id,
          notes: i === 0 ? 'Current month performance' : `Historical data for ${month} ${year}`,
          source: 'system',
          verified: user.role === 'employee' ? Math.random() > 0.3 : true,
          verifiedBy: user.role === 'employee' ? 
            users.find(u => u.role === 'division_head' && u.department === user.department)?._id : 
            null,
          verifiedAt: user.role === 'employee' ? new Date() : null
        });
      }
    }
  }
  
  const createdScores = await Score.insertMany(scores);
  console.log(`Created ${createdScores.length} scores.`);
  return createdScores;
};

// Create tasks
const createTasks = async (users) => {
  console.log('Creating tasks...');
  
  const tasks = [];
  const projects = [
    'Flood Management Initiative',
    'Dam Construction Phase 2',
    'Irrigation Canal Modernization',
    'Water Quality Monitoring',
    'Erosion Control Project',
    'Drainage System Upgrade',
    'Rural Water Supply',
    'Flood Forecasting System',
    'Embankment Strengthening',
    'Agricultural Irrigation'
  ];
  
  const taskTemplates = [
    {
      title: 'Prepare Monthly Report',
      description: 'Compile data and prepare comprehensive monthly progress report',
      priority: 'high'
    },
    {
      title: 'Review Project Proposal',
      description: 'Review and provide feedback on project proposal documents',
      priority: 'medium'
    },
    {
      title: 'Site Inspection Report',
      description: 'Conduct site inspection and submit detailed findings report',
      priority: 'high'
    },
    {
      title: 'Budget Analysis',
      description: 'Analyze budget utilization and prepare variance report',
      priority: 'medium'
    },
    {
      title: 'Team Meeting Preparation',
      description: 'Prepare agenda and materials for team coordination meeting',
      priority: 'low'
    },
    {
      title: 'DPR Review',
      description: 'Review Detailed Project Report and provide recommendations',
      priority: 'high'
    },
    {
      title: 'File Approval',
      description: 'Review and approve pending administrative files',
      priority: 'medium'
    },
    {
      title: 'Survey Data Upload',
      description: 'Upload field survey data to the system',
      priority: 'medium'
    },
    {
      title: 'Budget Review',
      description: 'Review budget allocations and utilization for next quarter',
      priority: 'high'
    },
    {
      title: 'Erosion Assessment',
      description: 'Conduct erosion control site assessment and evaluation',
      priority: 'high'
    },
    {
      title: 'Water Quality Test',
      description: 'Conduct water quality testing and submit results',
      priority: 'medium'
    },
    {
      title: 'Stakeholder Meeting',
      description: 'Organize stakeholder consultation meeting',
      priority: 'high'
    },
    {
      title: 'Safety Audit',
      description: 'Complete annual safety audit report',
      priority: 'high'
    },
    {
      title: 'Equipment Maintenance',
      description: 'Log equipment maintenance records and schedule',
      priority: 'low'
    },
    {
      title: 'Training Module',
      description: 'Complete digital tools training module',
      priority: 'medium'
    }
  ];
  
  // Create tasks for each user
  for (const user of users) {
    if (user.role === 'administrator') continue;
    
    const userTasks = Math.floor(Math.random() * 8) + 5; // 5-12 tasks per user
    
    for (let i = 0; i < userTasks; i++) {
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const project = projects[Math.floor(Math.random() * projects.length)];
      const statuses = ['todo', 'in_progress', 'done'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Create deadline (past, present, or future)
      const daysOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + daysOffset);
      
      // Determine assigned by (division head for employees, admin for division heads)
      let assignedBy;
      if (user.role === 'employee') {
        assignedBy = users.find(u => u.role === 'division_head' && u.department === user.department);
      } else {
        assignedBy = users.find(u => u.role === 'administrator');
      }
      
      tasks.push({
        title: template.title,
        description: template.description,
        status,
        assignedTo: user._id,
        assignedBy: assignedBy?._id,
        deadline,
        priority: template.priority,
        project,
        estimatedHours: Math.floor(Math.random() * 16) + 4, // 4-20 hours
        actualHours: status === 'done' ? Math.floor(Math.random() * 20) + 2 : 0,
        completionNotes: status === 'done' ? 'Task completed successfully' : undefined,
        completedAt: status === 'done' ? new Date(deadline.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        comments: Math.random() > 0.7 ? [{
          userId: assignedBy?._id || user._id,
          comment: 'Progress update: Task is proceeding as planned.',
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }] : []
      });
    }
  }
  
  const createdTasks = await Task.insertMany(tasks);
  console.log(`Created ${createdTasks.length} tasks.`);
  return createdTasks;
};

// Create notifications
const createNotifications = async (users) => {
  console.log('Creating notifications...');
  
  const notifications = [];
  const notificationTypes = [
    {
      type: 'task',
      title: 'New Task Assigned',
      message: 'You have been assigned a new task',
      priority: 'medium'
    },
    {
      type: 'deadline',
      title: 'Upcoming Deadline',
      message: 'Task deadline approaching',
      priority: 'high'
    },
    {
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: 'You have earned a new achievement',
      priority: 'low'
    },
    {
      type: 'alert',
      title: 'System Alert',
      message: 'Important system notification',
      priority: 'high'
    },
    {
      type: 'kpi',
      title: 'KPI Score Submitted',
      message: 'New KPI score has been submitted',
      priority: 'medium'
    }
  ];
  
  // Create notifications for each user
  for (const user of users) {
    const userNotifications = Math.floor(Math.random() * 10) + 5; // 5-14 notifications per user
    
    for (let i = 0; i < userNotifications; i++) {
      const notificationType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const read = Math.random() > 0.4; // 60% chance of being read
      
      notifications.push({
        userId: user._id,
        type: notificationType.type,
        title: notificationType.title,
        message: notificationType.message,
        read,
        priority: notificationType.priority,
        link: '/dashboard',
        readAt: read ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
      });
    }
  }
  
  const createdNotifications = await Notification.insertMany(notifications);
  console.log(`Created ${createdNotifications.length} notifications.`);
  return createdNotifications;
};

// Create financial data
const createFinancialData = async () => {
  console.log('Creating financial data...');
  
  const financialData = [
    {
      projectId: 'PMI-001',
      projectName: 'Flood Management Initiative',
      budget: 50000000,
      spent: 32000000,
      estimation: 35000000,
      category: 'Infrastructure',
      department: 'Project Division',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      progress: 64,
      currency: 'INR'
    },
    {
      projectId: 'PMI-002',
      projectName: 'Dam Construction Phase 2',
      budget: 120000000,
      spent: 98000000,
      estimation: 95000000,
      category: 'Infrastructure',
      department: 'Field Unit',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2025-06-30'),
      progress: 82,
      currency: 'INR'
    },
    {
      projectId: 'PMI-003',
      projectName: 'Irrigation Canal Modernization',
      budget: 75000000,
      spent: 42000000,
      estimation: 50000000,
      category: 'Agriculture',
      department: 'Field Unit',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2026-02-28'),
      progress: 56,
      currency: 'INR'
    },
    {
      projectId: 'PMI-004',
      projectName: 'Water Quality Monitoring',
      budget: 15000000,
      spent: 8500000,
      estimation: 10000000,
      category: 'Monitoring',
      department: 'HQ Administration',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      progress: 57,
      currency: 'INR'
    },
    {
      projectId: 'PMI-005',
      projectName: 'Erosion Control Project',
      budget: 35000000,
      spent: 22000000,
      estimation: 28000000,
      category: 'Environment',
      department: 'Field Unit',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2025-03-31'),
      progress: 63,
      currency: 'INR'
    },
    {
      projectId: 'PMI-006',
      projectName: 'Drainage System Upgrade',
      budget: 42000000,
      spent: 38000000,
      estimation: 45000000,
      category: 'Infrastructure',
      department: 'Project Division',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2025-08-31'),
      progress: 90,
      currency: 'INR'
    },
    {
      projectId: 'PMI-007',
      projectName: 'Rural Water Supply',
      budget: 28000000,
      spent: 15000000,
      estimation: 20000000,
      category: 'Water Supply',
      department: 'Field Unit',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2026-07-31'),
      progress: 54,
      currency: 'INR'
    },
    {
      projectId: 'PMI-008',
      projectName: 'Flood Forecasting System',
      budget: 18000000,
      spent: 12000000,
      estimation: 14000000,
      category: 'Technology',
      department: 'HQ Administration',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2025-04-30'),
      progress: 67,
      currency: 'INR'
    },
    {
      projectId: 'PMI-009',
      projectName: 'Embankment Strengthening',
      budget: 55000000,
      spent: 48000000,
      estimation: 52000000,
      category: 'Infrastructure',
      department: 'Field Unit',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2025-11-30'),
      progress: 87,
      currency: 'INR'
    },
    {
      projectId: 'PMI-010',
      projectName: 'Agricultural Irrigation',
      budget: 32000000,
      spent: 18000000,
      estimation: 24000000,
      category: 'Agriculture',
      department: 'Field Unit',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2026-08-31'),
      progress: 56,
      currency: 'INR'
    }
  ];
  
  const createdFinancialData = await Finance.insertMany(financialData);
  console.log(`Created ${createdFinancialData.length} financial records.`);
  return createdFinancialData;
};

// Create audit logs
const createAuditLogs = async (users) => {
  console.log('Creating audit logs...');
  
  const auditLogs = [];
  const actions = [
    'User Login',
    'User Logout',
    'Task Created',
    'Task Updated',
    'Task Status Changed',
    'KPI Score Submitted',
    'KPI Score Verified',
    'Notification Created',
    'Profile Updated',
    'File Uploaded',
    'Report Generated',
    'Budget Updated',
    'User Registered',
    'Password Changed',
    'System Backup'
  ];
  
  const entityTypes = ['user', 'task', 'kpi', 'score', 'notification', 'finance', 'system'];
  const categories = ['create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import', 'system'];
  
  // Create audit logs for each user
  for (const user of users) {
    const userLogs = Math.floor(Math.random() * 50) + 20; // 20-69 logs per user
    
    for (let i = 0; i < userLogs; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      auditLogs.push({
        userId: user._id,
        userName: user.name,
        action,
        entityType,
        entityId: Math.random().toString(36).substr(2, 9),
        project: Math.random() > 0.5 ? 'Project Management' : undefined,
        siteInfo: Math.random() > 0.7 ? 'HQ Office' : undefined,
        details: `${action} performed by ${user.name}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: Math.random() > 0.8 ? 'medium' : 'low',
        category,
        timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Last 90 days
      });
    }
  }
  
  const createdAuditLogs = await AuditLog.insertMany(auditLogs);
  console.log(`Created ${createdAuditLogs.length} audit logs.`);
  return createdAuditLogs;
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await clearDatabase();
    
    // Create users
    const users = await createUsers();
    const adminUser = users.find(u => u.role === 'administrator');
    
    // Create KPIs
    const kpis = await createKPIs(adminUser);
    
    // Create scores
    const scores = await createScores(users, kpis);
    
    // Create tasks
    const tasks = await createTasks(users);
    
    // Create notifications
    const notifications = await createNotifications(users);
    
    // Create financial data
    const financialData = await createFinancialData();
    
    // Create audit logs
    const auditLogs = await createAuditLogs(users);
    
    console.log('\n=== SEEDING COMPLETE ===');
    console.log(`Users: ${users.length}`);
    console.log(`KPIs: ${kpis.length}`);
    console.log(`Scores: ${scores.length}`);
    console.log(`Tasks: ${tasks.length}`);
    console.log(`Notifications: ${notifications.length}`);
    console.log(`Financial Records: ${financialData.length}`);
    console.log(`Audit Logs: ${auditLogs.length}`);
    console.log('\nDatabase successfully seeded!');
    
    // Print sample login credentials
    console.log('\n=== SAMPLE LOGIN CREDENTIALS ===');
    console.log('Admin: admin@brahmaputra.gov.in / admin123');
    console.log('Division Head: priya.sharma@brahmaputra.gov.in / password123');
    console.log('Employee: rajesh.kumar@brahmaputra.gov.in / password123');
    console.log('Field Unit: amit.patel@brahmaputra.gov.in / password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase;
