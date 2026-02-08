import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface CaseTypeStatusChartProps {
  statusData: ChartData[];
  caseTypeData: ChartData[];
  colors: string[];
}

export function CaseTypeStatusChart({ statusData, caseTypeData, colors }: CaseTypeStatusChartProps) {
  return (
    <div className="bg-white p-5 border border-gray-100 rounded-lg">
      <h3 className="font-semibold mb-3 text-sm">ประเภทและสถานะงานวิจัย</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Pie */}
        <div className="flex justify-center">
          <ResponsiveContainer width="90%" height={180}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={70}>
                {statusData.map((entry, index) => (
                  <Cell key={`status-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Case Type List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {caseTypeData.map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm border-b border-gray-100 pb-1"
            >
              <div className="flex items-center gap-2 w-full">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span className="flex-1 truncate">{t.name}</span>
                <span className="text-gray-500">{t.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}