import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { TablePagination } from "@/components/TablePagination";
import { AddAppointmentModal } from "../modal/appointment/AddAppointmentModal";
import EditAppointmentModal from "../modal/appointment/EditAppointmentModal";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import type { CaseResponse, AppointmentResponse, ResearcherResponse } from "../../types/type";

interface Project extends CaseResponse {
  appointments?: AppointmentResponse[];
  researcherInfo?: ResearcherResponse;
}

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSort: (key: string) => void;
  onAIEstimate: (project: Project) => void;
  currentPage: number;
  rowsPerPage: number;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  getFullNameByResearcherID: (researcher_id: string) => string;
  onAssessment: (id: number, name: string, type: string) => void;
  userRole?: "admin" | "researcher";
}
type RangeType = "all" | "1w" | "1m" | "3m" | "1y";

export default function AdminAppointment({
  projects,
  setProjects,
  currentPage,
  rowsPerPage,
  setCurrentPage,
  setRowsPerPage,
  getFullNameByResearcherID,
  userRole = "admin",
}: Props) {
  const navigate = useNavigate();

  const [range, setRange] = useState<RangeType>("1w");
  const [statusFilter, setStatusFilter] = useState<"all" | "attended" | "absent" | "pending">("all");
  const today = new Date();

  const [showModal, setShowModal] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentResponse | null>(null);

  // 🧩 รวม appointments ทั้งหมด
  const allAppointments = projects.flatMap((project) =>
    (project.appointments || []).map((a) => ({
      ...a,
      researchTitle: project.title,
      researcherName: getFullNameByResearcherID(project.researcher_id),
      case_id: project.id,
    }))
  );

  // 🧮 คำนวณ endDate
  const getEndDate = () => {
    const base = new Date();
    switch (range) {
      case "1w": return new Date(base.setDate(base.getDate() + 7));
      case "1m": return new Date(base.setMonth(base.getMonth() + 1));
      case "3m": return new Date(base.setMonth(base.getMonth() + 3));
      case "1y": return new Date(base.setFullYear(base.getFullYear() + 1));
      default: return new Date("9999-12-31");
    }
  };
  const endDate = getEndDate();

  const filteredAppointments = allAppointments
    .filter((a) => {
      const date = new Date(a.date);
      if (range !== "all" && !(date >= today && date <= endDate)) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  const handleSaveEdit = (updated: AppointmentResponse) => {
    setProjects(prev =>
      prev.map(project => {
        // ตรวจสอบว่า appointment นี้อยู่ใน project ไหน
        if (project.id !== updated.case_id) return project;

        const updatedAppointments = (project.appointments || []).map(a =>
          a.id === updated.id
            ? { ...a, ...updated } // merge ค่าใหม่ทั้งหมด
            : a
        );

        return { ...project, appointments: updatedAppointments };
      })
    );
    setEditModalOpen(false);
    setEditingAppointment(null);
  };

  const handleEditAppointment = (appointment: AppointmentResponse) => {
    setEditingAppointment(appointment);
    setEditModalOpen(true);
  };

  const handleViewResearch = (id: string) => {
    const c = projects.find(c => c.id === id);
    navigate(`/case-detail/${id}`, { state: { research: c } });
  };

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>📅 รายการการนัดหมาย</CardTitle>
          <div className="flex gap-3">
            {/* Filter by status */}
            <Select
              value={statusFilter}
              onValueChange={(v: "all" | "attended" | "absent" | "pending") => setStatusFilter(v)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="pending">⏳ รอดำเนินการ</SelectItem>
                <SelectItem value="attended">✅ เข้าร่วมแล้ว</SelectItem>
                <SelectItem value="absent">❌ ขาดนัด</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter by range */}
            <Select value={range} onValueChange={(v: RangeType) => setRange(v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="1w">1 สัปดาห์</SelectItem>
                <SelectItem value="1m">1 เดือน</SelectItem>
                <SelectItem value="3m">3 เดือน</SelectItem>
                <SelectItem value="1y">1 ปี</SelectItem>
              </SelectContent>
            </Select>

            {userRole === "admin" && (
              <Button variant="default" size="sm" onClick={() => setShowModal(true)}>
                <CalendarPlus className="w-4 h-4 mr-1" />
                เพิ่มรายการการนัดหมาย
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAppointments.length === 0 ? (
          <p className="text-muted-foreground">ไม่มีนัดหมายในช่วงเวลาที่เลือก</p>
        ) : (
          <ul className="space-y-3">
            {paginatedAppointments.map((a) => (
              <li
                key={a.id}
                onClick={() => handleViewResearch(a.case_id)}
                className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{a.researchTitle}</p>
                  <p className="text-sm text-gray-500">👨‍🔬 {a.researcherName}</p>
                  <p className="text-xs text-gray-400">📍 {a.location}</p>
                  <p className="text-xs">
                    {a.status === "attended" && "✅ เข้าร่วมแล้ว"}
                    {a.status === "absent" && "❌ ขาดนัด"}
                    {a.status === "pending" && "⏳ รอดำเนินการ"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {format(new Date(a.date), "dd/MM/yyyy HH:mm", { locale: th })}
                  </span>
                  {userRole === "admin" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAppointment(a);
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> แก้ไข
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </CardContent>

      {/* Modals */}
      <AddAppointmentModal
        projects={projects}
        getFullNameByResearcherID={getFullNameByResearcherID}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <EditAppointmentModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        projects={projects}
        appointment={editingAppointment}
        getFullNameByResearcherID={getFullNameByResearcherID}
        onSave={handleSaveEdit}
      />
    </Card>
  );
}