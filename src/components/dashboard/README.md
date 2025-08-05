# Dashboard Components

This directory contains the modular components that make up the Admin Dashboard.

## Components

### DashboardHeader
- Displays the dashboard title and refresh button
- Handles the refresh functionality

### MetricsCards
- Displays key metrics in card format
- Shows total research, active research, completed research, and average TRL
- Calculates percentages and displays statistics

### ChartsGrid
- Contains all the chart components
- Research by TRL Level (Bar Chart)
- Research by Type (Pie Chart)
- Monthly Submissions (Line Chart)
- Research Progress (Area Chart)

### RecentActivity
- Displays recent system activities
- Shows activity status with appropriate icons and colors
- Formats timestamps for display

### LoadingState
- Handles loading and error states
- Provides retry functionality for failed requests

## Types

All TypeScript interfaces are centralized in `types.ts`:

- `ResearchStats` - Statistics for research metrics
- `Activity` - Individual activity items
- `ChartData` - Data structure for charts
- `DashboardData` - Complete dashboard data structure

## Usage

```tsx
import { 
  DashboardHeader, 
  MetricsCards, 
  ChartsGrid, 
  RecentActivity, 
  LoadingState 
} from '../components/dashboard';

// Use components in your dashboard
<DashboardHeader onRefresh={refreshData} />
<MetricsCards researchStats={data.researchStats} />
<ChartsGrid chartData={data} />
<RecentActivity activities={data.recentActivity} />
```

## Dependencies

- Recharts for chart components
- Lucide React for icons
- Shadcn/ui components for UI elements 