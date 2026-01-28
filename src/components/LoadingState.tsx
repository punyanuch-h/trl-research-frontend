import React from 'react';
import { Button } from '../../components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ loading, error, onRetry }) => {
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
          <Button onClick={onRetry}>Retry</Button>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingState; 