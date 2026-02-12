import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CaseResponse, AppointmentResponse, ResearcherResponse } from '@/types/type';
import { useEditAppointment } from "@/hooks/case/patch/useEditAppointment";

interface Project extends CaseResponse {
  appointments?: AppointmentResponse[];
  researcherInfo?: ResearcherResponse;
}

interface Props {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  appointment: AppointmentResponse | null;
  getFullNameByResearcherID: (researcher_id: string) => string;
  onSave: (updated: AppointmentResponse) => void;
}

export default function EditAppointmentModal({
  open,
  onClose,
  projects,
  appointment,
  getFullNameByResearcherID,
  onSave,
}: Props) {
  const [form, setForm] = useState<AppointmentResponse | null>(appointment);

  const { editAppointment, loading } = useEditAppointment(onSave, onClose);

  useEffect(() => {
    setForm(appointment);
  }, [appointment]);

  if (!form) return null;

  const handleChange = <K extends keyof AppointmentResponse>(
    field: K,
    value: AppointmentResponse[K]
  ) => {
    if (field === "date") {
      let dateValue = value;
      if (typeof value === "string" && value) {
        const parsed = new Date(value);
        dateValue = isNaN(parsed.getTime()) ? value : parsed.toISOString();
      }

      setForm(prev => prev ? { ...prev, [field]: dateValue } : prev);
    } else {
      setForm(prev => prev ? { ...prev, [field]: value } : prev);
    }
  };

  const handleSubmit = async () => {
    if (!form) return;

    const formToSubmit = {
      ...form,
      date: new Date(form.date).toISOString(),
    };

    try {
      await editAppointment(formToSubmit);

      toast.success("แก้ไขการนัดหมายสำเร็จ");
      onSave(formToSubmit);
      onClose();

    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      toast.error(msg || "เกิดข้อผิดพลาดในการแก้ไขการนัดหมาย");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขรายการนัดหมาย</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>ชื่องานวิจัย</Label>
            <Input
              type="text"
              value={projects.find(p => p.id === form.case_id)?.title || ""}
              readOnly
              disabled
            />
          </div>

          <div>
            <Label>ชื่อนักวิจัย/หัวหน้าโครงการ</Label>
            <Input
              type="text"
              value={
                getFullNameByResearcherID(
                  projects.find(p => p.id === form.case_id)?.researcher_id || ""
                ) || ""
              }
              readOnly
              disabled
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label>วันที่เวลานัดหมาย</Label>
              <Input
                type="datetime-local"
                value={format(new Date(form.date), "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label>สถานะ</Label>
              <Select
                value={form.status}
                onValueChange={(v: "attended" | "absent" | "pending") => handleChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attended">เข้าร่วมแล้ว</SelectItem>
                  <SelectItem value="absent">ขาดนัด</SelectItem>
                  <SelectItem value="pending">รอดำเนินการ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>สถานที่</Label>
            <Input
              type="text"
              value={form.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div>
            <Label>รายละเอียดการนัดหมาย</Label>
            <Textarea
              value={form.detail || ""}
              onChange={(e) => handleChange("detail", e.target.value)}
              placeholder="กรอกรายละเอียด"
              rows={3}
            />
          </div>

          <div>
            <Label>สรุปการประชุม</Label>
            <Textarea
              value={form.summary || ""}
              onChange={(e) => handleChange("summary", e.target.value)}
              placeholder="กรอกสรุปการประชุม"
              rows={3}
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
