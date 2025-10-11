export interface KPIDefinition {
  id: string;
  name: string;
  description: string;
  weight: number;
  type: 'quantitative' | 'qualitative';
  unit: string;
  targetValue: number;
  role: 'hq_staff' | 'field_unit' | 'division_head';
  category: string;
}

export interface KPIRecord {
  id: string;
  userId: string;
  kpiId: string;
  value: number;
  target: number;
  month: string;
  year: number;
  evaluatedBy?: string;
  notes?: string;
  timestamp: string;
}

export interface KPITrendData {
  month: string;
  value: number;
  target: number;
  kpiName: string;
}

export const HQ_STAFF_KPIS: KPIDefinition[] = [
  {
    id: 'hq_file_disposal',
    name: 'File Disposal Rate',
    description: 'Percentage of files processed and disposed within stipulated timelines',
    weight: 20,
    type: 'quantitative',
    unit: '%',
    targetValue: 90,
    role: 'hq_staff',
    category: 'Efficiency'
  },
  {
    id: 'hq_tat',
    name: 'Turnaround Time (TAT)',
    description: 'Average time taken to complete assigned tasks from receipt to completion',
    weight: 15,
    type: 'quantitative',
    unit: 'days',
    targetValue: 3,
    role: 'hq_staff',
    category: 'Speed'
  },
  {
    id: 'hq_timely_reports',
    name: 'Timely Report Submission',
    description: 'Percentage of reports submitted on or before the deadline',
    weight: 10,
    type: 'quantitative',
    unit: '%',
    targetValue: 95,
    role: 'hq_staff',
    category: 'Reliability'
  },
  {
    id: 'hq_attendance',
    name: 'Attendance & Punctuality',
    description: 'Regular attendance and punctuality record including on-time logins to e-Office',
    weight: 10,
    type: 'quantitative',
    unit: '%',
    targetValue: 98,
    role: 'hq_staff',
    category: 'Discipline'
  },
  {
    id: 'hq_quality_drafting',
    name: 'Quality of Drafting',
    description: 'Accuracy, clarity, and compliance of drafted notes, letters, and documents',
    weight: 15,
    type: 'qualitative',
    unit: 'score',
    targetValue: 85,
    role: 'hq_staff',
    category: 'Quality'
  },
  {
    id: 'hq_digital_adoption',
    name: 'Digital Tool Adoption',
    description: 'Effective utilization of e-Office features and digital workflow tools',
    weight: 10,
    type: 'quantitative',
    unit: '%',
    targetValue: 90,
    role: 'hq_staff',
    category: 'Technology'
  },
  {
    id: 'hq_initiative',
    name: 'Initiative & Innovation',
    description: 'Proactive suggestions for process improvements and innovative solutions',
    weight: 10,
    type: 'qualitative',
    unit: 'score',
    targetValue: 75,
    role: 'hq_staff',
    category: 'Innovation'
  },
  {
    id: 'hq_collaboration',
    name: 'Collaboration & Teamwork',
    description: 'Cooperation with colleagues, interdepartmental coordination, and team support',
    weight: 10,
    type: 'qualitative',
    unit: 'score',
    targetValue: 80,
    role: 'hq_staff',
    category: 'Teamwork'
  }
];

