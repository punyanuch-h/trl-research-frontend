import { DashboardData } from '../hooks/useDashboardData';

export const mockDashboardData: DashboardData = {
  researchStats: {
    totalResearch: 156,
    activeResearch: 89,
    completedResearch: 45,
    newResearchThisMonth: 12,
    averageTrl: 4.5,
  },
  
  researchByType: [
    { type: 'TRL medical devices', count: 45, percentage: 28.8 },
    { type: 'TRL software', count: 38, percentage: 24.4 },
    { type: 'TRL medicines vaccines stem cells', count: 52, percentage: 33.3 },
    { type: 'TRL plant/animal breeds', count: 21, percentage: 13.5 },
  ],
  
  researchByTRL: [
    { trl: 'TRL1', count: 8, percentage: 5.1 },
    { trl: 'TRL2', count: 12, percentage: 7.7 },
    { trl: 'TRL3', count: 18, percentage: 11.5 },
    { trl: 'TRL4', count: 25, percentage: 16.0 },
    { trl: 'TRL5', count: 32, percentage: 20.5 },
    { trl: 'TRL6', count: 28, percentage: 17.9 },
    { trl: 'TRL7', count: 20, percentage: 12.8 },
    { trl: 'TRL8', count: 8, percentage: 5.1 },
    { trl: 'TRL9', count: 5, percentage: 3.2 },
  ],
  
  researchByStatus: [
    { status: 'Todo', count: 67, percentage: 42.9 },
    { status: 'In process', count: 44, percentage: 28.2 },
    { status: 'Done', count: 45, percentage: 28.9 },
  ],
  
  monthlySubmissions: [
    { month: 'Jan', submissions: 8, completions: 3 },
    { month: 'Feb', submissions: 12, completions: 9 },
    { month: 'Mar', submissions: 15, completions: 10 },
    { month: 'Apr', submissions: 18, completions: 19 },
    { month: 'May', submissions: 22, completions: 12 },
    { month: 'Jun', submissions: 21, completions: 25 },
    { month: 'Jul', submissions: 12, completions: 18 },
    { month: 'Aug', submissions: 30, completions: 29 },
    { month: 'Sep', submissions: 32, completions: 35 },
    { month: 'Oct', submissions: 25, completions: 30 },
    { month: 'Nov', submissions: 38, completions: 33 },
    { month: 'Dec', submissions: 42, completions: 48 },
  ],
  
  institutionStats: [
    { institution: 'Chulalongkorn University', researchCount: 35, percentage: 22.4 },
    { institution: 'Mahidol University', researchCount: 28, percentage: 17.9 },
    { institution: 'Kasetsart University', researchCount: 22, percentage: 14.1 },
    { institution: 'Thammasat University', researchCount: 18, percentage: 11.5 },
    { institution: 'King Mongkut\'s University', researchCount: 15, percentage: 9.6 },
    { institution: 'Prince of Songkla University', researchCount: 12, percentage: 7.7 },
    { institution: 'Chiang Mai University', researchCount: 10, percentage: 6.4 },
    { institution: 'Other Institutions', researchCount: 16, percentage: 10.3 },
  ],
  
  researchProgress: [
    { date: '2024-01-01', Todo: 3, InProgress: 45, Done: 12 },
    { date: '2024-01-02', Todo: 2, InProgress: 47, Done: 13 },
    { date: '2024-01-03', Todo: 4, InProgress: 49, Done: 14 },
    { date: '2024-01-04', Todo: 1, InProgress: 50, Done: 15 },
    { date: '2024-01-05', Todo: 3, InProgress: 52, Done: 16 },
    { date: '2024-01-06', Todo: 2, InProgress: 54, Done: 17 },
    { date: '2024-01-07', Todo: 5, InProgress: 56, Done: 18 },
    { date: '2024-01-08', Todo: 1, InProgress: 57, Done: 19 },
    { date: '2024-01-09', Todo: 3, InProgress: 59, Done: 20 },
    { date: '2024-01-10', Todo: 2, InProgress: 61, Done: 21 },
    { date: '2024-01-11', Todo: 4, InProgress: 63, Done: 22 },
    { date: '2024-01-12', Todo: 1, InProgress: 64, Done: 23 },
    { date: '2024-01-13', Todo: 3, InProgress: 66, Done: 24 },
    { date: '2024-01-14', Todo: 2, InProgress: 68, Done: 25 },
  ],
  
  innovationMetrics: {
    totalPatents: 23,
    totalPublications: 67,
    aiGeneratedFiles: 89,
    resultFiles: 45,
  },
  
  recentActivity: [
    {
      id: '1',
      type: 'research',
      message: 'New research submission: Medical Device Innovation by Dr. Smith',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'success',
    },
    {
      id: '2',
      type: 'completion',
      message: 'Research completed: Software TRL Assessment - Project Alpha',
      timestamp: '2024-01-15T10:25:00Z',
      status: 'success',
    },
    {
      id: '3',
      type: 'system',
      message: 'AI analysis completed for research ID: RES-2024-001',
      timestamp: '2024-01-15T10:20:00Z',
      status: 'success',
    },
    {
      id: '4',
      type: 'research',
      message: 'Research status updated to "In process": Vaccine Development Project',
      timestamp: '2024-01-15T10:15:00Z',
      status: 'warning',
    },
    {
      id: '5',
      type: 'system',
      message: 'Database backup completed successfully',
      timestamp: '2024-01-15T10:10:00Z',
      status: 'success',
    },
    {
      id: '6',
      type: 'research',
      message: 'New researcher registered: Dr. Johnson from Mahidol University',
      timestamp: '2024-01-15T10:05:00Z',
      status: 'success',
    },
    {
      id: '7',
      type: 'completion',
      message: 'Patent application submitted for research ID: RES-2024-045',
      timestamp: '2024-01-15T10:00:00Z',
      status: 'success',
    },
    {
      id: '8',
      type: 'system',
      message: 'High storage usage detected (85%) - cleanup recommended',
      timestamp: '2024-01-15T09:55:00Z',
      status: 'error',
    },
  ],
  
  systemMetrics: {
    databaseConnections: 45,
    storageUsage: 78,
    activeUsers: 23,
    responseTime: 125,
  },
};

