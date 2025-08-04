# Dashboard Data Documentation

This directory contains mock data for the Admin Dashboard. The dashboard uses this data to display various charts and metrics.

## Files

- `mock-dashboard-data.ts` - Contains mock data for the dashboard
- `README.md` - This documentation file

## Data Structure

The dashboard expects data in the following format:

```typescript
interface DashboardData {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    growthRate: number;
  };
  revenueData: {
    monthly: Array<{ month: string; revenue: number }>;
    yearly: Array<{ year: string; revenue: number }>;
  };
  userActivity: Array<{ date: string; activeUsers: number; sessions: number }>;
  demographics: Array<{ age: string; count: number; percentage: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  conversionRates: Array<{ source: string; rate: number; visitors: number }>;
  systemMetrics: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'user' | 'order' | 'system';
    message: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
}
```

## Customizing Data

### 1. Modify Existing Data

To change the dashboard data, edit the `mockDashboardData` object in `mock-dashboard-data.ts`:

```typescript
export const mockDashboardData: DashboardData = {
  userStats: {
    totalUsers: 20000, // Change this value
    activeUsers: 12000, // Change this value
    // ... other properties
  },
  // ... other data sections
};
```

### 2. Add Alternative Data Sets

You can create multiple data sets for different scenarios:

```typescript
export const mockDashboardDataAlternative: DashboardData = {
  // Different data for testing different scenarios
};

export const mockDashboardDataHighGrowth: DashboardData = {
  // Data showing high growth scenario
};
```

### 3. Connect to Real API

To connect to a real database, modify the `useDashboardData` hook in `src/hooks/use-dashboard-data.ts`:

```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard-data');
    const data = await response.json();
    setData(data);
    setError(null);
  } catch (err) {
    setError('Failed to fetch dashboard data');
  } finally {
    setLoading(false);
  }
};
```

## Charts Available

The dashboard includes the following charts:

1. **Revenue Trend** - Line chart showing monthly revenue
2. **User Activity** - Area chart showing daily active users and sessions
3. **User Demographics** - Pie chart showing age distribution
4. **Top Products** - Bar chart showing best-selling products
5. **Conversion Rates** - Horizontal bar chart showing traffic source performance
6. **System Performance** - Progress bars showing system resource usage

## Adding New Charts

To add a new chart, you need to:

1. Add the data to the `DashboardData` interface
2. Add the data to the mock data object
3. Create a new chart component in the dashboard
4. Add the chart to the dashboard layout

Example:

```typescript
// 1. Add to interface
interface DashboardData {
  // ... existing properties
  newChartData: Array<{ label: string; value: number }>;
}

// 2. Add to mock data
export const mockDashboardData: DashboardData = {
  // ... existing data
  newChartData: [
    { label: 'Category A', value: 100 },
    { label: 'Category B', value: 200 },
  ],
};

// 3. Create chart component
<Card>
  <CardHeader>
    <CardTitle>New Chart</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data.newChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

## Data Validation

The dashboard includes basic error handling for:
- Loading states
- Network errors
- Missing data
- Invalid data formats

## Performance Considerations

- The dashboard uses `ResponsiveContainer` for responsive charts
- Data is loaded once and cached in the hook
- Charts are optimized for performance with proper memoization
- Large datasets should be paginated or filtered

## Testing Different Scenarios

You can test different scenarios by switching between data sets:

```typescript
// In use-dashboard-data.ts
import { mockDashboardData, mockDashboardDataAlternative } from '../data/mock-dashboard-data';

// Switch between different data sets
const dataToUse = process.env.NODE_ENV === 'development' 
  ? mockDashboardDataAlternative 
  : mockDashboardData;
``` 