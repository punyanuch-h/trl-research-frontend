import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CaseResponse, AppointmentResponse, ResearcherResponse } from '@/types/type';

import { useAddAppointment } from "@/hooks/case/post/useAddAppointment";

interface Project extends CaseResponse {
  appointments?: AppointmentResponse[];
  ResearcherResponse?: ResearcherResponse;
}

interface Props {
  projects: Project[];
  getFullNameByResearcherID: (researcher_id: string) => string;
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (projectId: string, date: string, time: string) => void; // Optional สำหรับ backward compatibility
}

export function AddAppointmentModal({
  projects,
  getFullNameByResearcherID,
  isOpen,
  onClose,
  onAdd,
}: Props) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [detail, setDetail] = useState<string>("");

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // 🔄 ใช้ hook ใหม่ที่มี query invalidation
  const { addAppointment, loading } = useAddAppointment(
    () => {
      // Success callback
      alert("✅ เพิ่มนัดหมายสำเร็จ");
      // ล้างค่าฟอร์ม
      setSelectedProjectId(null);
      setSelectedDate("");
      setSelectedTime("");
      setLocation("");
      setDetail("");
    },
    onClose
  );

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!selectedProjectId || !selectedDate || !selectedTime) {
      alert("⚠️ กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const dateTimeString = `${selectedDate}T${selectedTime}`;
    const dateTime = new Date(dateTimeString);
    const isoDateString = dateTime.toISOString();

    const appointmentData = {
      case_id: selectedProjectId,
      date: isoDateString,
      location,
      detail: detail,
    };

    try {
      // 🔄 ใช้ hook ใหม่ที่มี query invalidation
      // ข้อมูลจะ refresh อัตโนมัติจาก server ผ่าน query invalidation
      await addAppointment({ ...appointmentData, status: "pending" });
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("❌ ไม่สามารถบันทึกนัดหมายได้");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[420px]">
        <h3 className="text-lg font-medium mb-4">เพิ่มรายการการนัดหมาย</h3>

        {/* Project select */}
        <div className="mb-3">
          <Label>ชื่องานวิจัย</Label>
          <Select
            value={selectedProjectId?.toString() || ""}
            onValueChange={(v: string) => setSelectedProjectId(String(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกงานวิจัย" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Researcher Name */}
        <div className="mb-3">
          <Label>ชื่อนักวิจัย/หัวหน้าโครงการ</Label>
          <Input
            type="text"
            value={selectedProject ? getFullNameByResearcherID(selectedProject.researcher_id) : ""}
            readOnly
            disabled
          />
        </div>

        {/* Date input */}
        <div className="mb-3">
          <Label>วันที่นัดหมาย</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Time input */}
        <div className="mb-3">
          <Label>เวลา</Label>
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <Label>สถานที่</Label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="เช่น Meeting Room A"
          />
        </div>

        {/* Details */}
        <div className="mb-3">
          <Label>รายละเอียดการนัดหมาย</Label>
          <Textarea
            placeholder="Enter details"
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? "กำลังบันทึก..." : "เพิ่ม"}
          </Button>
        </div>
      </div>
    </div>
  );
}
