import { FileText, Users, Zap, AlertCircle } from "lucide-react";
import { useGetAllCases } from "@/hooks/case/get/useGetAllCases";
import { useGetAllResearcher } from "@/hooks/researcher/get/useGetAllResearcher";
import { useGetAllAppointments } from "@/hooks/case/get/useGetAllAppointments";
import { useGetAllIPs } from "@/hooks/case/get/useGetAllIPs";
import { useGetAllSupportments } from "@/hooks/case/get/useGetAllSupportments";
import { useDashboardStats } from "@/hooks/useDashboardStatus";
import { KPICard } from "@/components/dashboard/KPI";
import { TRLDistributionChart } from "@/components/dashboard/TrlDist";
import { CaseTypeStatusChart } from "@/components/dashboard/CaseType";
import { IntellectualPropertyChart } from "@/components/dashboard/IP";
import { SupportmentCharts } from "@/components/dashboard/Supportment";
import { AveragesCard } from "@/components/dashboard/AveragesTrl";
import { TopResearchersCard } from "@/components/dashboard/TopResearcher";
import { AppointmentsCard } from "@/components/dashboard/Appointments";

// Dashboard colors
const PRIMARY_COLOR = "#63C8DA";
const PRIMARY_LIGHT = "#8DDDEA";
const PRIMARY_DARK = "#3CAABD";
const COLORS = [PRIMARY_COLOR, PRIMARY_LIGHT, PRIMARY_DARK];

export default function Dashboard() {
  const { data: allCases = [] } = useGetAllCases();
  const { data: allResearchers = [] } = useGetAllResearcher();
  const { data: allAppointments = [] } = useGetAllAppointments();
  const { data: allIntellectualProperties = [] } = useGetAllIPs();
  const { data: allSupportments = [] } = useGetAllSupportments();

  const stats = useDashboardStats({
    allCases,
    allResearchers,
    allAppointments,
    allIntellectualProperties,
    allSupportments,
    colors: COLORS,
  });

  const safePendingRatio = stats.total ? (stats.pending / stats.total) * 100 : 0;
  const safeUrgentRatio = stats.total ? (stats.urgent / stats.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 rounded-lg">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPICard icon={FileText} label="Total Cases" value={stats.total} />
        <KPICard icon={Zap} label="Pending" value={stats.pending} />
        <KPICard icon={AlertCircle} label="Urgent" value={stats.urgent} />
        <KPICard icon={Users} label="Researchers" value={allResearchers.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <TRLDistributionChart data={stats.trlDistribution} baseColor={PRIMARY_COLOR} />
          <CaseTypeStatusChart
            statusData={stats.statusData}
            caseTypeData={stats.caseTypeData}
            colors={COLORS}
          />
          <IntellectualPropertyChart data={stats.ipData} baseColor={PRIMARY_COLOR} />
          <SupportmentCharts
            agencyData={stats.agencyData}
            neededSupportData={stats.neededSupportData}
            baseColor={PRIMARY_COLOR}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <AveragesCard
            avgTRL={stats.avgTRL}
            pendingRatio={safePendingRatio}
            urgentRatio={safeUrgentRatio}
          />
          <TopResearchersCard researchers={stats.topResearchers} />
          <AppointmentsCard
            success={stats.success}
            fail={stats.fail}
            upcoming={stats.upcoming}
          />
        </div>
      </div>
    </div>
  );
}