import { useState, useEffect } from 'react';
import { researcherInfo, researchInfo, researchDetails } from '../../../data/mockDashboardData';

export interface DashboardData {
  // Research Statistics
  researchStats: {
    totalResearch: number;
    activeResearch: number;
    completedResearch: number;
    newResearchThisMonth: number;
    averageTrl: number;
  };
  
  // Research by Type
  researchByType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  
  // Research by TRL Level
  researchByTRL: Array<{
    trl: string;
    count: number;
    percentage: number;
  }>;
  
  // Research by Status
  researchByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  
  // Monthly Research Submissions
  monthlySubmissions: Array<{
    month: string;
    submissions: number;
    completions: number;
  }>;
  
  // Institution Distribution
  institutionStats: Array<{
    institution: string;
    researchCount: number;
    percentage: number;
  }>;
  
  // Research Progress Timeline
  researchProgress: Array<{
    date: string;
    Todo: number;
    InProgress: number;
    Done: number;
  }>;
  
  // Innovation Metrics
  innovationMetrics: {
    totalPatents: number;
    totalPublications: number;
    aiGeneratedFiles: number;
    resultFiles: number;
  };
  
  // Recent Activity
  recentActivity: Array<{
    id: string;
    type: 'research' | 'completion' | 'system';
    message: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
  
  // System Performance
  systemMetrics: {
    databaseConnections: number;
    storageUsage: number;
    activeUsers: number;
    responseTime: number;
  };
}

const processMockData = (): DashboardData => {
  const totalResearch = researchInfo.length;
  const activeResearch = researchInfo.filter(r => r.status === 'In process').length;
  const completedResearch = researchInfo.filter(r => r.status === 'Done').length;
  
  // Calculate average TRL (extract number from TRL string)
  const trlScores = researchInfo.map(r => parseInt(r.trl_score.replace('TRL', '')));
  const averageTrl = trlScores.reduce((sum, score) => sum + score, 0) / trlScores.length;

  // Research by Type
  const typeCounts = researchInfo.reduce((acc, research) => {
    const type = research.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const researchByType = Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count,
    percentage: (count / totalResearch) * 100
  }));

  // Research by TRL Level
  const trlCounts = researchInfo.reduce((acc, research) => {
    const trl = research.trl_score;
    acc[trl] = (acc[trl] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const researchByTRL = Object.entries(trlCounts).map(([trl, count]) => ({
    trl,
    count,
    percentage: (count / totalResearch) * 100
  }));

  // Research by Status
  const statusCounts = researchInfo.reduce((acc, research) => {
    const status = research.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const researchByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: (count / totalResearch) * 100
  }));

  // Institution Distribution
  const institutionCounts = researcherInfo.reduce((acc, researcher) => {
    const institution = researcher.institution;
    acc[institution] = (acc[institution] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const institutionStats = Object.entries(institutionCounts).map(([institution, researchCount]) => ({
    institution,
    researchCount,
    percentage: (researchCount / totalResearch) * 100
  }));

  // Mock monthly submissions data
  const monthlySubmissions = [
    { month: 'Jan', submissions: 12, completions: 8 },
    { month: 'Feb', submissions: 15, completions: 10 },
    { month: 'Mar', submissions: 18, completions: 12 },
    { month: 'Apr', submissions: 14, completions: 9 },
    { month: 'May', submissions: 20, completions: 15 },
    { month: 'Jun', submissions: 16, completions: 11 },
  ];

  // Mock research progress timeline
  const researchProgress = [
    { date: '2024-01', Todo: 5, InProgress: 8, Done: 3 },
    { date: '2024-02', Todo: 3, InProgress: 10, Done: 5 },
    { date: '2024-03', Todo: 2, InProgress: 12, Done: 7 },
    { date: '2024-04', Todo: 4, InProgress: 9, Done: 8 },
    { date: '2024-05', Todo: 1, InProgress: 11, Done: 10 },
    { date: '2024-06', Todo: 3, InProgress: 8, Done: 12 },
  ];

  // Mock innovation metrics
  const innovationMetrics = {
    totalPatents: 45,
    totalPublications: 128,
    aiGeneratedFiles: 89,
    resultFiles: 156,
  };

  // Mock recent activity
  const recentActivity = [
    {
      id: '1',
      type: 'research' as const,
      message: 'New research project "Novel Drug Delivery System" submitted',
      timestamp: '2024-06-15T10:30:00Z',
      status: 'success' as const,
    },
    {
      id: '2',
      type: 'completion' as const,
      message: 'Research "Drought-Resistant Crop Strain" completed',
      timestamp: '2024-06-14T15:45:00Z',
      status: 'success' as const,
    },
    {
      id: '3',
      type: 'system' as const,
      message: 'System maintenance completed',
      timestamp: '2024-06-14T02:00:00Z',
      status: 'warning' as const,
    },
    {
      id: '4',
      type: 'research' as const,
      message: 'Research "AI-Powered Diagnostic Tool" updated',
      timestamp: '2024-06-13T09:15:00Z',
      status: 'success' as const,
    },
  ];

  // Mock system metrics
  const systemMetrics = {
    databaseConnections: 156,
    storageUsage: 78,
    activeUsers: 89,
    responseTime: 245,
  };

  return {
    researchStats: {
      totalResearch,
      activeResearch,
      completedResearch,
      newResearchThisMonth: 5, // Mock value
      averageTrl: Math.round(averageTrl * 10) / 10, // Round to 1 decimal place
    },
    researchByType,
    researchByTRL,
    researchByStatus,
    monthlySubmissions,
    institutionStats,
    researchProgress,
    innovationMetrics,
    recentActivity,
    systemMetrics,
  };
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Process the mock data to generate dashboard data
        const processedData = processMockData();
        
        setData(processedData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const processedData = processMockData();
      setData(processedData);
      setError(null);
    } catch (err) {
      setError('Failed to refresh dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refreshData,
  };
}; 