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
  const { data: allCases = [], isLoading: casesLoading, isError: casesError } = useGetAllCases();
  const { data: allResearchers = [], isLoading: researcherLoading, isError: researcherError } = useGetAllResearcher();
  const { data: allAppointments = [], isLoading: appointmentLoading, isError: appointmentError } = useGetAllAppointments();
  const { data: allIntellectualProperties = [], isError: ipError } = useGetAllIPs();
  const { data: allSupportments = [], isError: supportError } = useGetAllSupportments();
  const { data: allAssessments = [], isError: assessError } = useGetAllAssessments();

  const hasError =
    casesError ||
    researcherError ||
    appointmentError ||
    ipError ||
    supportError ||
    assessError;

  const isLoading =
    casesLoading ||
    researcherLoading ||
    appointmentLoading;

  const stats = useDashboardStats({
    allCases: allCases ?? [],
    allResearchers: allResearchers ?? [],
    allAppointments: allAppointments ?? [],
    allIntellectualProperties: allIntellectualProperties ?? [],
    allSupportments: allSupportments ?? [],
    allAssessments: allAssessments ?? [],
    colors: COLORS,
  }) ?? {
    total: 0,
    pending: 0,
    urgent: 0,
    attended: 0,
    absent: 0,
    upcoming: [],
    avgTRL: "0",
    topResearchers: [],
    trlEstimateDistribution: [],
    trlRealDistribution: [],
    statusData: [],
    caseTypeData: [],
    ipData: [],
    agencyData: [],
    neededSupportData: [],
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-400">
        {t("common.loading")}
      </div>
    );
  }

  const safePendingRatio = stats.total ? (stats.pending / stats.total) * 100 : 0;
  const safeUrgentRatio = stats.total ? (stats.urgent / stats.total) * 100 : 0;

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-gray-50 px-6 py-8 rounded-lg">
      {hasError && (
        <div className="mb-4 rounded-lg bg-yellow-100 border border-yellow-300 p-4 text-yellow-800">
          ⚠️ {t("dashboard.unableBackend")}
        </div>
      )}
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPICard data-testid="kpi-total" icon={FileText} label={t("dashboard.researchCount")} value={stats.total} />
        <KPICard data-testid="kpi-pending" icon={Zap} label={t("dashboard.inProcess")} value={stats.pending} />
        <KPICard data-testid="kpi-urgent" icon={AlertCircle} label={t("dashboard.urgentResearch")} value={stats.urgent} />
        <KPICard data-testid="kpi-researcher" icon={Users} label={t("dashboard.researcherCount")} value={allResearchers.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <TRLEstimatedScoreChart data-testid="chart-trl-estimate" data={stats.trlEstimateDistribution || []} baseColor={PRIMARY_COLOR} />
          <TRLRealScoreChart data-testid="chart-trl-real" data={stats.trlRealDistribution || []} baseColor={PRIMARY_COLOR} />
          <CaseTypeStatusChart
            data-testid="chart-case-type"
            statusData={stats.statusData}
            caseTypeData={stats.caseTypeData}
            colors={COLORS}
          />
          <IntellectualPropertyChart data-testid="chart-ip" data={stats.ipData || []} colors={IP_COLORS} />
          <SupportmentCharts
            data-testid="chart-support"
            agencyData={stats.agencyData}
            neededSupportData={stats.neededSupportData}
            baseColor={PRIMARY_COLOR}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <AveragesCard
            data-testid="avg-card"
            avgTRL={stats.avgTRL}
            pendingRatio={safePendingRatio}
            urgentRatio={safeUrgentRatio}
          />
          <TopResearchersCard data-testid="top-researcher-card" researchers={stats.topResearchers} />
          <AppointmentsCard
            data-testid="appointments-card"
            attended={stats.attended}
            absent={stats.absent}
            upcoming={stats.upcoming}
          />
        </div>
      </div>
    </div>
  );
}