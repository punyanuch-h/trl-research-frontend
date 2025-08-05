import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, TrendingUp, Activity, Star } from 'lucide-react';
import { ResearchStats } from './types';

interface MetricsCardsProps {
  researchStats: ResearchStats;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ researchStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Research</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{researchStats.totalResearch.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {researchStats.newResearchThisMonth} new this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Research</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{researchStats.activeResearch.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {((researchStats.activeResearch / researchStats.totalResearch) * 100).toFixed(1)}% of total research
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Research</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{researchStats.completedResearch}</div>
          <p className="text-xs text-muted-foreground">
            {((researchStats.completedResearch / researchStats.totalResearch) * 100).toFixed(1)}% completion rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average TRL</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{researchStats.averageTrl.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            Average Technology Readiness Level
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards; 