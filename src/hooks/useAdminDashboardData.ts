import { Users, FileText, TrendingUp, Award } from "lucide-react";

// Mock data hook for admin dashboard
export const useAdminDashboardData = () => {
  // Overview statistics
  const overviewStats = [
    {
      title: "Total Projects",
      value: "284",
      change: "+12.5%",
      icon: FileText,
    },
    {
      title: "Active Professors", 
      value: "47",
      change: "+3.2%",
      icon: Users,
    },
    {
      title: "Completed Projects",
      value: "156",
      change: "+8.1%",
      icon: Award,
    },
    {
      title: "Avg TRL Score",
      value: "4.2",
      change: "+0.3",
      icon: TrendingUp,
    },
  ];

  // TRL level distribution
  const trlDistribution = [
    { level: "TRL1", count: 12 },
    { level: "TRL2", count: 18 },
    { level: "TRL3", count: 24 },
    { level: "TRL4", count: 31 },
    { level: "TRL5", count: 28 },
    { level: "TRL6", count: 22 },
    { level: "TRL7", count: 19 },
    { level: "TRL8", count: 14 },
    { level: "TRL9", count: 8 },
  ];

  // Project status distribution
  const statusDistribution = [
    { name: "In Progress", value: 45, color: "hsl(var(--chart-2))" },
    { name: "Completed", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Todo", value: 15, color: "hsl(var(--chart-3))" },
    { name: "Approved", value: 5, color: "hsl(var(--chart-4))" },
  ];

  // Monthly trends
  const monthlyTrends = [
    { month: "Jan", newProjects: 12, completed: 8 },
    { month: "Feb", newProjects: 15, completed: 12 },
    { month: "Mar", newProjects: 18, completed: 14 },
    { month: "Apr", newProjects: 22, completed: 16 },
    { month: "May", newProjects: 19, completed: 18 },
    { month: "Jun", newProjects: 25, completed: 20 },
  ];

  // Projects by research type
  const projectsByType = [
    { type: "Medical Devices", count: 42 },
    { type: "Software", count: 38 },
    { type: "Medicines/Vaccines", count: 35 },
    { type: "Plant/Animal Breeds", count: 28 },
    { type: "Manufacturing", count: 22 },
    { type: "Energy", count: 18 },
  ];

  // Top professors activity
  const professorsActivity = [
    {
      name: "Dr. Sarah Johnson",
      department: "Biomedical Engineering",
      totalProjects: 15,
      completed: 8,
      avgTrl: "5.2",
    },
    {
      name: "Prof. Michael Chen",
      department: "Computer Science",
      totalProjects: 12,
      completed: 7,
      avgTrl: "4.8",
    },
    {
      name: "Dr. Emily Rodriguez",
      department: "Pharmaceutical Sciences",
      totalProjects: 11,
      completed: 9,
      avgTrl: "6.1",
    },
    {
      name: "Prof. David Kumar",
      department: "Agricultural Sciences",
      totalProjects: 9,
      completed: 5,
      avgTrl: "4.2",
    },
    {
      name: "Dr. Lisa Thompson",
      department: "Materials Engineering",
      totalProjects: 8,
      completed: 6,
      avgTrl: "5.5",
    },
  ];

  return {
    overviewStats,
    trlDistribution,
    statusDistribution,
    monthlyTrends,
    projectsByType,
    professorsActivity,
  };
};