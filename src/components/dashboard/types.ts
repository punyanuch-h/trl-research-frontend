export interface ResearchStats {
  totalResearch: number;
  activeResearch: number;
  completedResearch: number;
  averageTrl: number;
  newResearchThisMonth: number;
}

export interface Activity {
  id: string;
  message: string;
  status: 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface ChartData {
  researchByTRL: Array<{ trl: string; count: number }>;
  researchByType: Array<{ type: string; count: number; percentage: number }>;
  monthlySubmissions: Array<{ month: string; submissions: number; completions: number }>;
  researchProgress: Array<{ date: string; Todo: number; InProgress: number; Done: number }>;
}

export interface DashboardData {
  researchStats: ResearchStats;
  researchByTRL: Array<{ trl: string; count: number }>;
  researchByType: Array<{ type: string; count: number; percentage: number }>;
  monthlySubmissions: Array<{ month: string; submissions: number; completions: number }>;
  researchProgress: Array<{ date: string; Todo: number; InProgress: number; Done: number }>;
  recentActivity: Activity[];
} 