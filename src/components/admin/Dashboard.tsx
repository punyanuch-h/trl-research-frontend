import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, Users, Zap, AlertCircle, Calendar } from "lucide-react";
import { useGetAllCases } from "@/hooks/case/get/useGetAllCases";
import { useGetAllResearcher } from "@/hooks/researcher/get/useGetAllResearcher";
import { useGetAllAppointments } from "@/hooks/case/get/useGetAllAppointments";
import { useGetAllIPs } from "@/hooks/case/get/useGetAllIPs";
import { useGetAllSupportments } from "@/hooks/case/get/useGetAllSupportments";

export default function Dashboard() {
  const { data: allCases = [] } = useGetAllCases();
  const { data: allResearchers = [] } = useGetAllResearcher();
  const { data: allAppointments = [] } = useGetAllAppointments();
  const { data: allIntellectualProperties = [] } = useGetAllIPs();
  const { data: allSupportments = [] } = useGetAllSupportments();

  const stats = useMemo(() => {
    const total = allCases.length;
    const pending = allCases.filter((c) => c.status === false).length;
    const urgent = allCases.filter((c) => c.is_urgent).length;

    const trlScores = allCases
      .map((c) => parseFloat(String(c.trl_score)))
      .filter((v) => !isNaN(v));
    const avgTRL =
      trlScores.length > 0
        ? (trlScores.reduce((a, b) => a + b, 0) / trlScores.length).toFixed(1)
        : "0";

    // Minimal color palette using primary color
    const PRIMARY_COLOR = "#63C8DA"; // Primary turquoise
    const PRIMARY_LIGHT = "#8DDDEA"; // Lighter shade
    const PRIMARY_DARK = "#3CAABD"; // Darker shade
    const COLORS = [PRIMARY_COLOR, PRIMARY_LIGHT, PRIMARY_DARK]; // Minimal 3-color palette
    const BASE_COLOR = PRIMARY_COLOR;

    // TRL Distribution
    const trlDistribution = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((level, index) => ({
      level: `TRL ${level}`,
      count: allCases.filter(
        (c) => Math.floor(parseFloat(String(c.trl_score))) === level
      ).length,
      fill: COLORS[index % COLORS.length],
    }));

    // Case types
    const typeCounts: Record<string, number> = {};
    allCases.forEach((c) => {
      const t = c.type || "Unspecified";
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    const caseTypeData = Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const statusData = [
      { name: "Pending", value: pending },
      { name: "Active", value: total - pending },
      { name: "Urgent", value: urgent },
    ];

    // Intellectual Property
    const ipCounts: Record<string, number> = {};
    allIntellectualProperties.forEach((ip) => {
      const t = ip.types || "Unspecified";
      ipCounts[t] = (ipCounts[t] || 0) + 1;
    });
    const ipData = Object.entries(ipCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Supportment Group 1: หน่วยงานสนับสนุนนวัตกรรมที่มีอยู่เดิม
    const agencyLabels: Record<string, string> = {
      support_research: "Research Dept",
      support_vdc: "VDC",
      support_sieic: "SiEIC",
    };

    // Supportment Group 2: ความช่วยเหลือที่ต้องการ
    const needLabels: Record<string, string> = {
      need_protect_intellectual_property: "IP Protection",
      need_co_developers: "Co-developers",
      need_activities: "Activities",
      need_test: "Testing",
      need_capital: "Capital",
      need_partners: "Partners",
      need_guidelines: "Guidelines",
      need_certification: "Certification",
      need_account: "Benefit Account",
    };

    const agencyData = Object.entries(agencyLabels)
      .map(([key, label]) => ({
        name: label,
        value: allSupportments.filter((s: any) => s[key] === true).length,
      }))
      .sort((a, b) => b.value - a.value);

    const neededSupportData = Object.entries(needLabels)
      .map(([key, label]) => ({
        name: label,
        value: allSupportments.filter((s: any) => s[key] === true).length,
      }))
      .sort((a, b) => b.value - a.value);

    // Researchers
    const topResearchers = Object.entries(
      allCases.reduce((acc: Record<string, number>, c) => {
        acc[c.researcher_id] = (acc[c.researcher_id] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => {
        const r = allResearchers.find((x) => x.id === id);
        return {
          id,
          name: r
            ? `${r.first_name || ""} ${r.last_name || ""}`
            : id,
          count: count as number,
        };
      });

    // Appointments summary
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const success = allAppointments.filter((a) => a.status === "completed")
      .length;
    const fail = allAppointments.filter(
      (a) => a.status === "cancelled" || a.status === "failed"
    ).length;
    const upcoming = allAppointments
      .filter((a) => {
        const d = new Date(a.date);
        return d >= today && d <= nextWeek;
      })
      .slice(0, 3)
      .map((a) => {
        const relatedCase = allCases.find((c) => c.id === a.case_id);
        return {
          ...a,
          case_title: relatedCase?.title || "Case",
        };
      });

    return {
      total,
      pending,
      urgent,
      avgTRL,
      trlDistribution,
      caseTypeData,
      statusData,
      ipData,
      agencyData,
      neededSupportData,
      COLORS,
      BASE_COLOR,
      topResearchers,
      success,
      fail,
      upcoming,
    };
  }, [allCases, allResearchers, allAppointments, allIntellectualProperties, allSupportments]);

  const KPICard = ({ icon: Icon, label, value }: any) => (
    <div className="p-4 bg-white rounded-lg border border-gray-100 flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 rounded-lg">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPICard icon={FileText} label="Total Cases" value={stats.total} />
        <KPICard icon={Zap} label="Pending" value={stats.pending} />
        <KPICard icon={AlertCircle} label="Urgent" value={stats.urgent} />
        <KPICard
          icon={Users}
          label="Researchers"
          value={allResearchers.length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* TRL Distribution */}
          <div className="bg-white p-5 border border-gray-100 rounded-lg">
            <h3 className="font-semibold mb-3 text-sm">TRL Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trlDistribution}>
                  <XAxis dataKey="level" fontSize={10} />
                  <YAxis allowDecimals={false} fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.trlDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || stats.BASE_COLOR} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Case Type Breakdown */}
          <div className="bg-white p-5 border border-gray-100 rounded-lg">
            <h3 className="font-semibold mb-3 text-sm">Case Type & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Pie */}
              <div className="flex justify-center">
                <ResponsiveContainer width="90%" height={180}>
                  <PieChart>
                    <Pie
                      data={stats.statusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={70}
                    >
                      {stats.statusData.map((entry, index) => (
                        <Cell
                          key={`status-${index}`}
                          fill={stats.COLORS[index % stats.COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Case Type List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.caseTypeData.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm border-b border-gray-100 pb-1"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            stats.COLORS[i % stats.COLORS.length],
                        }}
                      />
                      <span className="flex-1 truncate">{t.name}</span>
                      <span className="text-gray-500">{t.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white p-5 border border-gray-100 rounded-lg">
            <h3 className="font-semibold mb-3 text-sm">Intellectual Property Types</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.ipData} margin={{ bottom: 40 }}>
                  <XAxis
                    dataKey="name"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis allowDecimals={false} fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="value" fill={stats.BASE_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Supportment Needs */}
          <div className="bg-white p-5 border border-gray-100 rounded-lg space-y-8">
            <div>
              <h3 className="font-semibold mb-3 text-sm">หน่วยงานสนับสนุนนวัตกรรมที่มีอยู่เดิม</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.agencyData}
                    layout="vertical"
                    margin={{ left: 20, right: 30 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      fontSize={10}
                      width={100}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill={stats.BASE_COLOR}
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">ความช่วยเหลือที่ต้องการ</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.neededSupportData}
                    layout="vertical"
                    margin={{ left: 20, right: 30 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      fontSize={10}
                      width={100}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill={stats.BASE_COLOR}
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 border border-gray-100 rounded-lg">
            <h3 className="font-semibold mb-3 text-sm">Averages</h3>
            <div className="space-y-2 text-sm">
              <p>
                Avg TRL Score:{" "}
                <span className="font-semibold text-blue-600">
                  {stats.avgTRL}
                </span>
              </p>
              <p>
                Pending Ratio:{" "}
                {(stats.pending / stats.total * 100 || 0).toFixed(1)}%
              </p>
              <p>
                Urgent Ratio:{" "}
                {(stats.urgent / stats.total * 100 || 0).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Researchers */}
          <div className="bg-white p-5 border border-gray-100 rounded-lg">
            <h3 className="font-semibold mb-3 text-sm">Top Researchers</h3>
            {stats.topResearchers.length > 0 ? (
              <ul className="text-sm space-y-2">
                {stats.topResearchers.map((r) => (
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

          {/* Appointments */}
          <div className="bg-white p-5 border border-gray-100 rounded-lg">
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" /> Appointments
            </h3>
            <div className="text-sm mb-3">
              <p>
                ✅ Success:{" "}
                <span className="font-semibold text-green-600">
                  {stats.success}
                </span>
              </p>
              <p>
                ❌ Failed:{" "}
                <span className="font-semibold text-red-500">{stats.fail}</span>
              </p>
              <p>
                📅 Upcoming:{" "}
                <span className="font-semibold text-blue-600">
                  {stats.upcoming.length}
                </span>
              </p>
            </div>

            {stats.upcoming.length > 0 ? (
              <ul className="text-sm space-y-2">
                {stats.upcoming.map((a) => (
                  <li key={a.id}>
                    <p className="font-medium">{a.case_title}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(a.date).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
