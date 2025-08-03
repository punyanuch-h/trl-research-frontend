import { useState, useEffect } from 'react';
import { mockDashboardData } from '../data/mockDashboardData';

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
        
        // In a real application, this would be an API call
        // const response = await fetch('/api/dashboard-data');
        // const data = await response.json();
        
        setData(mockDashboardData);
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
      setData(mockDashboardData);
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