import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TRLData {
  level: string;
  count: number;
  fill?: string;
}

interface TRLDistributionChartProps {
  data: TRLData[];
  baseColor: string;
}

export function TRLDistributionChart({ data, baseColor }: TRLDistributionChartProps) {
  return (
    <div className="bg-white p-5 border border-gray-100 rounded-lg">
      <h3 className="font-semibold mb-3 text-sm">สัดส่วนระดับความพร้อมเทคโนโลยี (TRL)</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="level" fontSize={10} />
            <YAxis allowDecimals={false} fontSize={10} />
            <Tooltip formatter={(value: number) => [`${value}`, "จำนวน"]} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || baseColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}