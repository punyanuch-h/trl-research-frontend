import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import type { CaseInfo, Appointment } from "../../../types/case";
import type { ResearcherInfo } from "../../../types/researcher";

import { useAddAppointment } from "@/hooks/case/post/useAddAppointment";

interface Project extends CaseInfo {
  appointments?: Appointment[];
  researcherInfo?: ResearcherInfo;
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
  const [note, setNote] = useState<string>("");

  const selectedProject = projects.find((p) => p.case_id === selectedProjectId);
  
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
      setNote("");
    },
    onClose
  );

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!selectedProjectId || !selectedDate || !selectedTime) {
      alert("⚠️ กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const appointmentData = {
      case_id: selectedProjectId,
      date: `${selectedDate}T${selectedTime}:00Z`,
      location,
      note: note,
    };

    try {
      // 🔄 ใช้ hook ใหม่ที่มี query invalidation
      await addAppointment({ ...appointmentData, status: "pending" });
      
      // 📝 เรียก onAdd callback ถ้ามี (สำหรับ backward compatibility)
      if (onAdd) {
        onAdd(selectedProjectId, selectedDate, selectedTime);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("❌ ไม่สามารถบันทึกนัดหมายได้");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[420px]">
        <h3 className="text-lg font-medium mb-4">Add Appointment</h3>

        {/* Project select */}
        <div className="mb-3">
          <Label>Research Title</Label>
          <Select
            value={selectedProjectId?.toString() || ""}
            onValueChange={(v: string) => setSelectedProjectId(String(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Research" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.case_id} value={p.case_id.toString()}>
                  {p.case_title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Researcher Name */}
        <div className="mb-3">
          <Label>Researcher</Label>
          <Input
            type="text"
            value={selectedProject ? getFullNameByResearcherID(selectedProject.researcher_id) : ""}
            readOnly
          />
        </div>

        {/* Date input */}
        <div className="mb-3">
          <Label>Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Time input */}
        <div className="mb-3">
          <Label>Time</Label>
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <Label>Location</Label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="เช่น Meeting Room A"
          />
        </div>

        {/* Notes */}
        <div className="mb-3">
          <Label>Notes</Label>
          <Textarea
            placeholder="Enter notes"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? "Saving..." : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}
