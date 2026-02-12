import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, Filter, Plus, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import type { CaseResponse, AppointmentResponse } from "@/types/type";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/TablePagination";
import FilterPopup from "@/components/modal/filtter/filtter";
import Header from "@/components/Header";
import { CaseReportPDF } from "@/components/modal/report/report";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { useGetAllCasesByID } from "@/hooks/case/get/useGetAllCasesByID";
import { useGetAllAppointments } from "@/hooks/case/get/useGetAllAppointments";
import { toast } from "@/lib/toast";

// Merge Case + Appointment
function mergeCasesData(
  cases: CaseResponse[],
  appointments: AppointmentResponse[],
) {
  return cases.map((c) => {
    const caseAppointments = appointments
      .filter((a) => a.case_id === c.id)
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
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const { data: userProfile } = useGetUserProfile();
  const { data: caseData = [] } = useGetAllCasesByID(userProfile?.id) as { data: CaseResponse[] | undefined };
  const { data: appointmentData = [] } = useGetAllAppointments();

  // --- State ---
  const [cases, setCases] = useState<(CaseResponse & { appointments: AppointmentResponse[]; latestAppointment: AppointmentResponse | null })[]>([]);
  const [loading, setLoading] = useState(true);

  // --- State ---
  const [customFilters, setCustomFilters] = React.useState<{ column: string; value: string }[]>([]);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const filterBtnRef = React.useRef<HTMLDivElement | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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
  const sortKeyMap = {
    case_id: "id",
    case_title: "title",
    case_type: "type",
    trl_score: "trl_score",
    status: "status",
  } as const;

  type ResearchCase = CaseResponse & {
    appointments: AppointmentResponse[];
    latestAppointment: AppointmentResponse | null;
  };

  function sortResearch(researchList: ResearchCase[]) {
    const sorted = [...researchList].sort((a, b) => {
      const { key, direction } = sortConfig;

      // 👇 แปลง key table → key จริง
      const realKey = sortKeyMap[key as keyof typeof sortKeyMap];

      if (!realKey) return 0;

      let aValue = a[realKey];
      let bValue = b[realKey];

      // ---- special case ----
      if (realKey === "trl_score") {
        aValue = a.trl_score ?? 0;
        bValue = b.trl_score ?? 0;
      }

      if (realKey === "status") {
        aValue = a.status ? "Approve" : "In process";
        bValue = b.status ? "Approve" : "In process";
      }

      // ---- number compare ----
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // ---- string compare ----
      const aStr = String(aValue ?? "").toLowerCase();
      const bStr = String(bValue ?? "").toLowerCase();

      if (aStr < bStr) return direction === "asc" ? -1 : 1;
      if (aStr > bStr) return direction === "asc" ? 1 : -1;
      return 0;
    });

    // urgent ขึ้นบนเสมอ
    return sorted.sort((a, b) =>
      a.is_urgent === b.is_urgent ? 0 : a.is_urgent ? -1 : 1
    );
  }

  const sortedCases = sortResearch(cases);

  // --- Filtering ---
  const filteredCases = sortedCases.filter((c) => {
    if (customFilters.length === 0) return true;

    const grouped: Record<string, string[]> = {};

    customFilters.forEach(({ column, value }) => {
      if (!grouped[column]) grouped[column] = [];
      grouped[column].push(value);
    });

    return Object.entries(grouped).every(([column, values]) => {

      if (column === "ประเภทงานวิจัย") {
        return values.includes(c.type);
      }

      if (column === "ระดับความพร้อม") {
        return values.includes(c.trl_score?.toString() || "");
      }

      if (column === "สถานะ") {
        const statusText = c.status ? "ผ่านการประเมิน" : "กำลังประเมิน";
        return values.includes(statusText);
      }

      if (column === "ความเร่งด่วน") {
        const urgentText = c.is_urgent ? "เร่งด่วน" : "ไม่เร่งด่วน";
        return values.includes(urgentText);
      }

      if (column === "ชื่องานวิจัย") {
        return values.includes(c.title);
      }

      return true;
    });
  });


  // --- Columns ---
  const columns = [
    { key: "case_id", label: "รหัสงานวิจัย" },
    { key: "case_title", label: "ชื่องานวิจัย" },
    { key: "case_type", label: "ประเภทงานวิจัย" },
    { key: "trl_score", label: "ระดับความพร้อม" },
    { key: "status", label: "สถานะ" },
  ];

  // --- Filter options ---
  const columnOptions: Record<string, string[]> = {
    ประเภทงานวิจัย: [...new Set(cases.map((c) => c.type))],
    ระดับความพร้อม: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    สถานะ: ["ผ่านการประเมิน", "กำลังประเมิน"],
    ความเร่งด่วน: ["เร่งด่วน", "ไม่เร่งด่วน"],
    ชื่องานวิจัย: [...new Set(cases.map((c) => c.title))],
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
    const c = cases.find((c) => c.id === caseId);
    navigate(`/case-detail/${caseId}`, { state: { caseInfo: c } });
  };

  const handleDownloadResult = async (caseInfo: CaseResponse & { appointments: AppointmentResponse[]; latestAppointment: AppointmentResponse | null }) => {
    try {
      setDownloadingId(caseInfo.id);
      console.log("Generating PDF for:", caseInfo.title);

      let coordinatorData = null;
      try {
        coordinatorData = await queryClient.fetchQuery({
          queryKey: ["useGetCoordinatorByCaseId", caseInfo.id],
          queryFn: async () => {
            return await apiQueryClient.useGetCoordinatorByCaseId(caseInfo.id);
          },
        });
      } catch (err) {
        console.warn("No coordinator data found or error fetching", err);
      }

      let ipData = [];
      try {
        ipData = await queryClient.fetchQuery({
          queryKey: ["useGetIPByCaseId", caseInfo.id],
          queryFn: async () => {
            return await apiQueryClient.useGetIPByCaseId(caseInfo.id);
          },
        });
      } catch (err) {
        console.warn("No IP data found", err);
      }

      let supportmentData = null;
      try {
        supportmentData = await queryClient.fetchQuery({
          queryKey: ["useGetSupporterByCaseId", caseInfo.id],
          queryFn: async () => {
            return await apiQueryClient.useGetSupporterByCaseId(caseInfo.id);
          },
        });
      } catch (err) {
        console.warn("No supportment data found", err);
      }

      let assessmentData = null;
      try {
        assessmentData = await queryClient.fetchQuery({
          queryKey: ["useGetAssessmentByCaseId", caseInfo.id],
          queryFn: async () => {
            return await apiQueryClient.useGetAssessmentById(caseInfo.id);
          },
        });
      } catch (err) {
        console.warn("No assessment data found", err);
      }

      const pdfProps = {
        c: caseInfo,
        appointments: caseInfo.appointments || [],
        coordinatorData: coordinatorData,
        ipList: Array.isArray(ipData) ? ipData : (ipData ? [ipData] : []),
        supportmentData: supportmentData,
        assessmentData: assessmentData,
      };

      const blob = await pdf(<CaseReportPDF {...pdfProps} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const rawTitle = caseInfo.title || caseInfo.id;
      const sanitizedTitle = rawTitle.toString()
        .replace(/[<>:"/\\|?*]/g, '_')
        .trim();
      link.download = `result_${sanitizedTitle}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate("/researcher-form")}>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มวิจัย
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">งานวิจัยของฉัน</h1>
              <p className="text-muted-foreground">ดูสถานะการส่งงานวิจัยของคุณ</p>
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
                ตัวกรอง
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
            columns={Object.keys(columnOptions)}
            columnOptions={columnOptions}
          />
        </div>

        {/* --- Table --- */}
        <Card>
          <CardHeader>
            <CardTitle>งานวิจัยที่ส่ง</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => {
                    const isActive = sortConfig.key === col.key;
                    return (
                      <TableHead
                        key={col.key}
                        className="cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <span className="text-xs">
                            {isActive ? (
                              sortConfig.direction === "asc" ? "↑" : "↓"
                            ) : (
                              <span className="text-gray-300">↑↓</span>
                            )}
                          </span>
                        </div>
                      </TableHead>
                    );
                  })}
                  <TableHead>การดำเนินการ</TableHead>
                  <TableHead>คำแนะนำสำหรับการพัฒนา</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 2} className="text-center text-muted-foreground">
                      ไม่พบข้อมูลงานวิจัย
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProjects.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="min-w-[110px]">{c.id}</TableCell>
                      <TableCell className="min-w-[180px]">
                        <div className="flex flex-col">
                          <span
                            className={`relative group ${c.is_urgent ? "text-red-600 font-semibold" : ""}`}
                          >
                            {c.title}
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
                      <TableCell className="min-w-[120px]">{c.type}</TableCell>
                      <TableCell className="min-w-[140px] text-center">
                        {c.status === true ? (
                          <Badge variant="outline">TRL {c.trl_score}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[90px] text-center">
                        <Badge className={`min-w-[20px] text-center whitespace-nowrap ${getStatusColor(c.status === true ? "Approve" : "In process")}`}>
                          {c.status === true ? "ผ่านการประเมิน" : "กำลังประเมิน"}
                        </Badge>
                      </TableCell>

                      <TableCell className="min-w-[250px]">
                        <div className="flex gap-2 min-w-[160px]">
                          {c.status ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewCase(c.id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                ดูรายละเอียด
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={downloadingId === c.id}
                                onClick={() => handleDownloadResult(c)}
                              >
                                {downloadingId === c.id ? (
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
                            </>
                          ) : (
                            <div className="flex flex-col items-start gap-1 min-w-[200px]">
                              <div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewCase(c.id)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  ดูรายละเอียด
                                </Button>
                              </div>
                              {(() => {
                                const caseAppointments = appointmentData
                                  .filter((a) => a.case_id === c.id)
                                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                                const latestAppointment = caseAppointments[caseAppointments.length - 1];

                                return latestAppointment ? (
                                  <Badge variant="outline" className="text-xs">
                                    การนัดหมาย:{" "}
                                    {format(new Date(latestAppointment.date), "dd/MM/yyyy HH:mm", {
                                      locale: th,
                                    })}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-gray-400">
                                    การนัดหมาย: -
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
