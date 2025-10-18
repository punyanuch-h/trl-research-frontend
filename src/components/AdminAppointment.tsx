import React, { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { TablePagination } from "@/components/TablePagination";
import { AddAppointmentModal } from "./modal/appointment/AddAppointmentModal";
import EditAppointmentModal from "./modal/appointment/EditAppointmentModal";

import { format } from "date-fns";
import { th } from "date-fns/locale";

import type { TRLItem } from "../types/trl";

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
  userRole?: 'admin' | 'researcher'; // Add this prop
}
export default function AdminAppointment({
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
  onAssessment,
  userRole = 'admin' // Default to admin for backward compatibility
}: Props) {
  const navigate = useNavigate();

  const [range, setRange] = useState<"all" | "1w" | "1m" | "3m" | "1y">("1w");
  const [statusFilter, setStatusFilter] = useState<"all" | "attended" | "absent" | "pending">("all");
  const today = new Date();

  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);


  // รวม appointments ทั้งหมดจากทุก project
  const allAppointments = projects.flatMap((project) =>
    (project.appointments || []).map((a) => ({
      ...a,
      researchTitle: project.researchTitle,
      researcherName: getFullNameByEmail(project.createdBy),
    }))
  );

  // คำนวณ endDate ตามช่วงที่เลือก
  const getEndDate = () => {
    const base = new Date();
    if (range === "all") return new Date("9999-12-31");
    if (range === "1w") return new Date(base.setDate(base.getDate() + 7));
    if (range === "1m") return new Date(base.setMonth(base.getMonth() + 1));
    if (range === "3m") return new Date(base.setMonth(base.getMonth() + 3));
    if (range === "1y") return new Date(base.setFullYear(base.getFullYear() + 1));
    return new Date();
  };
  const endDate = getEndDate();

  const filteredAppointments = allAppointments
    .filter(a => {
      if (range !== "all") {
        const date = new Date(a.date);
        if (!(date >= today && date <= endDate)) return false;
      }
      if (statusFilter === "all") return true;
      return a.status === statusFilter;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddAppointment = (projectId: number, date: string, time: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // const newAppointment = {
    //   id: Date.now(),
    //   date,
    //   location: "",
    //   attendees: [],
    //   status: "pending" as const
    // };
    // project.appointments = [...(project.appointments || []), newAppointment];

    setShowModal(false);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updated: any) => {
    // ตัวอย่าง: อัปเดตใน projects หรือ allAppointments ตามโครงสร้างจริง
    setEditModalOpen(false);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleViewResearch = (researchId: number) => {
    const research = projects.find((r) => r.id === researchId);
    if (research) {
      navigate("/researcher-detail", { state: { research } });
    }
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
          <CardTitle>📅 Appointment</CardTitle>
          <div className="flex gap-3">
            {/* Filter by status */}
            <Select value={statusFilter} onValueChange={(v: "all" | "attended" | "absent" | "pending") => setStatusFilter(v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="attended">✅ Attended</SelectItem>
                <SelectItem value="absent">❌ Absent</SelectItem>
              </SelectContent>
            </Select>
            {/* Filter by range */}
            <Select value={range} onValueChange={(v: "all" | "1w" | "1m" | "3m" | "1y") => setRange(v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="เลือกช่วงเวลา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Month</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            {/* Add Appointment Button */}
            {userRole === 'admin' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                <CalendarPlus className="w-4 h-4 mr-1" />
                Add Appointment
              </Button>
            )}
            <AddAppointmentModal
              projects={projects}
              getFullNameByEmail={getFullNameByEmail}
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onAdd={handleAddAppointment}
            />
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
                key={a.id + a.researchTitle}
                onClick={() => handleViewResearch(a.id)}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{a.researchTitle}</span>
                  <span className="text-sm text-gray-500">👨‍🔬 {a.researcherName}</span>
                  <span className="text-xs text-gray-400">📍 {a.location}</span>
                  <span className="text-xs">
                    {a.status === "attended" && "✅ เข้าร่วมแล้ว"}
                    {a.status === "absent" && "❌ ขาดนัด"}
                    {a.status === "pending" && "⏳ รอดำเนินการ"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {format(new Date(a.date), "dd/MM/yyyy HH:mm", { locale: th })}
                  </span>
                  {/* Only show Edit button for admin */}
                  {userRole === 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleEditAppointment(a);
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  {/* Modal สำหรับแก้ไข appointment */}
                  <EditAppointmentModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    appointment={editingAppointment}
                    projects={projects}
                    onSave={handleSaveEdit}
                  />
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
    </Card>
  );
}