// Alternative data set for testing different scenarios
export const mockDashboardDataAlternative: DashboardData = {
  researchStats: {
    totalResearch: 234,
    activeResearch: 156,
    completedResearch: 78,
    newResearchThisMonth: 18,
    averageTrl: 4.5,
  },
  
  researchByType: [
    { type: 'TRL medical devices', count: 65, percentage: 27.8 },
    { type: 'TRL software', count: 58, percentage: 24.8 },
    { type: 'TRL medicines vaccines stem cells', count: 78, percentage: 33.3 },
    { type: 'TRL plant/animal breeds', count: 33, percentage: 14.1 },
  ],
  
  researchByTRL: [
    { trl: 'TRL1', count: 12, percentage: 5.1 },
    { trl: 'TRL2', count: 18, percentage: 7.7 },
    { trl: 'TRL3', count: 25, percentage: 10.7 },
    { trl: 'TRL4', count: 35, percentage: 15.0 },
    { trl: 'TRL5', count: 45, percentage: 19.2 },
    { trl: 'TRL6', count: 38, percentage: 16.2 },
    { trl: 'TRL7', count: 28, percentage: 12.0 },
    { trl: 'TRL8', count: 15, percentage: 6.4 },
    { trl: 'TRL9', count: 8, percentage: 3.4 },
  ],
  
  researchByStatus: [
    { status: 'Todo', count: 89, percentage: 38.0 },
    { status: 'In process', count: 67, percentage: 28.6 },
    { status: 'Done', count: 78, percentage: 33.3 },
  ],
  
  monthlySubmissions: [
    { month: 'Jan', submissions: 12, completions: 5 },
    { month: 'Feb', submissions: 18, completions: 8 },
    { month: 'Mar', submissions: 22, completions: 12 },
    { month: 'Apr', submissions: 25, completions: 15 },
    { month: 'May', submissions: 28, completions: 18 },
    { month: 'Jun', submissions: 32, completions: 22 },
    { month: 'Jul', submissions: 35, completions: 25 },
    { month: 'Aug', submissions: 38, completions: 28 },
    { month: 'Sep', submissions: 42, completions: 32 },
    { month: 'Oct', submissions: 45, completions: 35 },
    { month: 'Nov', submissions: 48, completions: 38 },
    { month: 'Dec', submissions: 52, completions: 42 },
  ],
  
  institutionStats: [
    { institution: 'Chulalongkorn', researchCount: 52, percentage: 22.2 },
    { institution: 'Mahidol', researchCount: 45, percentage: 19.2 },
    { institution: 'Kasetsart', researchCount: 38, percentage: 16.2 },
    { institution: 'Thammasat', researchCount: 32, percentage: 13.7 },
    { institution: 'King Mongkut\'s', researchCount: 28, percentage: 12.0 },
    { institution: 'Prince of Songkla', researchCount: 22, percentage: 9.4 },
    { institution: 'Chiang Mai', researchCount: 18, percentage: 7.7 },
    { institution: 'Other Institutions', researchCount: 19, percentage: 8.1 },
  ],
  
  researchProgress: [
    { date: '2024-01-01', Todo: 5, InProgress: 67, Done: 18 },
    { date: '2024-01-02', Todo: 3, InProgress: 70, Done: 20 },
    { date: '2024-01-03', Todo: 6, InProgress: 73, Done: 22 },
    { date: '2024-01-04', Todo: 2, InProgress: 75, Done: 24 },
    { date: '2024-01-05', Todo: 4, InProgress: 78, Done: 26 },
    { date: '2024-01-06', Todo: 3, InProgress: 81, Done: 28 },
    { date: '2024-01-07', Todo: 7, InProgress: 84, Done: 30 },
  ],
  
  innovationMetrics: {
    totalPatents: 35,
    totalPublications: 89,
    aiGeneratedFiles: 125,
    resultFiles: 67,
  },
  
  recentActivity: [
    {
      id: '1',
      type: 'research',
      message: 'New high-impact research submission: Advanced Medical Device by Dr. Brown',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'success',
    },
    {
      id: '2',
      type: 'completion',
      message: 'Major research milestone completed: Vaccine Development Phase II',
      timestamp: '2024-01-15T10:25:00Z',
      status: 'success',
    },
    {
      id: '3',
      type: 'system',
      message: 'AI analysis completed for research ID: RES-2024-078',
      timestamp: '2024-01-15T10:20:00Z',
      status: 'success',
    },
  ],
  
  systemMetrics: {
    databaseConnections: 67,
    storageUsage: 65,
    activeUsers: 34,
    responseTime: 98,
  },
}; 