import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { useDashboardData } from '../hooks/useDashboardData';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Clock,
  Server,
  Database,
  Network,
  HardDrive
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard: React.FC = () => {
  const { data, loading, error, refreshData } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refreshData}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor your application's performance and metrics</p>
          </div>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Research</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.researchStats.totalResearch.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {data.researchStats.newResearchThisMonth} new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Research</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.researchStats.activeResearch.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((data.researchStats.activeResearch / data.researchStats.totalResearch) * 100).toFixed(1)}% of total research
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Research</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.researchStats.completedResearch}</div>
              <p className="text-xs text-muted-foreground">
                {((data.researchStats.completedResearch / data.researchStats.totalResearch) * 100).toFixed(1)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Innovation Output</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.innovationMetrics.totalPatents + data.innovationMetrics.totalPublications}
              </div>
              <p className="text-xs text-muted-foreground">
                Patents & Publications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Submissions</CardTitle>
              <CardDescription>Research submissions and completions over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlySubmissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Count']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completions" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Research Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Research Progress</CardTitle>
              <CardDescription>Daily research progress tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.researchProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="newResearch" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="inProgress" 
                    stackId="1" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="1" 
                    stroke="#ffc658" 
                    fill="#ffc658" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Research by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Research by Type</CardTitle>
              <CardDescription>Distribution of research by TRL type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.researchByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.researchByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, 'Research Count']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Research by TRL Level */}
          <Card>
            <CardHeader>
              <CardTitle>Research by TRL Level</CardTitle>
              <CardDescription>Distribution of research by Technology Readiness Level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.researchByTRL}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="trl" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Research Count']} />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Institution Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Institution Distribution</CardTitle>
              <CardDescription>Research count by institution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.institutionStats} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="institution" type="category" width={120} />
                  <Tooltip formatter={(value) => [value, 'Research Count']} />
                  <Legend />
                  <Bar dataKey="researchCount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* System Performance */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Current system resource usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Server className="h-4 w-4" />
                    <span className="text-sm">Database Connections</span>
                  </div>
                  <span className="text-sm font-medium">{data.systemMetrics.databaseConnections}</span>
                </div>
                <Progress value={(data.systemMetrics.databaseConnections / 100) * 100} className="w-full" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span className="text-sm">Storage Usage</span>
                  </div>
                  <span className="text-sm font-medium">{data.systemMetrics.storageUsage}%</span>
                </div>
                <Progress value={data.systemMetrics.storageUsage} className="w-full" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4" />
                    <span className="text-sm">Active Users</span>
                  </div>
                  <span className="text-sm font-medium">{data.systemMetrics.activeUsers}</span>
                </div>
                <Progress value={(data.systemMetrics.activeUsers / 50) * 100} className="w-full" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Network className="h-4 w-4" />
                    <span className="text-sm">Response Time</span>
                  </div>
                  <span className="text-sm font-medium">{data.systemMetrics.responseTime}ms</span>
                </div>
                <Progress value={Math.max(0, 100 - (data.systemMetrics.responseTime / 2))} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system and user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <Badge variant="outline" className="text-xs">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
