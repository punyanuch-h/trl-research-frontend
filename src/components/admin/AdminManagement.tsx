import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TablePagination } from "@/components/TablePagination";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useUpdateUrgentStatus } from "@/hooks/case/patch/useUpdateUrgentStatus";

import type { CaseResponse, AppointmentResponse, ResearcherResponse } from "../../types/type";
import { toast } from "sonner";

interface Project extends CaseResponse {
  appointments?: AppointmentResponse[];
  researcherInfo?: ResearcherResponse;
  trl_estimate?: number;
}
interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSort: (key: string) => void;
  onAIEstimate: (project: Project) => void;
  onDownload: (project: Project) => void;
  currentPage: number;
  rowsPerPage: number;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  getFullNameByResearcherID: (researcherId: string) => string;
  onAssessment?: (id: number, name: string, type: string) => void;
}

export default function AdminManagement({
  projects,
  sortConfig,
  onSort,
  onDownload,
  currentPage,
  rowsPerPage,
  setCurrentPage,
  setRowsPerPage,
  getFullNameByResearcherID,
}: Props) {
  const tableColumns = [
    { key: "created_at", label: "วันที่สร้าง" },
    { key: "createdBy", label: "สร้างโดย" },
    { key: "title", label: "ชื่องานวิจัย" },
    { key: "type", label: "ประเภทงานวิจัย" },
    { key: "trl_estimate", label: "คาดว่ามีระดับความพร้อม" },
    { key: "trlScore", label: "ระดับความพร้อม" },
    { key: "status", label: "สถานะ" },
  ];
  const navigate = useNavigate();
  const updateUrgentStatus = useUpdateUrgentStatus();

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
    const c = projects.find(c => c.id === caseId);
    navigate(`/case-detail/${caseId}`, { state: { CaseResponse: c } });
  };

  const totalPages = Math.ceil(projects.length / rowsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [targetId, setTargetId] = React.useState<string | null>(null);
  const [cancelReason, setCancelReason] = React.useState("");
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const handleAskConfirm = (id: string) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = async (id: string | null, reason: string) => {
    if (id !== null) {
      try {
        await updateUrgentStatus.mutateAsync({
          caseId: id,
          urgentData: {
            is_urgent: false,
            urgent_feedback: reason
          }
        });
        setConfirmOpen(false);
        setCancelReason("");
      } catch (error) {
        console.error("Failed to update urgent status:", error);
        toast.error("Failed to update urgent status. Please try again.");
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>รายการงานวิจัย</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map(col => {
                  const isActive = sortConfig.key === col.key;
                  const direction = sortConfig.direction;

                  return (
                    <TableHead
                      key={col.key}
                      className="cursor-pointer select-none"
                      onClick={() => onSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        <span className="text-xs">
                          {isActive ? (
                            direction === "asc" ? "↑" : "↓"
                          ) : (
                            <span className="opacity-30">↑↓</span>
                          )}
                        </span>
                      </span>
                    </TableHead>
                  );
                })}
                <TableHead>การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tableColumns.length + 1} className="text-center text-muted-foreground">
                    ไม่พบข้อมูลงานวิจัย
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProjects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="min-w-[140px] px-2 align-middle">
                      {format(new Date(project.created_at), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="min-w-[120px] px-2 items-center">
                      {getFullNameByResearcherID(project.researcher_id)}
                    </TableCell>
                    <TableCell className="min-w-[180px] px-2 items-center">
                      <div className="flex flex-col">
                        <span
                          className={`relative group ${project.is_urgent ? "text-red-600 font-semibold" : ""}`}
                        >
                          {project.title}

                          {project.is_urgent && (
                            <span className="absolute left-1/2 -translate-x-1/2 ml-10 mt-2 hidden group-hover:block 
                                              border border-red-600 bg-white text-black text-xs font-normal
                                              px-4 py-2 rounded-lg shadow-lg z-10 w-64 text-center">
                              {project.urgent_reason}
                            </span>
                          )}
                        </span>

                        {project.urgent_feedback && (
                          <span className="text-xs text-gray-500 mt-1">
                            {project.urgent_feedback}
                          </span>
                        )}
                      </div>

                      {project.is_urgent && (
                        <button
                          onClick={() => handleAskConfirm(project.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Mark as not urgent"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                    </TableCell>
                    <TableCell>{project.type}</TableCell>
                    <TableCell className="min-w-[120px] px-2 text-center align-middle">
                      {project.trl_estimate != null ? (
                        <Badge variant="outline">TRL {project.trl_estimate}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[140px] px-2 text-center align-middle">
                      {project.status === true ? (
                        <Badge variant="outline">TRL {project.trl_score}</Badge>
                      ) : (
                        <span className="text-muted-foreground"></span>
                      )}
                    </TableCell>
                    <TableCell className="text-center align-middle">
                      <Badge className={`min-w-[20px] text-center whitespace-nowrap ${getStatusColor(project.status === true ? "Approve" : "In process")}`}>
                        {project.status === true ? "ผ่านการประเมิน" : "กำลังประเมิน"}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[250px] flex gap-2">
                      {project.status === true ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewResearch(project.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            ดูรายละเอียด
                          </Button>
                          {project.trl_score ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={downloadingId === project.id}
                              onClick={async () => {
                                try {
                                  setDownloadingId(project.id);
                                  await onDownload(project);
                                } finally {
                                  setDownloadingId(null);
                                }
                              }}
                            >
                              {downloadingId === project.id ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  กำลังโหลดข้อมูล...
                                </span>
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-2" />
                                  ผลการประเมิน
                                </>
                              )}
                            </Button>

                          ) : (
                            <div className="invisible">
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                ผลการประเมิน
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
                              onClick={() => handleViewResearch(project.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              ดูรายละเอียด
                            </Button>
                          </div>
                          {project.appointments && project.appointments.length > 0 ? (
                            <Badge variant="outline" className="text-xs">
                              การนัดหมาย:{" "}
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
                              การนัดหมาย: -
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
            </TableBody>
          </Table>

          {/* Confirm Dialog */}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ยืนยันการยกเลิก</DialogTitle>
              </DialogHeader>
              <p>คุณแน่ใจหรือไม่ว่าจะยกเลิกสถานะ "เร่งด่วน"?</p>

              <textarea
                className="w-full border rounded p-2 mt-2"
                placeholder="ระบุเหตุผล..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setConfirmOpen(false)}
                  disabled={updateUrgentStatus.isPending}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={() => handleConfirm(targetId, cancelReason)}
                  variant="destructive"
                  disabled={updateUrgentStatus.isPending}
                >
                  {updateUrgentStatus.isPending ? "กำลังประมวลผล..." : "ยืนยัน"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
