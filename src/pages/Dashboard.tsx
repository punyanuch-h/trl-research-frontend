import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, Filter, Plus, View } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { TablePagination } from "@/components/TablePagination";
import Header from "../components/Header";

import { format } from "date-fns";
import { th } from "date-fns/locale";

import type { CaseInfo, Appointment } from "../types/case";

import { BACKEND_HOST } from "@/constant/constants";
const CASES_API_URL = "/trl/cases";
const APPOINTMENTS_API_URL = "/trl/assessment_trl";

// Merge CaseInfo กับ Appointment
function mergeCasesWithAppointments(cases: CaseInfo[], appointments: Appointment[]) {
  return cases.map(c => ({
    ...c,
    appointments: appointments.filter(a => a.case_id === c.case_id)
  }));
}

export default function ResearcherDashboard() {
  const navigate = useNavigate();

  // --- State สำหรับข้อมูลจาก API ---
  const [cases, setCases] = React.useState<(CaseInfo & { appointments: Appointment[] })[]>([]);
  const [loading, setLoading] = React.useState(true);

  // --- ดึงข้อมูลจาก API ---
  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${BACKEND_HOST}/trl/cases`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }).then(res => res.json()),
      fetch(`${BACKEND_HOST}/trl/appointments`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }).then(res => res.json()),
    ])
      .then(([casesData, appointmentsData]) => {
        setCases(mergeCasesWithAppointments(casesData, appointmentsData));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const [customFilters, setCustomFilters] = React.useState<{ column: string; value: string }[]>([]);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedColumn, setSelectedColumn] = React.useState("type");
  const [selectedValue, setSelectedValue] = React.useState("");

  const columns = ["type", "trlScore", "status", "isUrgent"];

  const columnOptions: Record<string, string[]> = {
    type: [
      "TRL software",
      "TRL medical devices",
      "TRL medicines vaccines stem cells",
      "TRL plant/animal breeds",
    ],
    trlScore: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    status: ["In process", "Approve"],
    isUrgent: ["true", "false"],
  };

  const filteredCases = cases.filter(c =>
    customFilters.every(({ column, value }) => {
      switch (column) {
        case "case_type": return c.case_type === value;
        case "trl_score": return c.trl_score === value;
        case "status": return (c.status ? "Approve" : "In process") === value;
        case "is_urgent": return String(c.is_urgent) === value;
        default: return true;
      }
    })
  );

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(filteredCases.length / rowsPerPage);
  

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
  // --- Sorting state ---
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: "asc" | "desc" }>({
    key: "id",
    direction: "asc",
  });

  // --- Sorting function ---
  function sortResearch(researchList: CaseInfo[]) {
    const sorted = [...researchList].sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue: any = a[key as keyof CaseInfo];
      let bValue: any = b[key as keyof CaseInfo];

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

    // ให้ urgent ขึ้นก่อน
    return sorted.sort((a, b) => {
      if (a.is_urgent === b.is_urgent) return 0;
      return a.is_urgent ? -1 : 1;
    });
  }
  // --- Apply sort before filter ---
  const sortedProjects = sortResearch(filteredCases);
  const paginatedResearch = sortedProjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  const handleViewCase = (caseId: string) => {
    const c = cases.find(c => c.case_id === caseId);
    navigate(`/case-detail/${caseId}`, { state: { caseInfo: c } });
  };

  const handleDownloadResult = (filename: string) => {
    const link = document.createElement("a");
    link.href = "#";
    link.download = filename;
    link.click();
  };


  // --- Loading state ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span>Loading...</span>
      </div>
    );
  }

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
            <Button onClick={() => setShowFilterModal(true)} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
          {/* Modal Filter */}
          <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Filter Research</DialogTitle>
              </DialogHeader>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Column</label>
                  <select
                    value={selectedColumn}
                    onChange={(e) => {
                      setSelectedColumn(e.target.value);
                      setSelectedValue("");
                    }}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    {columns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Value</label>
                  <select
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Select value</option>
                    {columnOptions[selectedColumn].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    if (selectedColumn && selectedValue) {
                      setCustomFilters((prev) => [
                        ...prev.filter((f) => f.column !== selectedColumn),
                        { column: selectedColumn, value: selectedValue },
                      ]);
                      setShowFilterModal(false);
                    }
                  }}
                  disabled={!selectedValue}
                >
                  Apply Filter
                </Button>
                <Button variant="ghost" onClick={() => setShowFilterModal(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        
        

        <Card>
          <CardHeader>
            <CardTitle>Research Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 cursor-pointer" onClick={() => setSortConfig({ key: "id", direction: sortConfig.key === "id" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    ID {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "researchTitle", direction: sortConfig.key === "researchTitle" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    Name {sortConfig.key === "researchTitle" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "researchType", direction: sortConfig.key === "researchType" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    Type {sortConfig.key === "researchType" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "trlScore", direction: sortConfig.key === "trlScore" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    TRL Score {sortConfig.key === "trlScore" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "status", direction: sortConfig.key === "status" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    Status {sortConfig.key === "status" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>For Next Step</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No research data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCases.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map(c => (
                    <TableRow key={c.case_id}>
                      <TableCell>{c.case_id}</TableCell>
                      <TableCell>
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
                      <TableCell>{c.case_type}</TableCell>
                      <TableCell>
                        {c.status === true ? (
                          <Badge variant="outline">{c.trl_score}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`min-w-[20px] text-center whitespace-nowrap ${getStatusColor(c.status === true ? "Approve" : "In process")}`}>
                          {c.status === true ? "Approve" : "In process"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2 min-w-[160px]">
                          {c.trl_score ? (
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
                                    c.case_title
                                    // c.trl_result
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
                                {c.appointments && c.appointments.length > 0 ? (
                                <Badge variant="outline" className="text-xs">
                                  Appointment:{" "}
                                  {format(
                                    new Date(
                                      c.appointments[c.appointments.length - 1].date
                                    ),
                                    "dd/MM/yyyy HH:mm",
                                    { locale: th }
                                  )}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs text-gray-400">
                                  Appointment: -
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{c.trl_suggestion || "-"}</TableCell>
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
