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
    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
      <h3 className="font-bold mb-4 text-gray-800 text-base">ประเภทและสถานะงานวิจัย</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Type Distribution Pie (Donut) */}
        <div className="h-[220px] flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">สัดส่วนประเภทงานวิจัย</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={caseTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={2}
                animationBegin={0}
                animationDuration={1500}
              >
                {caseTypeData.map((_, index) => (
                  <Cell
                    key={`type-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Info Lists */}
        <div className="space-y-6">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">รายการประเภทงานวิจัย</p>
          <div className="pr-2">
            {caseTypeData.map((t, i) => (
              <div key={`type-list-${i}`} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2 truncate">
                  <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="text-gray-600 truncate">{t.name}</span>
                </div>
                <span className="text-gray-400 tabular-nums">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
