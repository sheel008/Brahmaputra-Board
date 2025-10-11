// Comprehensive KPI data for analytics and timelines

export const expandedTimelineData = {
  hq_staff: [
    { month: 'Jan', score: 76, target: 85 },
    { month: 'Feb', score: 78, target: 85 },
    { month: 'Mar', score: 81, target: 85 },
    { month: 'Apr', score: 79, target: 85 },
    { month: 'May', score: 83, target: 85 },
    { month: 'Jun', score: 85, target: 85 },
    { month: 'Jul', score: 84, target: 85 },
    { month: 'Aug', score: 86, target: 85 },
    { month: 'Sep', score: 87, target: 85 },
    { month: 'Oct', score: 88, target: 85 },
    { month: 'Nov', score: 89, target: 85 },
    { month: 'Dec', score: 90, target: 85 }
  ],
  field_unit: [
    { month: 'Jan', score: 65, target: 85 },
    { month: 'Feb', score: 68, target: 85 },
    { month: 'Mar', score: 72, target: 85 },
    { month: 'Apr', score: 75, target: 85 },
    { month: 'May', score: 78, target: 85 },
    { month: 'Jun', score: 81, target: 85 },
    { month: 'Jul', score: 83, target: 85 },
    { month: 'Aug', score: 85, target: 85 },
    { month: 'Sep', score: 87, target: 85 },
    { month: 'Oct', score: 89, target: 85 },
    { month: 'Nov', score: 91, target: 85 },
    { month: 'Dec', score: 92, target: 85 }
  ],
  division_head: [
    { month: 'Jan', score: 82, target: 85 },
    { month: 'Feb', score: 83, target: 85 },
    { month: 'Mar', score: 84, target: 85 },
    { month: 'Apr', score: 85, target: 85 },
    { month: 'May', score: 86, target: 85 },
    { month: 'Jun', score: 87, target: 85 },
    { month: 'Jul', score: 88, target: 85 },
    { month: 'Aug', score: 89, target: 85 },
    { month: 'Sep', score: 90, target: 85 },
    { month: 'Oct', score: 91, target: 85 },
    { month: 'Nov', score: 92, target: 85 },
    { month: 'Dec', score: 93, target: 85 }
  ]
};

export const expandedDistributionData = {
  hq_staff: [
    { range: '0-50', count: 2 },
    { range: '51-65', count: 5 },
    { range: '66-75', count: 12 },
    { range: '76-85', count: 18 },
    { range: '86-100', count: 15 }
  ],
  field_unit: [
    { range: '0-50', count: 4 },
    { range: '51-65', count: 8 },
    { range: '66-75', count: 10 },
    { range: '76-85', count: 16 },
    { range: '86-100', count: 14 }
  ],
  division_head: [
    { range: '0-50', count: 1 },
    { range: '51-65', count: 3 },
    { range: '66-75', count: 8 },
    { range: '76-85', count: 20 },
    { range: '86-100', count: 18 }
  ]
};

export const expandedCategoryBreakdown = {
  hq_staff: [
    { category: 'Efficiency', avgScore: 87.5 },
    { category: 'Speed', avgScore: 82.3 },
    { category: 'Reliability', avgScore: 89.1 },
    { category: 'Discipline', avgScore: 91.2 },
    { category: 'Quality', avgScore: 84.8 },
    { category: 'Technology', avgScore: 86.4 },
    { category: 'Innovation', avgScore: 79.5 },
    { category: 'Teamwork', avgScore: 85.7 }
  ],
  field_unit: [
    { category: 'Reporting', avgScore: 88.3 },
    { category: 'Execution', avgScore: 85.6 },
    { category: 'Finance', avgScore: 82.1 },
    { category: 'Quality', avgScore: 89.4 },
    { category: 'Standards', avgScore: 87.2 },
    { category: 'Safety', avgScore: 92.8 },
    { category: 'Efficiency', avgScore: 84.9 }
  ],
  division_head: [
    { category: 'Leadership', avgScore: 88.7 },
    { category: 'Management', avgScore: 90.2 },
    { category: 'Speed', avgScore: 86.5 },
    { category: 'Finance', avgScore: 89.3 },
    { category: 'Communication', avgScore: 87.8 },
    { category: 'Development', avgScore: 85.4 },
    { category: 'Welfare', avgScore: 91.6 }
  ]
};