export const FIELD_UNIT_KPIS: KPIDefinition[] = [
  {
    id: 'field_dpr_timeliness',
    name: 'DPR Submission Timeliness',
    description: 'Percentage of Daily Progress Reports submitted on schedule without delays',
    weight: 20,
    type: 'quantitative',
    unit: '%',
    targetValue: 95,
    role: 'field_unit',
    category: 'Reporting'
  },
  {
    id: 'field_physical_progress',
    name: 'Physical Progress Achievement',
    description: 'Percentage of project milestones completed as per approved timelines',
    weight: 25,
    type: 'quantitative',
    unit: '%',
    targetValue: 90,
    role: 'field_unit',
    category: 'Execution'
  },
  {
    id: 'field_budget_adherence',
    name: 'Budget Adherence',
    description: 'Variance between actual expenditure and approved budget allocations',
    weight: 15,
    type: 'quantitative',
    unit: '%',
    targetValue: 5,
    role: 'field_unit',
    category: 'Finance'
  },
  {
    id: 'field_survey_accuracy',
    name: 'Survey & Data Accuracy',
    description: 'Error rate in field measurements, surveys, and data collection activities',
    weight: 10,
    type: 'quantitative',
    unit: '%',
    targetValue: 2,
    role: 'field_unit',
    category: 'Quality'
  },
  {
    id: 'field_quality_control',
    name: 'Quality Control Compliance',
    description: 'Adherence to technical specifications, standards, and quality benchmarks',
    weight: 10,
    type: 'qualitative',
    unit: 'score',
    targetValue: 90,
    role: 'field_unit',
    category: 'Standards'
  },
  {
    id: 'field_safety',
    name: 'Safety Compliance',
    description: 'Number of safety incidents and adherence to safety protocols on site',
    weight: 10,
    type: 'quantitative',
    unit: 'incidents',
    targetValue: 0,
    role: 'field_unit',
    category: 'Safety'
  },
  {
    id: 'field_resource_utilization',
    name: 'Resource Utilization Efficiency',
    description: 'Optimal use of equipment, materials, and manpower at project sites',
    weight: 10,
    type: 'qualitative',
    unit: 'score',
    targetValue: 85,
    role: 'field_unit',
    category: 'Efficiency'
  }
];

export const DIVISION_HEAD_KPIS: KPIDefinition[] = [
  {
    id: 'dh_team_score',
    name: 'Team Performance Score',
    description: 'Average KPI achievement of all team members under supervision',
    weight: 25,
    type: 'quantitative',
    unit: '%',
    targetValue: 85,
    role: 'division_head',
    category: 'Leadership'
  },
  {
    id: 'dh_project_monitoring',
    name: 'Project Milestone Monitoring',
    description: 'Percentage of project milestones tracked and achieved on schedule',
    weight: 25,
    type: 'quantitative',
    unit: '%',
    targetValue: 90,
    role: 'division_head',
    category: 'Management'
  },
  {
    id: 'dh_approval_timeliness',
    name: 'Approval & Decision Timeliness',
    description: 'Average time taken for file approvals and administrative decisions',
    weight: 15,
    type: 'quantitative',
    unit: 'days',
    targetValue: 2,
    role: 'division_head',
    category: 'Speed'
  },
  {
    id: 'dh_budget_utilization',
    name: 'Budget Utilization Management',
    description: 'Effectiveness in budget allocation, monitoring, and utilization for division',
    weight: 10,
    type: 'quantitative',
    unit: '%',
    targetValue: 95,
    role: 'division_head',
    category: 'Finance'
  },
  {
    id: 'dh_communication',
    name: 'Communication & Coordination',
    description: 'Quality of interdepartmental coordination and stakeholder communication',
    weight: 10,
    type: 'qualitative',
    unit: 'score',
    targetValue: 85,
    role: 'division_head',
    category: 'Communication'
  },
  {
    id: 'dh_staff_development',
    name: 'Staff Development & Mentorship',
    description: 'Efforts in team capacity building, training, and performance guidance',
    weight: 10,
    type: 'qualitative',
    unit: 'score',
    targetValue: 80,
    role: 'division_head',
    category: 'Development'
  },
  {
    id: 'dh_grievance',
    name: 'Grievance Resolution Time',
    description: 'Average time taken to address and resolve team member grievances',
    weight: 5,
    type: 'quantitative',
    unit: 'days',
    targetValue: 5,
    role: 'division_head',
    category: 'Welfare'
  }
];

export const KPI_CORE_CONCEPTS = {
  kpi: {
    title: 'Key Performance Indicator (KPI)',
    description: 'A measurable value that demonstrates how effectively an employee is achieving key objectives. KPIs help track progress, identify areas for improvement, and recognize excellence.'
  },
  quantitative: {
    title: 'Quantitative Metrics',
    description: 'Objective, numerical measurements that can be precisely calculated (e.g., percentage, days, counts). These typically comprise 70-80% of performance evaluation.'
  },
  qualitative: {
    title: 'Qualitative Metrics',
    description: 'Subjective assessments based on quality, behavior, and soft skills evaluated through observations and feedback. These typically comprise 20-30% of performance evaluation.'
  },
  weightage: {
    title: 'Weightage',
    description: 'The relative importance of each KPI in overall performance calculation. Higher weightage indicates greater impact on final performance score. All KPI weights sum to 100%.'
  }
};
