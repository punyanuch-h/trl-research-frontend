interface AveragesCardProps {
  avgTRL: string;
  pendingRatio: number;
  urgentRatio: number;
}

export function AveragesCard({ avgTRL, pendingRatio, urgentRatio }: AveragesCardProps) {
  return (
    <div className="bg-white p-5 border border-gray-100 rounded-lg">
      <h3 className="font-semibold mb-3 text-sm">Averages</h3>
      <div className="space-y-2 text-sm">
        <p>
          Avg TRL Score:{" "}
          <span className="font-semibold text-blue-600">{avgTRL}</span>
        </p>
        <p>Pending Ratio: {pendingRatio.toFixed(1)}%</p>
        <p>Urgent Ratio: {urgentRatio.toFixed(1)}%</p>
      </div>
    </div>
  );
}