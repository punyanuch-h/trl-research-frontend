import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import type { CaseResponse, AppointmentResponse, ResearcherResponse, AssessmentResponse } from "@/types/type";

import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminManagement from "../../components/admin/AdminManagement";
import AdminDashboard from "../dashboard/Dashboard";
import AdminAppointment from "../../components/admin/AdminAppointment";
import { CaseReportPDF } from "@/components/modal/report/report";

import { useGetAllCases } from "@/hooks/case/get/useGetAllCases";
import { useGetAllResearcher } from "@/hooks/researcher/get/useGetAllResearcher";
import { useGetAllAppointments } from "@/hooks/case/get/useGetAllAppointments";
import { useGetAllAssessments } from "@/hooks/case/get/useGetAllAssessments";
import { toast } from "sonner";

// Merge Case + Appointment + Researcher
function mergeCasesData(
  cases: CaseResponse[],
  appointments: AppointmentResponse[],
  researchers: ResearcherResponse[],
  assessmentData?: AssessmentResponse[]
) {
  return cases.map((c) => {
    const researcher = researchers.find((r) => r.id === c.researcher_id);
    const assessment = assessmentData ? assessmentData.find((a) => a.case_id === c.id) : null;
    const caseAppointments = appointments
      .filter((a) => a.case_id === c.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ล่าสุดก่อน
    return {
      ...c,
      researcherInfo: researcher || null,
      appointments: caseAppointments,
      latestAppointment: caseAppointments[0] || null,
      trl_estimate: assessment ? assessment.trl_estimate : null,
    };
  });
}

export default function AdminHomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const [activeView, setActiveView] = useState<"management" | "dashboard" | "appointments">("management");
  const { data: researcherData = [], isLoading: researchersLoading } = useGetAllResearcher();
  const { data: caseData = [], isLoading: casesLoading } = useGetAllCases();
  const { data: appointmentData = [], isLoading: appointmentsLoading } = useGetAllAppointments();
  const { data: assessmentData = [], isLoading: assessmentsLoading } = useGetAllAssessments();

  const [loading, setLoading] = useState(true);

  // --- Filter state ---
  const [customFilters, setCustomFilters] = useState<{ column: string; value: string }[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("type");
  const [selectedValue, setSelectedValue] = useState("");

  // --- Sorting state ---
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "createdAt",
    direction: "desc",
  });

  // --- Pagination state ---
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Merge data when loaded
  useEffect(() => {
    const isLoadingAny = casesLoading || researchersLoading || appointmentsLoading || assessmentsLoading;
    if (isLoadingAny) {
      setLoading(true);
      return;
    }
    setCases(mergeCasesData(caseData, appointmentData, researcherData, assessmentData));
    setLoading(false);
  }, [
    caseData,
    researcherData,
    appointmentData,
    assessmentData,
    casesLoading,
    researchersLoading,
    appointmentsLoading,
    assessmentsLoading,
  ]);

  // --- Sorting ---
  type AdminCase = CaseResponse & {
    appointments: AppointmentResponse[];
    researcherInfo: ResearcherResponse | null;
    latestAppointment: AppointmentResponse | null;
    trl_estimate: number | null;
  };
  const [cases, setCases] = useState<AdminCase[]>([]);

  function sortCases(projects: AdminCase[]) {
    const sorted = [...projects].sort((a, b) => {
      const { key, direction } = sortConfig;

      const aRecord = a as Record<string, unknown>;
      const bRecord = b as Record<string, unknown>;

      let aValue = aRecord[key];
      let bValue = bRecord[key];

      if (key === "createdBy") {
        const getName = (id: string) => {
          const r = researcherData.find(x => x.id === id);
          return r ? `${r.first_name} ${r.last_name}`.toLowerCase() : "";
        };

        aValue = getName(a.researcher_id);
        bValue = getName(b.researcher_id);
      }

      if (key === "trlScore") {
        aValue = a.trl_score ?? 0;
        bValue = b.trl_score ?? 0;
      }

      if (key === "status") {
        aValue = a.status ? "Approve" : "In process";
        bValue = b.status ? "Approve" : "In process";
      }

      if (key === "createdAt") {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      }

      // number compare
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // string compare
      const aStr = String(aValue ?? "").toLowerCase();
      const bStr = String(bValue ?? "").toLowerCase();

      if (aStr < bStr) return direction === "asc" ? -1 : 1;
      if (aStr > bStr) return direction === "asc" ? 1 : -1;
      return 0;
    });

    // urgent always top
    return sorted.sort((a, b) =>
      a.is_urgent === b.is_urgent ? 0 : a.is_urgent ? -1 : 1
    );
  }

  const sortedCases = sortCases(cases);

  // --- Filtering ---
  function getFullNameByResearcherID(id: string): string {
    const researcher = researcherData.find((r) => r.id === id);
    return researcher ? `${researcher.first_name} ${researcher.last_name}` : "";
  }

  const filteredCases = sortedCases.filter((c) => {
    if (customFilters.length === 0) return true;

    const grouped: Record<string, string[]> = {};

    customFilters.forEach(({ column, value }) => {
      if (!grouped[column]) grouped[column] = [];
      grouped[column].push(value);
    });

    return Object.entries(grouped).every(([column, values]) => {

      if (column === "ประเภทงานวิจัย") {
        return values.includes(c.type);
      }

      if (column === "คาดว่ามีระดับความพร้อม") {
        return values.includes(c.trl_estimate?.toString() || "");
      }

      if (column === "ระดับความพร้อม") {
        return values.includes(c.trl_score?.toString() || "");
      }

      if (column === "สถานะ") {
        const statusText = c.status ? "ผ่านการประเมิน" : "กำลังประเมิน";
        return values.includes(statusText);
      }

      if (column === "สร้างโดย") {
        const name = getFullNameByResearcherID(c.researcher_id);
        return values.includes(name);
      }

      if (column === "ความเร่งด่วน") {
        const urgentText = c.is_urgent ? "เร่งด่วน" : "ไม่เร่งด่วน";
        return values.includes(urgentText);
      }

      if (column === "ชื่องานวิจัย") {
        return values.includes(c.title);
      }

      if (column === "วันที่สร้าง") {
        const date = new Date(c.created_at).toISOString().slice(0, 10);
        return values.includes(date);
      }

      return true;
    });
  });


  const columnOptions: Record<string, string[]> = {
    ประเภทงานวิจัย: [...new Set(cases.map((c) => c.type))],
    คาดว่ามีระดับความพร้อม: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    ระดับความพร้อม: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    สถานะ: ["ผ่านการประเมิน", "กำลังประเมิน"],
    สร้างโดย: researcherData.map(r => getFullNameByResearcherID(r.id)),
    ความเร่งด่วน: ["เร่งด่วน", "ไม่เร่งด่วน"],
    ชื่องานวิจัย: [...new Set(cases.map((c) => c.title))],
    วันที่สร้าง: [...new Set(cases.map((c) => new Date(c.created_at).toISOString().slice(0, 10)))].sort().reverse(),
  };

  function handleResearchClick(id: number, name: string, type: string) {
    navigate(`/trl-1?research=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`);
  }

  function handleAIEstimate(project: AdminCase) {
    navigate("/trl-score", { state: { project } });
  }

  const handleDownloadResult = async (caseInfo: CaseResponse & { appointments: AppointmentResponse[]; latestAppointment: AppointmentResponse | null }) => {
    try {
      console.log("Generating PDF for:", caseInfo.title);

      let coordinatorData = null;
      try {
        coordinatorData = await queryClient.fetchQuery({
          queryKey: ["useGetCoordinatorByCaseId", caseInfo.id],
          queryFn: async () => {
            return await apiQueryClient.useGetCoordinatorByCaseId(caseInfo.id);
          },
        });
      } catch (err) {
        console.warn("No coordinator data found or error fetching", err);
      }

      let ipData = [];
      try {
        ipData = await queryClient.fetchQuery({
          queryKey: ["useGetIPByCaseId", caseInfo.id],
          queryFn: async () => {
            return await apiQueryClient.useGetIPByCaseId(caseInfo.id);
          },
        });
      } catch (err) {
        console.warn("No IP data found", err);
      }

      let supportmentData = null;
      try {
        supportmentData = await queryClient.fetchQuery({
          queryKey: ["useGetSupporterByCaseId", caseInfo.id],
          queryFn: async () => {
            return await apiQueryClient.useGetSupporterByCaseId(caseInfo.id);
          },
        });
      } catch (err) {
        console.warn("No supportment data found", err);
      }

      let assessmentData = null;
      try {
        assessmentData = await queryClient.fetchQuery({
          queryKey: ["useGetAssessmentByCaseId", caseInfo.id],
          queryFn: async () => {
            return await apiQueryClient.useGetAssessmentById(caseInfo.id);
          },
        });
      } catch (err) {
        console.warn("No assessment data found", err);
      }

      const pdfProps = {
        c: caseInfo,
        appointments: caseInfo.appointments || [],
        coordinatorData: coordinatorData,
        ipList: Array.isArray(ipData) ? ipData : (ipData ? [ipData] : []),
        supportmentData: supportmentData,
        assessmentData: assessmentData,
      };

      const blob = await pdf(<CaseReportPDF {...pdfProps} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const rawTitle = caseInfo.title || caseInfo.id;
      const sanitizedTitle = rawTitle.toString().replace(/[<>:"/\\|?*]/g, "_").trim();
      link.download = `result_${sanitizedTitle}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF");
    }
  };

  function handleSort(key: string) {
    setSortConfig((prev) => {
      if (prev.key === key) return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      return { key, direction: "asc" };
    });
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [customFilters, rowsPerPage]);

  return (
    <AdminNavbar
      activeView={activeView}
      onViewChange={setActiveView}
      customFilters={customFilters}
      setCustomFilters={setCustomFilters}
      showFilterModal={showFilterModal}
      setShowFilterModal={setShowFilterModal}
      selectedColumn={selectedColumn}
      setSelectedColumn={setSelectedColumn}
      selectedValue={selectedValue}
      setSelectedValue={setSelectedValue}
      columns={activeView === "appointments" ? ["researchTitle", "createdBy", "isUrgent", "createdAt"] : ["type", "trlScore", "status", "createdBy", "isUrgent", "createdAt"]}
      columnOptions={columnOptions}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeView === "management" ? (
          <AdminManagement
            projects={filteredCases}
            setProjects={setCases}
            sortConfig={sortConfig}
            onSort={handleSort}
            onAIEstimate={handleAIEstimate}
            onDownload={handleDownloadResult}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
            getFullNameByResearcherID={getFullNameByResearcherID}
            onAssessment={handleResearchClick}
          />
        ) : activeView === "dashboard" ? (
          <AdminDashboard />
        ) : (
          <AdminAppointment
            projects={filteredCases}
            setProjects={setCases}
            sortConfig={sortConfig}
            onSort={handleSort}
            onAIEstimate={handleAIEstimate}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
            getFullNameByResearcherID={getFullNameByResearcherID}
            onAssessment={handleResearchClick}
          />
        )}
      </div>
    </AdminNavbar>
  );
}