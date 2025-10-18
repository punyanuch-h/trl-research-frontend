import React, { useEffect, useState } from "react";
import type { CaseInfo, Appointment } from "../types/case";
import type { ResearcherInfo } from "../types/researcher";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../components/AdminNavbar";
import AdminManagement from "../components/AdminManagement";
import AdminDashboard from "../components/AdminDashboard";
import AdminAppointment from "../components/AdminAppointment";

import { BACKEND_HOST } from "@/constant/constants";

// ✅ รวม CaseInfo กับ Appointment
// รวม Case + Appointment + Researcher
function mergeCasesData(
  cases: CaseInfo[],
  appointments: Appointment[],
  researchers: ResearcherInfo[]
) {
  return cases.map((c) => {
    const researcher = researchers.find((r) => r.researcher_id === c.researcher_id);
    return {
      ...c,
      researcherInfo: researcher || null,
      appointments: appointments.filter((a) => a.case_id === c.case_id),
    };
  });
}

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"management" | "dashboard" | "appointments">("management");
  const [researchers, setResearchers] = useState<any[]>([]);

  // ✅ ใช้ cases (แทน researchProjects)
  const [cases, setCases] = useState<(CaseInfo & { appointments: Appointment[] })[]>([]);
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

  // ✅ ดึงข้อมูลจาก API จริง
  useEffect(() => {
  setLoading(true);
  Promise.all([
    fetch(`${BACKEND_HOST}/trl/cases`).then((res) => res.json()),
    fetch(`${BACKEND_HOST}/trl/appointments`).then((res) => res.json()),
    fetch(`${BACKEND_HOST}/trl/researchers`).then((res) => res.json()),
  ])
    .then(([casesData, appointmentsData, researchersData]) => {
      // ✅ merge cases + appointments + researcher
      const merged = mergeCasesData(casesData, appointmentsData, researchersData);
      setCases(merged);
      setResearchers(researchersData);
    })
    .catch((err) => console.error("Error fetching admin data:", err))
    .finally(() => setLoading(false));
}, []);

  // ✅ Sorting function (ใช้ type ของ CaseInfo)
  function sortCases(projects: (CaseInfo & { appointments: Appointment[] })[]) {
    const sorted = [...projects].sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue: any = (a as any)[key];
      let bValue: any = (b as any)[key];

      if (key === "trlScore") {
        aValue = (a as any).trlRecommendation?.trlScore ?? "";
        bValue = (b as any).trlRecommendation?.trlScore ?? "";
      }
      if (key === "status") {
        aValue = (a as any).trlRecommendation?.status ?? "";
        bValue = (b as any).trlRecommendation?.status ?? "";
      }
      if (key === "createdAt") {
        aValue = new Date((a as any).createdAt).getTime();
        bValue = new Date((b as any).createdAt).getTime();
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    // ให้ urgent มาก่อน
    return sorted.sort((a, b) => {
      if (a.is_urgent && !b.is_urgent) return -1;
      if (!a.is_urgent && b.is_urgent) return 1;
      return new Date((a as any).createdAt).getTime() - new Date((b as any).createdAt).getTime();
    });
  }

  const sortedCases = sortCases(cases);

  // ✅ Filtering
  const filteredCases = sortedCases.filter((c) =>
    customFilters.every(({ column, value }) => {
      if (column === "type") return c.case_type === value;
      if (column === "trlScore")
        return c.trl_score?.toString() === value;
      if (column === "status") {
        const statusString = c.status ? "Approve" : "In process";
        return statusString === value;
      }
      if (column === "createdBy") return getFullNameByResearcherID(c.researcher_id) === value;
      if (column === "isUrgent") return String(c.is_urgent) === value;
      if (column === "researchTitle") return c.case_title === value;
      return true;
    })
  );

  function getFullNameByResearcherID(researcherId: string): string {
    const researcher = researchers.find((r) => r.researcher_id === researcherId);
    return researcher ? `${researcher.researcher_first_name} ${researcher.researcher_last_name}` : String(researcherId);
  }


  function handleResearchClick(id: number, name: string, type: string) {
    navigate(`/trl-1?research=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`);
  }

  function handleAIEstimate(project: any) {
    navigate("/trl-score", { state: { project } });
  }

  function handleDownloadResult(filename: string) {
    const link = document.createElement("a");
    link.href = `${BACKEND_HOST}/files/${filename}`;
    link.download = filename;
    link.click();
  }

  function handleSort(key: string) {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  }

  // ✅ Column filters
  const columns = ["type", "trlScore", "status", "createdBy", "isUrgent"];
  const columnOptions: Record<string, string[]> = {
    type: Array.from(new Set(cases.map((p) => p.case_type))),
    trlScore: Array.from(new Set(cases.map((p) => p.trl_score?.toString()))),
    status: ["In process", "Approve"],
    createdBy: Array.from(new Set(researchers.map((u) => `${u.firstname} ${u.lastname}`))),
    isUrgent: ["true", "false"],
  };

  const appointmentColumns = ["researchTitle", "createdBy", "isUrgent"];
  const appointmentColumnOptions: Record<string, string[]> = {
    researchTitle: Array.from(new Set(cases.map((r) => r.case_title))),
    createdBy: Array.from(new Set(researchers.map((u) => `${u.firstname} ${u.lastname}`))),
    isUrgent: ["true", "false"],
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [customFilters, rowsPerPage]);

  if (loading) {
    return <div className="p-10 text-center text-lg text-gray-500">Loading data...</div>;
  }

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
      columns={activeView === "appointments" ? appointmentColumns : columns}
      columnOptions={activeView === "appointments" ? appointmentColumnOptions : columnOptions}
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