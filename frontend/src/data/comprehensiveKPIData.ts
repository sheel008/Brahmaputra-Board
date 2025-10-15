import { KPIRecord, KPITrendData } from '@/types/kpi';

// Generate 6 months of KPI data for HQ Staff (20+ records per user)
export const generateHQStaffKPIData = (userId: string): KPIRecord[] => {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const kpis = [
    { id: 'hq_file_disposal', target: 90, base: 75 },
    { id: 'hq_tat', target: 3, base: 3.5 },
    { id: 'hq_timely_reports', target: 95, base: 88 },
    { id: 'hq_attendance', target: 98, base: 95 },
    { id: 'hq_quality_drafting', target: 85, base: 78 },
    { id: 'hq_digital_adoption', target: 90, base: 82 },
    { id: 'hq_initiative', target: 75, base: 70 },
    { id: 'hq_collaboration', target: 80, base: 75 }
  ];

  const records: KPIRecord[] = [];
  let recordId = 1;

  months.forEach((month, monthIndex) => {
    kpis.forEach((kpi) => {
      // Gradual improvement over months
      const improvement = (monthIndex / months.length) * 15;
      const randomVariation = (Math.random() - 0.5) * 5;
      const value = Math.min(kpi.target + 5, kpi.base + improvement + randomVariation);

      records.push({
        id: `hq_${userId}_${recordId++}`,
        userId,
        kpiId: kpi.id,
        value: Math.round(value * 10) / 10,
        target: kpi.target,
        month,
        year: monthIndex < 4 ? 2024 : 2025,
        evaluatedBy: '2',
        timestamp: `${monthIndex < 4 ? '2024' : '2025'}-${String(monthIndex < 4 ? monthIndex + 8 : monthIndex - 3).padStart(2, '0')}-28`
      });
    });
  });

  return records;
};

// Generate 6 months of KPI data for Field Units (20+ records per user)
export const generateFieldUnitKPIData = (userId: string): KPIRecord[] => {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const kpis = [
    { id: 'field_dpr_timeliness', target: 95, base: 85 },
    { id: 'field_physical_progress', target: 90, base: 80 },
    { id: 'field_budget_adherence', target: 5, base: 8, inverse: true },
    { id: 'field_survey_accuracy', target: 2, base: 3.5, inverse: true },
    { id: 'field_quality_control', target: 90, base: 82 },
    { id: 'field_safety', target: 0, base: 2, inverse: true },
    { id: 'field_resource_utilization', target: 85, base: 78 }
  ];

  const records: KPIRecord[] = [];
  let recordId = 1;

  months.forEach((month, monthIndex) => {
    kpis.forEach((kpi) => {
      // Gradual improvement over months
      const improvement = (monthIndex / months.length) * (kpi.inverse ? -3 : 10);
      const randomVariation = (Math.random() - 0.5) * (kpi.inverse ? 1 : 3);
      let value = kpi.base + improvement + randomVariation;

      if (kpi.inverse) {
        value = Math.max(kpi.target, value);
      } else {
        value = Math.min(kpi.target + 5, value);
      }

      records.push({
        id: `field_${userId}_${recordId++}`,
        userId,
        kpiId: kpi.id,
        value: Math.round(value * 10) / 10,
        target: kpi.target,
        month,
        year: monthIndex < 4 ? 2024 : 2025,
        evaluatedBy: '2',
        timestamp: `${monthIndex < 4 ? '2024' : '2025'}-${String(monthIndex < 4 ? monthIndex + 8 : monthIndex - 3).padStart(2, '0')}-28`
      });
    });
  });

  return records;
};