export const expandedStatistics = {
  hq_staff: {
    mean: 82.3,
    median: 83.5,
    variance: 145.2,
    stdDev: 12.05,
    cv: 0.146
  },
  field_unit: {
    mean: 79.8,
    median: 81.0,
    variance: 182.4,
    stdDev: 13.51,
    cv: 0.169
  },
  division_head: {
    mean: 86.7,
    median: 87.5,
    variance: 98.3,
    stdDev: 9.91,
    cv: 0.114
  }
};

export const expandedSurveyData = [
  // HQ Staff Surveys (50+ entries)
  { employeeId: 'e1', category: 'Quality of Drafting', rating: 4.2, period: 'Q1-2025' },
  { employeeId: 'e1', category: 'Initiative & Innovation', rating: 3.8, period: 'Q1-2025' },
  { employeeId: 'e1', category: 'Collaboration & Teamwork', rating: 4.5, period: 'Q1-2025' },
  { employeeId: 'e1', category: 'Quality of Drafting', rating: 4.4, period: 'Q2-2025' },
  { employeeId: 'e1', category: 'Initiative & Innovation', rating: 4.0, period: 'Q2-2025' },
  { employeeId: 'e1', category: 'Collaboration & Teamwork', rating: 4.6, period: 'Q2-2025' },
  { employeeId: 'e1', category: 'Quality of Drafting', rating: 4.3, period: 'Q3-2025' },
  { employeeId: 'e1', category: 'Initiative & Innovation', rating: 4.1, period: 'Q3-2025' },
  { employeeId: 'e1', category: 'Collaboration & Teamwork', rating: 4.7, period: 'Q3-2025' },
  { employeeId: 'e1', category: 'Quality of Drafting', rating: 4.5, period: 'Q4-2025' },
  { employeeId: 'e1', category: 'Initiative & Innovation', rating: 4.2, period: 'Q4-2025' },
  { employeeId: 'e1', category: 'Collaboration & Teamwork', rating: 4.8, period: 'Q4-2025' },
  
  { employeeId: 'e4', category: 'Quality of Drafting', rating: 4.0, period: 'Q1-2025' },
  { employeeId: 'e4', category: 'Initiative & Innovation', rating: 3.5, period: 'Q1-2025' },
  { employeeId: 'e4', category: 'Collaboration & Teamwork', rating: 4.3, period: 'Q1-2025' },
  { employeeId: 'e4', category: 'Quality of Drafting', rating: 4.2, period: 'Q2-2025' },
  { employeeId: 'e4', category: 'Initiative & Innovation', rating: 3.8, period: 'Q2-2025' },
  { employeeId: 'e4', category: 'Collaboration & Teamwork', rating: 4.4, period: 'Q2-2025' },
  { employeeId: 'e4', category: 'Quality of Drafting', rating: 4.3, period: 'Q3-2025' },
  { employeeId: 'e4', category: 'Initiative & Innovation', rating: 4.0, period: 'Q3-2025' },
  { employeeId: 'e4', category: 'Collaboration & Teamwork', rating: 4.5, period: 'Q3-2025' },
  { employeeId: 'e4', category: 'Quality of Drafting', rating: 4.4, period: 'Q4-2025' },
  { employeeId: 'e4', category: 'Initiative & Innovation', rating: 4.1, period: 'Q4-2025' },
  { employeeId: 'e4', category: 'Collaboration & Teamwork', rating: 4.6, period: 'Q4-2025' },

  // Field Unit Surveys
  { employeeId: 'e2', category: 'Quality Control Compliance', rating: 4.5, period: 'Q1-2025' },
  { employeeId: 'e2', category: 'Resource Utilization Efficiency', rating: 4.2, period: 'Q1-2025' },
  { employeeId: 'e2', category: 'Quality Control Compliance', rating: 4.6, period: 'Q2-2025' },
  { employeeId: 'e2', category: 'Resource Utilization Efficiency', rating: 4.3, period: 'Q2-2025' },
  { employeeId: 'e2', category: 'Quality Control Compliance', rating: 4.7, period: 'Q3-2025' },
  { employeeId: 'e2', category: 'Resource Utilization Efficiency', rating: 4.4, period: 'Q3-2025' },
  { employeeId: 'e2', category: 'Quality Control Compliance', rating: 4.8, period: 'Q4-2025' },
  { employeeId: 'e2', category: 'Resource Utilization Efficiency', rating: 4.5, period: 'Q4-2025' },
  
  { employeeId: 'e5', category: 'Quality Control Compliance', rating: 4.1, period: 'Q1-2025' },
  { employeeId: 'e5', category: 'Resource Utilization Efficiency', rating: 3.9, period: 'Q1-2025' },
  { employeeId: 'e5', category: 'Quality Control Compliance', rating: 4.3, period: 'Q2-2025' },
  { employeeId: 'e5', category: 'Resource Utilization Efficiency', rating: 4.1, period: 'Q2-2025' },
  { employeeId: 'e5', category: 'Quality Control Compliance', rating: 4.4, period: 'Q3-2025' },
  { employeeId: 'e5', category: 'Resource Utilization Efficiency', rating: 4.2, period: 'Q3-2025' },
  { employeeId: 'e5', category: 'Quality Control Compliance', rating: 4.5, period: 'Q4-2025' },
  { employeeId: 'e5', category: 'Resource Utilization Efficiency', rating: 4.3, period: 'Q4-2025' },

  // Division Head Surveys
  { employeeId: 'e3', category: 'Communication & Coordination', rating: 4.4, period: 'Q1-2025' },
  { employeeId: 'e3', category: 'Staff Development & Mentorship', rating: 4.6, period: 'Q1-2025' },
  { employeeId: 'e3', category: 'Communication & Coordination', rating: 4.5, period: 'Q2-2025' },
  { employeeId: 'e3', category: 'Staff Development & Mentorship', rating: 4.7, period: 'Q2-2025' },
  { employeeId: 'e3', category: 'Communication & Coordination', rating: 4.6, period: 'Q3-2025' },
  { employeeId: 'e3', category: 'Staff Development & Mentorship', rating: 4.8, period: 'Q3-2025' },
  { employeeId: 'e3', category: 'Communication & Coordination', rating: 4.7, period: 'Q4-2025' },
  { employeeId: 'e3', category: 'Staff Development & Mentorship', rating: 4.9, period: 'Q4-2025' },
  
  { employeeId: 'e6', category: 'Communication & Coordination', rating: 4.2, period: 'Q1-2025' },
  { employeeId: 'e6', category: 'Staff Development & Mentorship', rating: 4.3, period: 'Q1-2025' },
  { employeeId: 'e6', category: 'Communication & Coordination', rating: 4.3, period: 'Q2-2025' },
  { employeeId: 'e6', category: 'Staff Development & Mentorship', rating: 4.4, period: 'Q2-2025' },
  { employeeId: 'e6', category: 'Communication & Coordination', rating: 4.4, period: 'Q3-2025' },
  { employeeId: 'e6', category: 'Staff Development & Mentorship', rating: 4.5, period: 'Q3-2025' },
  { employeeId: 'e6', category: 'Communication & Coordination', rating: 4.5, period: 'Q4-2025' },
  { employeeId: 'e6', category: 'Staff Development & Mentorship', rating: 4.6, period: 'Q4-2025' }
];

