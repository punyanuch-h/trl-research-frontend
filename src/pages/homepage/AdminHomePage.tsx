import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminManagement from "../../components/admin/AdminManagement";
import AdminDashboard from "../../components/admin/AdminDashboard";
import AdminAppointment from "../../components/admin/AdminAppointment";

import { useGetAllCases } from "@/hooks/case/get/useGetAllCases";
import { useGetAllResearcher } from "@/hooks/researcher/get/useGetAllResearcher";
import { useGetAllAppointments } from "@/hooks/case/get/useGetAllAppointments";



// --- Types ---
interface CaseResponse {
  case_id: string;
  researcher_id: string;
  coordinator_email: string;
  trl_score: string; // or number if always numeric
  trl_suggestion: string;
  status: boolean;
  is_urgent: boolean;
  urgent_reason: string;
  urgent_feedback: string;
  case_title: string;
  case_type: string;
  case_description: string;
  case_keywords: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};

interface Appointment {
  appointment_id: string;
  case_id: string;
  date: string;
  status: string;
  location: string;
  note?: string;
}

interface ResearcherInfo {
  researcher_id: string;
  researcher_first_name: string;
  researcher_last_name: string;
}

// Merge Case + Appointment + Researcher
function mergeCasesData(
  cases: CaseResponse[],
  appointments: Appointment[],
  researchers: ResearcherInfo[]
) {
  return cases.map((c) => {
    const researcher = researchers.find((r) => r.researcher_id === c.researcher_id);
    const caseAppointments = appointments
      .filter((a) => a.case_id === c.case_id)
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
  const [activeView, setActiveView] = useState<"management" | "dashboard" | "appointments">("management");
  const { data: researcherData = [] } = useGetAllResearcher();
  const { data: caseData = [] } = useGetAllCases();
  const { data: appointmentData = [] } = useGetAllAppointments();

  const [cases, setCases] = useState<(CaseResponse & { appointments: Appointment[], researcherInfo: ResearcherInfo | null, latestAppointment: Appointment | null })[]>([]);
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
    const researcher = researcherData.find((r) => r.researcher_id === id);
    return researcher ? `${researcher.researcher_first_name} ${researcher.researcher_last_name}` : "";
  }

  const filteredCases = sortedCases.filter((c) =>
    customFilters.every(({ column, value }) => {
      if (column === "Type") return c.case_type === value;
      if (column === "Score") return c.trl_score?.toString() === value;
      if (column === "status") return (c.status ? "Approve" : "In process") === value;
      if (column === "createdBy") return getFullNameByResearcherID(c.researcher_id) === value;
      if (column === "Urgent") return String(c.is_urgent) === value;
      if (column === "Name") return c.case_title === value;
      if (column === "Date") return new Date(c.created_at).toISOString().slice(0, 10) === value;
      return true;
    })
  );

  const columnOptions: Record<string, string[]> = {
    Type: [...new Set(cases.map((c) => c.case_type))],
    Score: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    Status: ["Approve", "In process"],
    createdBy: researcherData.map(r => getFullNameByResearcherID(r.researcher_id)),
    Urgent: ["true", "false"],
    Name: [...new Set(cases.map((c) => c.case_title))],
    Date: [...new Set(cases.map((c) => new Date(c.created_at).toISOString().slice(0, 10)))].sort().reverse(),
  };

  function handleResearchClick(id: number, name: string, type: string) {
    navigate(`/trl-1?research=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`);
  }

  function handleAIEstimate(project: any) {
    navigate("/trl-score", { state: { project } });
  }

  function handleDownloadResult(filename: string) {
    const link = document.createElement("a");
    link.href = "#";
    link.download = filename;
    link.click();
  }

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
            onDownload={handleDownloadResult}
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