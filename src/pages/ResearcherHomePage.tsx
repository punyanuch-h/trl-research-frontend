import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TablePagination } from "@/components/TablePagination";
import Header from "../components/Header";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useGetAllCases } from "@/hooks/case/get/useGetAllCases";
import { useGetAllAppointments } from "@/hooks/case/get/useGetAllAppointments";

// --- Types ---
interface CaseInfo {
  case_id: string;
  case_title: string;
  case_type: string;
  trl_score?: string;
  status: boolean;
  is_urgent: boolean;
  urgent_reason?: string;
  urgent_feedback?: string;
  trl_suggestion?: string;
  created_at: string;
}

interface appointmentData {
  appointment_id: string;
  case_id: string;
  date: string;
  status: "attended" | "absent" | "pending";
  location: string;
  note?: string;
  summary?: string;
}
export default function ResearcherHomePage() {
  const navigate = useNavigate();
  const { data: caseData = [], isPending: isCasePending, isError: isCaseError } = useGetAllCases();
  const { data: appointmentData = [], isPending: isAppointmentPending, isError: isAppointmentError } =
    useGetAllAppointments();

  // --- State ---
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

  // --- Merge cases with their appointments ---
  // const researcherId = localStorage.getItem("researcher_id");
  // if (!researcherId) {
  //   navigate("/login");
  //   return null;
  // }

  // const mergedCases = caseData
  // .filter((c) => c.researcher_id === researcherId)
  // .map((c) => ({
  //   ...c,
  //   appointments: appointmentData.filter((a) => a.case_id === c.case_id),
  // }));
  const mergedCases: CaseInfo[] = caseData.map((c) => ({ 
    ...c, 
    appointments: appointmentData.filter((a) => a.case_id === c.case_id), 
  }));

  // --- Filter ---
  const filteredCases = mergedCases.filter((c) =>
    customFilters.every(({ column, value }) => {
      switch (column) {
        case "type":
          return c.case_type === value;
        case "trlScore":
          return String(c.trl_score) === value;
        case "status":
          return (c.status ? "Approve" : "In process") === value;
        case "isUrgent":
          return String(c.is_urgent) === value;
        default:
          return true;
      }
    })
  );

  // --- Pagination ---
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(filteredCases.length / rowsPerPage);

  // --- Sorting ---
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: "asc" | "desc" }>({
    key: "id",
    direction: "asc",
  });

  function sortResearch(researchList: CaseInfo[]) {
    const sorted = [...researchList].sort((a, b) => {
      // First priority: urgent cases first (ALWAYS)
      if (a.is_urgent !== b.is_urgent) {
        return a.is_urgent ? -1 : 1;
      }
      
      // Second priority: case_id from high to low (descending)
      if (a.case_id !== b.case_id) {
        return b.case_id.localeCompare(a.case_id); // descending order (high to low)
      }
      
      // Third priority: use the original sort config only within same urgent status and case_id
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

    return sorted;
  }

  const sortedProjects = sortResearch(filteredCases);
  const paginatedResearch = sortedProjects.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
    const c = caseData.find((c) => c.case_id === caseId);
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
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer w-[120px]" onClick={() => setSortConfig({ key: "id", direction: sortConfig.key === "id" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    ID {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer w-[180px]" onClick={() => setSortConfig({ key: "researchTitle", direction: sortConfig.key === "researchTitle" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    Name {sortConfig.key === "researchTitle" ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer text-center w-[80px]" onClick={() => setSortConfig({ key: "researchType", direction: sortConfig.key === "researchType" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    Type {sortConfig.key === "researchType" ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer text-center w-[100px]" onClick={() => setSortConfig({ key: "trlScore", direction: sortConfig.key === "trlScore" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    TRL Score {sortConfig.key === "trlScore" ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer text-center w-[90px]" onClick={() => setSortConfig({ key: "status", direction: sortConfig.key === "status" && sortConfig.direction === "asc" ? "desc" : "asc" })}>
                    Status {sortConfig.key === "status" ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
                  </TableHead>
                  <TableHead className="w-[250px]">Action</TableHead>
                  <TableHead className="w-[250px]">For Next Step</TableHead>
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
                          <Badge variant="outline">TRL {c.trl_score}</Badge>
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