export const barChartExpandedData = {
  hq_staff: [
    { kpi: 'File Disposal', score: 89, target: 90, weight: 20 },
    { kpi: 'TAT', score: 85, target: 87, weight: 15 },
    { kpi: 'Timely Reports', score: 92, target: 95, weight: 10 },
    { kpi: 'Attendance', score: 96, target: 98, weight: 10 },
    { kpi: 'Quality Drafting', score: 87, target: 85, weight: 15 },
    { kpi: 'Digital Adoption', score: 88, target: 90, weight: 10 },
    { kpi: 'Initiative', score: 78, target: 75, weight: 10 },
    { kpi: 'Collaboration', score: 84, target: 80, weight: 10 }
  ],
  field_unit: [
    { kpi: 'DPR Timeliness', score: 93, target: 95, weight: 20 },
    { kpi: 'Physical Progress', score: 87, target: 90, weight: 25 },
    { kpi: 'Budget Adherence', score: 91, target: 95, weight: 15 },
    { kpi: 'Survey Accuracy', score: 95, target: 98, weight: 10 },
    { kpi: 'Quality Control', score: 89, target: 90, weight: 10 },
    { kpi: 'Safety', score: 97, target: 100, weight: 10 },
    { kpi: 'Resource Utilization', score: 86, target: 85, weight: 10 }
  ],
  division_head: [
    { kpi: 'Team Score', score: 88, target: 85, weight: 25 },
    { kpi: 'Project Monitoring', score: 91, target: 90, weight: 25 },
    { kpi: 'Approval Timeliness', score: 93, target: 95, weight: 15 },
    { kpi: 'Budget Utilization', score: 94, target: 95, weight: 10 },
    { kpi: 'Communication', score: 87, target: 85, weight: 10 },
    { kpi: 'Staff Development', score: 90, target: 80, weight: 10 },
    { kpi: 'Grievance Resolution', score: 92, target: 90, weight: 5 }
  ]
};