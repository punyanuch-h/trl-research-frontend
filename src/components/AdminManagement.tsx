import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Download, Eye, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TablePagination } from "@/components/TablePagination";
import type { CaseInfo, Appointment } from "../types/case";
import type { ResearcherInfo } from "../types/researcher";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface Project extends CaseInfo {
  appointments?: Appointment[];
  researcherInfo?: ResearcherInfo;
}

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSort: (key: string) => void;
  onAIEstimate: (project: Project) => void;
  onDownload: (filename: string) => void;
  currentPage: number;
  rowsPerPage: number;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  getFullNameByResearcherID: (researcherId: string) => string;
  onAssessment?: (id: number, name: string, type: string) => void;
}

export default function AdminManagement({
  projects,
  setProjects,
  sortConfig,
  onSort,
  onAIEstimate,
  onDownload,
  currentPage,
  rowsPerPage,
  setCurrentPage,
  setRowsPerPage,
  getFullNameByResearcherID,
  onAssessment,
}: Props) {
  const tableColumns = [
    { key: "createdAt", label: "Create Date" },
    { key: "createdBy", label: "Create By" },
    { key: "researchTitle", label: "Name" },
    { key: "researchType", label: "Type" },
    { key: "trlScore", label: "TRL Score" },
    { key: "status", label: "Status" },
  ];
  const navigate = useNavigate();

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

  const handleViewResearch = (caseId: string) => {
    const c = projects.find(c => c.case_id === caseId);
    navigate(`/case-detail/${caseId}`, { state: { caseInfo: c } });
  };

  const totalPages = Math.ceil(projects.length / rowsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [targetId, setTargetId] = React.useState<string | null>(null);
  const [cancelReason, setCancelReason] = React.useState("");

  const handleAskConfirm = (id: string) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = (id: string | null, reason: string) => {
    if (id !== null) {
      setProjects(prev =>
        prev.map(p =>
          p.case_id === id ? { ...p, isUrgent: false, urgentReason: reason } : p
        )
      );
    }
    setConfirmOpen(false);
    setCancelReason("");
  };

  const handleDownloadResult = (filename: string) => {
    onDownload(filename);
  };

  return (
    <>
      <Card>
          <CardHeader>
            <CardTitle>Research Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {tableColumns.map(col => (
                    <TableHead
                      key={col.key}
                      className="cursor-pointer select-none"
                      onClick={() => onSort(col.key)}
                    >
                      {col.label}
                      {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
                    </TableHead>
                  ))}
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={tableColumns.length + 1} className="text-center text-muted-foreground">
                      No research data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProjects.map(project => (
                    <TableRow key={project.case_id}>
                      <TableCell className="min-w-[120px] px-2 text-center align-middle">
                        {new Date(project.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="min-w-[120px] whitespace-nowrap px-2">
                        {getFullNameByResearcherID(project.researcher_id)}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <span
                          className={`relative group ${project.is_urgent ? "text-red-600 font-semibold" : ""}`}
                        >
                          {project.case_title}

                          {project.is_urgent && (
                            <span className="absolute left-1/2 -translate-x-1/2 ml-10 mt-2 hidden group-hover:block 
                                            border border-red-600 bg-white text-black text-xs font-normal
                                            px-4 py-2 rounded-lg shadow-lg z-10 w-64 text-center">
                              {project.urgent_reason}
                            </span>
                          )}
                        </span>

                        {project.is_urgent && (
                          <button
                            onClick={() => handleAskConfirm(project.case_id)}
                            className="text-red-500 hover:text-red-700"
                            title="Mark as not urgent"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </TableCell>
                      <TableCell>{project.case_type}</TableCell>
                      <TableCell className="min-w-[120px] px-2 text-center align-middle">
                        {project.status === true ? (
                          <Badge variant="outline">TRL {project.trl_score}</Badge>
                        ) : (
                          <span className="text-muted-foreground"></span>
                        )}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <Badge className={`min-w-[20px] text-center whitespace-nowrap ${getStatusColor(project.status === true ? "Approve" : "In process")}`}>
                          {project.status === true ? "Approve" : "In process"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {project.status === true ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResearch(project.case_id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {project.trl_score ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDownloadResult(
                                    `result_${project.case_title}.pdf`
                                  )
                                }
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Result
                              </Button>
                            ) : (
                              <div className="invisible">
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-2" />
                                  Result
                                </Button>
                              </div>
                            )}

                            
                          </>
                        ) : project.status === false ? (
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewResearch(project.case_id)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onAIEstimate(project)}
                              >
                                <Sparkles className="w-4 h-4 mr-1" />
                                AI Estimate
                              </Button>
                            </div>
                            {project.appointments && project.appointments.length > 0 ? (
                              <Badge variant="outline" className="text-xs">
                                Appointment:{" "}
                                {format(
                                  new Date(
                                    project.appointments[project.appointments.length - 1].date
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
                        ) : (
                          // กรณี status อื่นๆ ไม่แสดงปุ่มเลย หรือแสดงอะไรตามต้องการ
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>

                    </TableRow>
                ))
                )}
                {/* Confirm Dialog */}
                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>ยืนยันการยกเลิก</DialogTitle>
                    </DialogHeader>
                    <p>คุณแน่ใจหรือไม่ว่าจะยกเลิก urgent case?</p>

                    <textarea
                      className="w-full border rounded p-2 mt-2"
                      placeholder="ระบุเหตุผล..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />

                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button onClick={() => handleConfirm(targetId, cancelReason)} variant="destructive">
                        ยืนยัน
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableBody>
            </Table>
            <TablePagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          </CardContent>
        </Card>
    </>
  );
}
