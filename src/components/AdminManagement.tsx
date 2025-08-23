import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TablePagination } from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Eye, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TRLItem } from "../types/trl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Props {
  projects: TRLItem[];
  setProjects: React.Dispatch<React.SetStateAction<TRLItem[]>>;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSort: (key: string) => void;
  onAIEstimate: (project: TRLItem) => void;
  onDownload: (filename: string) => void;
  currentPage: number;
  rowsPerPage: number;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  getFullNameByEmail: (email: string) => string;
  onAssessment : (id: number, name: string, type: string) => void;
}


export default function AdminManagement({
  projects,
  sortConfig,
  onSort,
  onAIEstimate,
  onDownload,
  currentPage,
  rowsPerPage,
  setCurrentPage,
  setRowsPerPage,
  getFullNameByEmail,
  onAssessment 
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

  const handleDownloadResult = (filename: string) => {
    onDownload(filename);
  };

  const handleViewResearch = (researchId: number) => {
    const research = projects.find((r) => r.id === researchId);
    if (research) {
      navigate("/researcher-detail", { state: { research } });
    }
  };

  const totalPages = Math.ceil(projects.length / rowsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [targetId, setTargetId] = React.useState<number | null>(null);
  const [cancelReason, setCancelReason] = React.useState("");

  const handleAskConfirm = (id: number) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = (id: number, reason: string) => {
    // if (targetId !== null) {
    //   setProjects(prevProjects =>
    //     prevProjects.map(project =>
    //       project.id === targetId
    //         ? {
    //             ...project,
    //             isUrgent: false,
    //             urgentReason: reason,
    //           }
    //         : project
    //     )
    //   );
    // }
    setConfirmOpen(false);
    setCancelReason("");
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
                    <TableRow key={project.id}>
                      <TableCell className="min-w-[120px] px-2 text-center align-middle">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="min-w-[120px] whitespace-nowrap px-2">
                        {getFullNameByEmail(project.createdBy)}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <span
                          className={`relative group ${project.isUrgent ? "text-red-600 font-semibold" : ""}`}
                        >
                          {project.researchTitle}

                          {project.isUrgent && (
                            <span className="absolute left-1/2 -translate-x-1/2 ml-10 mt-2 hidden group-hover:block 
                                            border border-red-600 bg-white text-black text-xs font-normal
                                            px-4 py-2 rounded-lg shadow-lg z-10 w-64 text-center">
                              {project.urgentReason}
                            </span>
                          )}
                        </span>

                        {project.isUrgent && (
                          <button
                            onClick={() => handleAskConfirm(project.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Mark as not urgent"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </TableCell>
                      <TableCell>{project.researchType}</TableCell>
                      <TableCell className="min-w-[120px] px-2 text-center align-middle">
                        {project.trlRecommendation.status === true ? (
                          <Badge variant="outline">TRL {project.trlRecommendation.trlScore}</Badge>
                        ) : (
                          <span className="text-muted-foreground"></span>
                        )}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <Badge className={`min-w-[20px] text-center whitespace-nowrap ${getStatusColor(project.trlRecommendation?.status === true ? "Approve" : "In process")}`}>
                          {project.trlRecommendation?.status === true ? "Approve" : "In process"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {project.trlRecommendation.status === true ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResearch(project.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {project.trlRecommendation.result ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDownloadResult(
                                    `result_${project.researchTitle}.pdf`
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
                        ) : project.trlRecommendation.status === false ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResearch(project.id)}
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
                          </>
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
              setRowsPerPage={setRowsPerPage}
            />
          </CardContent>
        </Card>
    </>
  );
}
