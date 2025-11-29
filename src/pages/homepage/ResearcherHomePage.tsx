import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TablePagination } from "@/components/TablePagination";
import FilterPopup from "@/components/modal/filtter/filtter";
import Header from "@/components/Header";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { useGetAllCasesByID } from "@/hooks/case/get/useGetAllCasesByID";
import { useGetAllAppointments } from "@/hooks/case/get/useGetAllAppointments";

// --- Types ---
interface CaseResponse {
  case_id: string;
  researcher_id: string;
  coordinator_email: string;
  trl_score: string;
  trl_suggestion: string;
  status: boolean;
  is_urgent: boolean;
  urgent_reason: string;
  urgent_feedback: string;
  case_title: string;
  case_type: string;
  case_description: string;
  case_keywords: string;
};

interface Appointment {
  appointment_id: string;
  case_id: string;
  date: string;
  status: string;
  location: string;
  note?: string;
}

// Merge Case + Appointment
function mergeCasesData(
  cases: CaseResponse[],
  appointments: Appointment[],
) {
  return cases.map((c) => {
    const caseAppointments = appointments
      .filter((a) => a.case_id === c.case_id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
      ...c,
      appointments: caseAppointments,
      latestAppointment: caseAppointments[0] || null,
    };
  });
}

export default function ResearcherHomePage() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetUserProfile();
  const { data: caseData = [] } = useGetAllCasesByID(userProfile?.id);
  const { data: appointmentData = [] } = useGetAllAppointments();
  
  // --- State ---
  const [cases, setCases] = useState<(CaseResponse & { appointments: Appointment[]; latestAppointment: Appointment | null })[]>([]);
  const [loading, setLoading] = useState(true);

  // --- State ---
  const [customFilters, setCustomFilters] = React.useState<{ column: string; value: string }[]>([]);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedColumn, setSelectedColumn] = React.useState("type");
  const [selectedValue, setSelectedValue] = React.useState("");
  const filterBtnRef = React.useRef<HTMLDivElement | null>(null);

  // --- Sorting state ---
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "case_id",
    direction: "desc",
  });

  // --- Pagination ---
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [currentPage, setCurrentPage] = React.useState(1);

  // --- Merge data ---
  useEffect(() => {
    if (caseData && appointmentData) {
      const merged = mergeCasesData(caseData, appointmentData);
      setCases(merged);
      setLoading(false);
    }
  }, [caseData, appointmentData]);

  // --- Sorting ---
  function sortResearch(researchList: typeof caseData) {
    const sorted = [...researchList].sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue: any = (a as any)[key];
      let bValue: any = (b as any)[key];

      if (key === "trl_score") {
        aValue = a.trl_score ?? "";
        bValue = b.trl_score ?? "";
      }
      if (key === "status") {
        aValue = a.status ?? "";
        bValue = b.status ?? "";
      }
      
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted.sort((a, b) => (a.is_urgent === b.is_urgent ? 0 : a.is_urgent ? -1 : 1));
  }

  const sortedCases = sortResearch(cases);
  
  // --- Filtering ---
  const filteredCases = sortedCases.filter((c) =>
    customFilters.every(({ column, value }) => {
      if (column === "Type") return c.case_type === value;
      if (column === "Score") return c.trl_score?.toString() === value;
      if (column === "Status") return (c.status ? "Approve" : "In process") === value;
      if (column === "Urgent") return String(c.is_urgent) === value;
      if (column === "Name") return c.case_title === value;
      return true;
    })
  );

  // --- Columns ---
  const columns = [
    { key: "case_id", label: "ID" },
    { key: "case_title", label: "Name" },
    { key: "case_type", label: "Type" },
    { key: "trl_score", label: "TRL Score" },
    { key: "status", label: "Status" },
  ];

  // --- Filter options ---
  const columnOptions: Record<string, string[]> = {
    Type: [...new Set(cases.map((c) => c.case_type))],
    Score: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    Status: ["Approve", "In process"],
    Urgent: ["true", "false"],
    Name: [...new Set(cases.map((c) => c.case_title))],
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };
  
  useEffect(() => {
    setCurrentPage(1);
  }, [customFilters, rowsPerPage]);

  if (loading) return <div className="p-10 text-center text-lg text-gray-500">Loading data...</div>;

  const totalPages = Math.ceil(filteredCases.length / rowsPerPage);
  const paginatedProjects = filteredCases.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // --- Utils ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approve":
        return "bg-green-100 text-green-800";
      case "In process":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewCase = (caseId: string) => {
    const c = cases.find((c) => c.case_id === caseId);
    navigate(`/case-detail/${caseId}`, { state: { caseInfo: c } });
  };

  const handleDownloadResult = (filename: string) => {
    const link = document.createElement("a");
    link.href = "#";
    link.download = filename;
    link.click();
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate("/researcher-form")}>
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Research</h1>
              <p className="text-muted-foreground">View your research submission status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {customFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 text-xs px-2 py-1"
              >
                {filter.column}: {filter.value}
                <button
                  onClick={() =>
                    setCustomFilters((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="ml-1 text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
            <div ref={filterBtnRef} className="inline-block">
              <Button onClick={() => setShowFilterModal(true)} variant="outline">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          
          {/* --- Modal Filter --- */}
          <FilterPopup
            open={showFilterModal}
            onOpenChange={setShowFilterModal}
            anchorRef={filterBtnRef}
            customFilters={customFilters}
            setCustomFilters={setCustomFilters}
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            columns={Object.keys(columnOptions)}
            columnOptions={columnOptions}
          />
        </div>
        
        {/* --- Table --- */}
        <Card>
          <CardHeader>
            <CardTitle>Research Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className="cursor-pointer select-none"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {sortConfig.key === col.key
                        ? sortConfig.direction === "asc"
                          ? " ↑"
                          : " ↓"
                        : ""}
                    </TableHead>
                  ))}
                  <TableHead>Action</TableHead>
                  <TableHead>For Next Step</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No research data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProjects.map((c) => (
                    <TableRow key={c.case_id}>
                      <TableCell className="min-w-[110px]">{c.case_id}</TableCell>
                      <TableCell className="min-w-[180px]">
                        <div className="flex flex-col">
                          <span
                            className={`relative group ${c.is_urgent ? "text-red-600 font-semibold" : ""}`}
                          >
                            {c.case_title}
                            {c.is_urgent && (
                              <span className="absolute left-1/2 -translate-x-1/2 ml-10 mt-2 hidden group-hover:block 
                                              border border-red-600 bg-white text-black text-xs font-normal
                                              px-4 py-2 rounded-lg shadow-lg z-10 w-64 text-center">
                                {c.urgent_reason}
                              </span>
                            )}
                          </span>

                          {!c.status && c.urgent_feedback && (
                            <span className="text-xs text-gray-500 mt-1">
                              {c.urgent_feedback}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[120px]">{c.case_type}</TableCell>
                      <TableCell className="min-w-[100px] text-center">
                        {c.status === true ? (
                          <Badge variant="outline">TRL {c.trl_score}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[90px] text-center">
                        <Badge className={`min-w-[20px] text-center whitespace-nowrap ${getStatusColor(c.status === true ? "Approve" : "In process")}`}>
                          {c.status === true ? "Approve" : "In process"}
                        </Badge>
                      </TableCell>

                      <TableCell className="min-w-[250px]">
                        <div className="flex gap-2 min-w-[160px]">
                          {c.status ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewCase(c.case_id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDownloadResult(
                                    c.trl_score
                                      ? `result_${c.case_title}.pdf`
                                      : `result_${c.case_title}.txt`
                                  )
                                }
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Result
                              </Button>
                            </>
                          ) : (
                            <div className="flex flex-col items-start gap-1 min-w-[200px]">
                                <div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewCase(c.case_id)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                              </div>
                              {(() => {
                                const caseAppointments = appointmentData
                                  .filter((a) => a.case_id === c.case_id)
                                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                                const latestAppointment = caseAppointments[caseAppointments.length - 1];

                                return latestAppointment ? (
                                  <Badge variant="outline" className="text-xs">
                                    Appointment:{" "}
                                    {format(new Date(latestAppointment.date), "dd/MM/yyyy HH:mm", {
                                      locale: th,
                                    })}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-gray-400">
                                    Appointment: -
                                  </Badge>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[250px]">{c.trl_suggestion || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="mt-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onRowsPerPageChange={(value) => setRowsPerPage(value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