// Generate 6 months of KPI data for Division Heads (20+ records per user)
export const generateDivisionHeadKPIData = (userId: string): KPIRecord[] => {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const kpis = [
    { id: 'dh_team_score', target: 85, base: 78 },
    { id: 'dh_project_monitoring', target: 90, base: 82 },
    { id: 'dh_approval_timeliness', target: 2, base: 3.2, inverse: true },
    { id: 'dh_budget_utilization', target: 95, base: 88 },
    { id: 'dh_communication', target: 85, base: 80 },
    { id: 'dh_staff_development', target: 80, base: 72 },
    { id: 'dh_grievance', target: 5, base: 7, inverse: true }
  ];

  const records: KPIRecord[] = [];
  let recordId = 1;

  months.forEach((month, monthIndex) => {
    kpis.forEach((kpi) => {
      const improvement = (monthIndex / months.length) * (kpi.inverse ? -1.5 : 8);
      const randomVariation = (Math.random() - 0.5) * (kpi.inverse ? 0.5 : 2);
      let value = kpi.base + improvement + randomVariation;

      if (kpi.inverse) {
        value = Math.max(kpi.target, value);
      } else {
        value = Math.min(kpi.target + 5, value);
      }

      records.push({
        id: `dh_${userId}_${recordId++}`,
        userId,
        kpiId: kpi.id,
        value: Math.round(value * 10) / 10,
        target: kpi.target,
        month,
        year: monthIndex < 4 ? 2024 : 2025,
        evaluatedBy: '3',
        timestamp: `${monthIndex < 4 ? '2024' : '2025'}-${String(monthIndex < 4 ? monthIndex + 8 : monthIndex - 3).padStart(2, '0')}-28`
      });
    });
  });

  return records;
};

// Generate 12 months timeline data
export const generate12MonthsTimeline = (userId: string, role: 'hq_staff' | 'field_unit' | 'division_head'): KPITrendData[] => {
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const timeline: KPITrendData[] = [];

  months.forEach((month, index) => {
    const baseScore = 72 + (index * 1.5); // Gradual improvement
    const randomVar = (Math.random() - 0.5) * 4;
    const score = Math.min(95, baseScore + randomVar);

    timeline.push({
      month,
      value: Math.round(score * 10) / 10,
      target: 85,
      kpiName: 'Overall Performance'
    });
  });

  return timeline;
};

// Generate comprehensive survey data (30+ entries)
export const generateSurveyData = () => {
  const surveyTemplates = [
    { category: 'Communication', question: 'How would you rate your communication skills?', weight: 15 },
    { category: 'Technical Skills', question: 'Rate your technical proficiency in your domain', weight: 20 },
    { category: 'Problem Solving', question: 'How effective are you at solving complex problems?', weight: 20 },
    { category: 'Time Management', question: 'Rate your ability to manage time effectively', weight: 15 },
    { category: 'Teamwork', question: 'How well do you collaborate with team members?', weight: 15 },
    { category: 'Leadership', question: 'Rate your leadership and initiative-taking abilities', weight: 15 }
  ];

  const userIds = ['1', '4', '5', '6', '7'];
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const surveys: any[] = [];
  let surveyId = 1;

  userIds.forEach(userId => {
    months.forEach(month => {
      surveyTemplates.forEach(template => {
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 rating
        surveys.push({
          id: `survey_${surveyId++}`,
          userId,
          category: template.category,
          question: template.question,
          rating,
          month,
          weight: template.weight,
          timestamp: `2025-${month}-15`
        });
      });
    });
  });

  return surveys;
};

// All KPI records combined
export const allKPIRecords: KPIRecord[] = [
  ...generateHQStaffKPIData('1'),
  ...generateHQStaffKPIData('5'),
  ...generateFieldUnitKPIData('4'),
  ...generateDivisionHeadKPIData('2'),
  ...generateDivisionHeadKPIData('3')
];

export const allTimelineData = {
  '1': generate12MonthsTimeline('1', 'hq_staff'),
  '2': generate12MonthsTimeline('2', 'division_head'),
  '3': generate12MonthsTimeline('3', 'division_head'),
  '4': generate12MonthsTimeline('4', 'field_unit'),
  '5': generate12MonthsTimeline('5', 'hq_staff')
};

export const allSurveyData = generateSurveyData();
