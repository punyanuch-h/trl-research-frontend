import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TablePagination } from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Edit, View, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TRLItem } from "../types/trl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Props {
  projects: TRLItem[];
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSort: (key: string) => void;
  onAIEstimate: (project: TRLItem) => void;
  onDownload: (filename: string) => void;
  currentPage: number;
  rowsPerPage: number;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  getFullNameByEmail: (email: string) => string;
  onEdit: (id: number, name: string, type: string) => void;
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
  onEdit
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
      case "Approve": return "bg-green-100 text-green-800";
      case "In process": return "bg-cyan-100 text-cyan-800";
      default: return "bg-gray-100 text-gray-800";
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

  const handleAskConfirm = (id: number) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (targetId !== null) {
      // 👉 แจ้ง parent ว่า project ไหนโดนยกเลิก urgent
      // parent (AdminHomePage) ควรมีฟังก์ชัน update state
      console.log("ยกเลิก urgent:", targetId);
    }
    setConfirmOpen(false);
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
                          className={project.isUrgent ? "text-red-600 font-semibold" : ""}
                          title={project.isUrgent ? project.urgentReason : ""}
                        >
                          {project.researchTitle}
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
                        {project.trlRecommendation.status === "Approve" ? (
                          <Badge variant="outline">TRL {project.trlRecommendation.trlScore}</Badge>
                        ) : (
                          <span className="text-muted-foreground"></span>
                        )}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <Badge className={`min-w-[20px] text-center whitespace-nowrap ${getStatusColor(project.trlRecommendation.status)}`}>
                          {project.trlRecommendation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {project.trlRecommendation.status === "Approve" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResearch(project.id)}
                            >
                              <View className="w-4 h-4 mr-2" />
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
                        ) : project.trlRecommendation.status === "In process" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onEdit(project.id, project.researchTitle, project.researchType)
                              }
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
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
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button onClick={handleConfirm} variant="destructive">
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
