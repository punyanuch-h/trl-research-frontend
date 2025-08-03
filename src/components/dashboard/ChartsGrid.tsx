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
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ChartData } from './types';

const COLORS = ['#40E0D0', '#7FB3D3', '#8BC34A', '#FFD54F', '#F48FB1', '#B39DDB'];

interface ChartsGridProps {
  chartData: ChartData;
}

const ChartsGrid: React.FC<ChartsGridProps> = ({ chartData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Research by TRL Level */}
      <Card>
        <CardHeader>
          <CardTitle>Research by TRL Level</CardTitle>
          <CardDescription>Distribution of research by Technology Readiness Level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.researchByTRL}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trl" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Research Count']} />
              <Legend />
              <Bar dataKey="count" fill="#7FB3D3" />
            </BarChart>
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
                data={chartData.researchByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percentage }) => `${type} (${percentage}%)`}
                outerRadius={80}
                fill="#40E0D0"
                dataKey="count"
              >
                {chartData.researchByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, 'Research Count']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Submissions</CardTitle>
          <CardDescription>Research submissions and completions over the past year</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlySubmissions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Count']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="submissions" 
                stroke="#40E0D0" 
                strokeWidth={2}
                dot={{ fill: '#40E0D0', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="completions" 
                stroke="#7FB3D3" 
                strokeWidth={2}
                dot={{ fill: '#7FB3D3', strokeWidth: 2, r: 4 }}
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
            <AreaChart data={chartData.researchProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Todo" 
                stackId="1" 
                stroke="#40E0D0" 
                fill="#40E0D0" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="InProgress" 
                stackId="1" 
                stroke="#7FB3D3" 
                fill="#7FB3D3" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="Done" 
                stackId="1" 
                stroke="#8BC34A" 
                fill="#8BC34A" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsGrid; 