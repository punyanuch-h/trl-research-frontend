import { useTranslation } from "react-i18next";
import { FileText, Users, Zap, AlertCircle } from "lucide-react";
import { useGetAllCases } from "@/hooks/case/get/useGetAllCases";
import { useGetAllResearcher } from "@/hooks/researcher/get/useGetAllResearcher";
import { useGetAllAppointments } from "@/hooks/case/get/useGetAllAppointments";
import { useGetAllIPs } from "@/hooks/case/get/useGetAllIPs";
import { useGetAllSupportments } from "@/hooks/case/get/useGetAllSupportments";
import { useGetAllAssessments } from "@/hooks/case/get/useGetAllAssessments";
import { useDashboardStats } from "@/hooks/useDashboardStatus";
import { KPICard } from "@/components/dashboard/KPI";
import { TRLEstimatedScoreChart } from "@/components/dashboard/TrlEstimate";
import { TRLRealScoreChart } from "@/components/dashboard/TrlReal";
import { CaseTypeStatusChart } from "@/components/dashboard/CaseType";
import { IntellectualPropertyChart } from "@/components/dashboard/IP";
import { SupportmentCharts } from "@/components/dashboard/Supportment";
import { AveragesCard } from "@/components/dashboard/AveragesTrl";
import { TopResearchersCard } from "@/components/dashboard/TopResearcher";
import { AppointmentsCard } from "@/components/dashboard/Appointments";

// Dashboard colors (Original Aquamarine)
const PRIMARY_COLOR = "#63C8DA";
const PRIMARY_LIGHT = "#8DDDEA";
const PRIMARY_DARK = "#3CAABD";
const COLORS = [PRIMARY_COLOR, PRIMARY_LIGHT, PRIMARY_DARK];


// Specific Aquamarine Shades for "ประเภททรัพย์สินทางปัญญา" Chart
const IP_COLORS = [
  "#63C8DA", // Base
  "#57B6C5",
  "#4CA4B1",
  "#40929D",
  "#358089",
  "#2A6E75",
  "#1F5C61",
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: allCases = [] } = useGetAllCases();
  const { data: allResearchers = [] } = useGetAllResearcher();
  const { data: allAppointments = [] } = useGetAllAppointments();
  const { data: allIntellectualProperties = [] } = useGetAllIPs();
  const { data: allSupportments = [] } = useGetAllSupportments();
  const { data: allAssessments = [] } = useGetAllAssessments();

  const stats = useDashboardStats({
    allCases,
    allResearchers,
    allAppointments,
    allIntellectualProperties,
    allSupportments,
    allAssessments,
    colors: COLORS,
  });

  const safePendingRatio = stats.total ? (stats.pending / stats.total) * 100 : 0;
  const safeUrgentRatio = stats.total ? (stats.urgent / stats.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 rounded-lg">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPICard icon={FileText} label={t("dashboard.researchCount")} value={stats.total} />
        <KPICard icon={Zap} label={t("dashboard.inProcess")} value={stats.pending} />
        <KPICard icon={AlertCircle} label={t("dashboard.urgentResearch")} value={stats.urgent} />
        <KPICard icon={Users} label={t("dashboard.researcherCount")} value={allResearchers.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <TRLEstimatedScoreChart data={stats.trlEstimateDistribution} baseColor={PRIMARY_COLOR} />
          <TRLRealScoreChart data={stats.trlRealDistribution} baseColor={PRIMARY_COLOR} />
          <CaseTypeStatusChart
            statusData={stats.statusData}
            caseTypeData={stats.caseTypeData}
            colors={COLORS}
          />
          <IntellectualPropertyChart data={stats.ipData} colors={IP_COLORS} />
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
            attended={stats.attended}
            absent={stats.absent}
            upcoming={stats.upcoming}
          />
        </div>
      </div>
    </div>
  );
}