import React from "react";
import type { TRLItem } from '../types/trl';
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../components/AdminNavbar";
import AdminManagement from "../components/AdminManagement"; 
import AdminDashboard from "../components/AdminDashboard";
import AdminAppointment from "../components/AdminAppointment";

import mockTRL from "../mockData/mockTRL";
import mockAppointments from "../mockData/mockAppointments";
import mockUser from "../mockData/mockUser";

function mergeProjectsWithAppointments(projects: TRLItem[]) {
  return projects.map((project) => ({
    ...project,
    appointments: mockAppointments.filter(a => a.research_id === project.research_id)
  }));
}

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = React.useState<'management' | 'dashboard' | 'appointments'>('management');
  const [researchProjects, setResearchProjects] = React.useState(
    mergeProjectsWithAppointments(mockTRL) as TRLItem[]
  );

  // --- เพิ่ม filter state แบบ researcher ---
  const [customFilters, setCustomFilters] = React.useState<{ column: string; value: string }[]>([]);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedColumn, setSelectedColumn] = React.useState("type");
  const [selectedValue, setSelectedValue] = React.useState("");

  const columns = ["type", "trlScore", "status", "createdBy", "isUrgent"];
  const columnOptions: Record<string, string[]> = {
    type: [
      "TRL software",
      "TRL medical devices",
      "TRL medicines vaccines stem cells",
      "TRL plant/animal breeds",
    ],
    trlScore: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    status: ["In process", "Approve"],
    createdBy: Array.from(
      new Set(
        mockUser.map((u) => `${u.firstname} ${u.lastname}`)
      )
    ),
    isUrgent: ["true", "false"],
  };

  const appointmentColumns = ["researchTitle", "createdBy", "isUrgent"];
  const appointmentColumnOptions: Record<string, string[]> = {
    researchTitle: Array.from(
      new Set(
        mockTRL.map((r) => `${r.researchTitle}`)
      )
    ),
    createdBy: Array.from(
      new Set(
        mockUser.map((u) => `${u.firstname} ${u.lastname}`)
      )
    ),
    isUrgent: ["true", "false"],
  };

  // --- Sorting state ---
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: "asc" | "desc" }>({
    key: "createdAt",
    direction: "desc",
  });

  // --- Sorting function ---
  function sortProjects(projects: TRLItem[]) {
    const sorted = [...projects].sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue: any = a[key as keyof TRLItem];
      let bValue: any = b[key as keyof TRLItem];

      if (key === "trlScore") {
        aValue = a.trlRecommendation?.trlScore ?? "";
        bValue = b.trlRecommendation?.trlScore ?? "";
      }
      if (key === "status") {
        aValue = a.trlRecommendation?.status ?? "";
        bValue = b.trlRecommendation?.status ?? "";
      }
      if (key === "aiEstimate") {
        aValue = a.trlRecommendation?.aiEstimate ?? "";
        bValue = b.trlRecommendation?.aiEstimate ?? "";
      }
      if (key === "createdBy") {
        aValue = getFullNameByEmail(a.createdBy);
        bValue = getFullNameByEmail(b.createdBy);
      }
      if (key === "createdAt") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted.sort((a, b) => {
    // urgent case ที่ยัง active มาก่อน
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;

    // urgent case เสร็จแล้ว (isUrgent === false) จะเรียงตามวันที่
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB; // เรียงจากเก่ามาใหม่
  });
}

  // --- Apply sort before filter ---
  const sortedProjects = sortProjects(researchProjects);

  const filteredProjects = sortedProjects.filter((project) =>
    customFilters.every(({ column, value }) => {
      if (column === "type") {
        return project.researchType === value;
      }
      if (column === "trlScore") {
        return project.trlRecommendation?.trlScore?.toString() === value;
      }
      if (column === "status") {
        const statusString = project.trlRecommendation?.status === true ? "Approve" : "In process";
        return statusString === value;
      }
      if (column === "createdBy") {
        return getFullNameByEmail(project.createdBy) === value;
      }
      if (column === "isUrgent") {
        return String(project.isUrgent) === value;
      }
      if (column === "researchTitle") {
        return project.researchTitle === value;
      }
      return true;
    })
  );

  const handleResearchClick = (id: number, name: string, type: string) => {
    navigate(`/trl-1?research=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`);
  };

  const handleAIEstimate = (project: any) => {
    navigate("/trl-score", { state: { project } });
  };

  const handleDownloadResult = (filename: string) => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = filename;
    link.click();
  };

  function getFullNameByEmail(email: string): string {
    const user = mockUser.find((u) => u.email === email);
    return user ? user.firstname + " " + user.lastname : email;
  }

  // --- Pagination state ---
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [customFilters, rowsPerPage]);

  function handleSort(key: string) {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
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
        columns={
          activeView === "appointments" ? appointmentColumns : columns
        }
        columnOptions={
          activeView === "appointments" ? appointmentColumnOptions : columnOptions
        }
      >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeView === 'management' ? (
          <div>
            <AdminManagement
              projects={filteredProjects}
              setProjects={setResearchProjects}
              sortConfig={sortConfig}
              onSort={handleSort}
              onAIEstimate={handleAIEstimate}
              onDownload={handleDownloadResult}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              setCurrentPage={setCurrentPage}
              setRowsPerPage={setRowsPerPage}
              getFullNameByEmail={getFullNameByEmail}
              onAssessment ={handleResearchClick}
            />
          </div>
        ) : activeView === 'dashboard' ? (
          <div>
            <AdminDashboard />
          </div>
        ) : (
          <div>
            <AdminAppointment
              projects={filteredProjects}
              setProjects={setResearchProjects}
              sortConfig={sortConfig}
              onSort={handleSort}
              onAIEstimate={handleAIEstimate}
              onDownload={handleDownloadResult}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              setCurrentPage={setCurrentPage}
              setRowsPerPage={setRowsPerPage}
              getFullNameByEmail={getFullNameByEmail}
              onAssessment ={handleResearchClick}
            />
          </div>
        )}
      </div>
    </AdminNavbar>
  );
}