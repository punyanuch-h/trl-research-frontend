import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Activity } from './types';

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-gray-100 text-gray-800';
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system and user activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
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
  );
};

export default RecentActivity; 