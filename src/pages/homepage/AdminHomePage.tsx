import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import type { CaseResponse, AppointmentResponse, ResearcherResponse } from "@/hooks/client/type";

import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminManagement from "../../components/admin/AdminManagement";
import AdminDashboard from "../../components/admin/AdminDashboard";
import AdminAppointment from "../../components/admin/AdminAppointment";
import { CaseReportPDF } from "@/components/modal/report/report";

import { useGetAllCases } from "@/hooks/case/get/useGetAllCases";
import { useGetAllResearcher } from "@/hooks/researcher/get/useGetAllResearcher";
import { useGetAllAppointments } from "@/hooks/case/get/useGetAllAppointments";

// Merge Case + Appointment + Researcher
function mergeCasesData(
  cases: CaseResponse[],
  appointments: AppointmentResponse[],
  researchers: ResearcherResponse[]
) {
  return cases.map((c) => {
    const researcher = researchers.find((r) => r.id === c.researcher_id);
    const caseAppointments = appointments
      .filter((a) => a.case_id === c.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ล่าสุดก่อน
    return {
      ...c,
      researcherInfo: researcher || null,
      appointments: caseAppointments,
      latestAppointment: caseAppointments[0] || null,
    };
  });
}

export default function AdminHomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const [activeView, setActiveView] = useState<"management" | "dashboard" | "appointments">("management");
  const { data: researcherData = [] } = useGetAllResearcher();
  const { data: caseData = [] } = useGetAllCases();
  const { data: appointmentData = [] } = useGetAllAppointments();

  const [cases, setCases] = useState<(CaseResponse & { appointments: AppointmentResponse[], researcherInfo: ResearcherResponse | null, latestAppointment: AppointmentResponse | null })[]>([]);
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
    if (caseData.length && researcherData.length && appointmentData.length >= 0) {
      const merged = mergeCasesData(caseData, appointmentData, researcherData);
      setCases(merged);
      setLoading(false);
    }
  }, [caseData, researcherData, appointmentData]);

  // --- Sorting ---
  function sortCases(projects: typeof cases) {
    const sorted = [...projects].sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue: any = (a as any)[key];
      let bValue: any = (b as any)[key];

      if (key === "trlScore") {
        aValue = a.trl_score ?? "";
        bValue = b.trl_score ?? "";
      }
      if (key === "status") {
        aValue = a.status ?? "";
        bValue = b.status ?? "";
      }
      if (key === "createdAt") {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted.sort((a, b) => (a.is_urgent === b.is_urgent ? 0 : a.is_urgent ? -1 : 1));
  }

  const sortedCases = sortCases(cases);

  // --- Filtering ---
  function getFullNameByResearcherID(id: string): string {
    const researcher = researcherData.find((r) => r.id === id);
    return researcher ? `${researcher.first_name} ${researcher.last_name}` : "";
  }

  const filteredCases = sortedCases.filter((c) =>
    customFilters.every(({ column, value }) => {
      if (column === "Type") return c.type === value;
      if (column === "Score") return c.trl_score?.toString() === value;
      if (column === "status") return (c.status ? "Approve" : "In process") === value;
      if (column === "createdBy") return getFullNameByResearcherID(c.researcher_id) === value;
      if (column === "Urgent") return String(c.is_urgent) === value;
      if (column === "Name") return c.title === value;
      if (column === "Date") return new Date(c.created_at).toISOString().slice(0, 10) === value;
      return true;
    })
  );

  const columnOptions: Record<string, string[]> = {
    Type: [...new Set(cases.map((c) => c.type))],
    Score: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    Status: ["Approve", "In process"],
    createdBy: researcherData.map(r => getFullNameByResearcherID(r.id)),
    Urgent: ["true", "false"],
    Name: [...new Set(cases.map((c) => c.title))],
    Date: [...new Set(cases.map((c) => new Date(c.created_at).toISOString().slice(0, 10)))].sort().reverse(),
  };

  function handleResearchClick(id: number, name: string, type: string) {
    navigate(`/trl-1?research=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`);
  }

  function handleAIEstimate(project: any) {
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
        link.download = `result_${caseInfo.title || caseInfo.id}.pdf`;
       
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
  
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF");
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

  if (loading) return <div className="p-10 text-center text-lg text-gray-500">Loading data...</div>;

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