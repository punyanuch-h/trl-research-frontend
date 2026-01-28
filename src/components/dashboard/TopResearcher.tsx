interface Researcher {
  id: string;
  name: string;
  count: number;
}

interface TopResearchersCardProps {
  researchers: Researcher[];
}

export function TopResearchersCard({ researchers }: TopResearchersCardProps) {
  return (
    <div className="bg-white p-5 border border-gray-100 rounded-lg">
      <h3 className="font-semibold mb-3 text-sm">Top Researchers</h3>
      {researchers.length > 0 ? (
        <ul className="text-sm space-y-2">
          {researchers.map((r) => (
            <li key={r.id} className="flex justify-between">
              <span>{r.name}</span>
              <span className="text-gray-500">{r.count}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">No data</p>
      )}
    </div>
  );
}