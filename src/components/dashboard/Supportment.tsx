import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface SupportData {
  name: string;
  value: number;
}

interface SupportmentChartsProps {
  agencyData: SupportData[];
  neededSupportData: SupportData[];
  baseColor: string;
}

export function SupportmentCharts({ agencyData, neededSupportData, baseColor }: SupportmentChartsProps) {
  return (
    <div className="bg-white p-5 border border-gray-100 rounded-lg space-y-8">
      {/* Existing Support Agencies */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">หน่วยงานสนับสนุนนวัตกรรมที่มีอยู่เดิม</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agencyData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" fontSize={10} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill={baseColor} radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Needed Support */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">ความช่วยเหลือที่ต้องการ</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={neededSupportData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" fontSize={10} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill={baseColor} radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}