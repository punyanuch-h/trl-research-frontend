import React from 'react';
import { Button } from '../../components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-color-text-primary">Dashboard</h1>
        <p className="text-color-text-secondary">Show performance and metrics of the research</p>
      </div>
      <Button 
        variant="outline"
        onClick={onRefresh} 
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Data
      </Button>
    </div>
  );
};

export default DashboardHeader; 