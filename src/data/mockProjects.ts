import { Project } from '@/types/user';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Erosion Control Initiative',
    status: 'On Track',
    progress: 60,
    assignedTeam: ['4', '6'],
    deadline: '2025-06-30',
    site: 'North Bank Region'
  },
  {
    id: 'p2',
    name: 'Flood Management System',
    status: 'On Track',
    progress: 75,
    assignedTeam: ['1', '7'],
    deadline: '2025-05-15',
    site: 'Downstream Area'
  },
  {
    id: 'p3',
    name: 'Dam Safety Modernization',
    status: 'At Risk',
    progress: 40,
    assignedTeam: ['4', '5', '6'],
    deadline: '2025-08-30',
    site: 'Main Dam Structure'
  },
  {
    id: 'p4',
    name: 'Water Quality Monitoring',
    status: 'Completed',
    progress: 100,
    assignedTeam: ['5', '7'],
    deadline: '2025-01-31',
    site: 'Multiple Sites'
  },
  {
    id: 'p5',
    name: 'Irrigation Canal Upgrade',
    status: 'On Track',
    progress: 55,
    assignedTeam: ['6', '7'],
    deadline: '2025-07-15',
    site: 'Agricultural Zone'
  },
  {
    id: 'p6',
    name: 'Digital Infrastructure Setup',
    status: 'Delayed',
    progress: 30,
    assignedTeam: ['1', '5'],
    deadline: '2025-04-30',
    site: 'HQ Office'
  },
  {
    id: 'p7',
    name: 'Community Awareness Program',
    status: 'On Track',
    progress: 65,
    assignedTeam: ['7'],
    deadline: '2025-05-31',
    site: 'Riverine Communities'
  },
  {
    id: 'p8',
    name: 'Environmental Impact Study',
    status: 'On Track',
    progress: 80,
    assignedTeam: ['4', '6'],
    deadline: '2025-03-31',
    site: 'Project Sites'
  }
];
