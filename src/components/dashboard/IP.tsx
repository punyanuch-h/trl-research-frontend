import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface IPData {
  name: string;
  value: number;
}

interface IntellectualPropertyChartProps {
  data: IPData[];
  baseColor: string;
}

export function IntellectualPropertyChart({ data, baseColor }: IntellectualPropertyChartProps) {
  return (
    <div className="bg-white p-5 border border-gray-100 rounded-lg">
      <h3 className="font-semibold mb-3 text-sm">ประเภททรัพย์สินทางปัญญา</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ bottom: 40 }}>
            <XAxis
              dataKey="name"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis allowDecimals={false} fontSize={10} />
            <Tooltip formatter={(value: number) => [`${value}`, "จำนวน"]} />
            <Bar dataKey="value" fill={baseColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}