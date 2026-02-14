import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/lib/toast";
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
  const { t } = useTranslation();
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
      toast.success(t("toast.addAppointmentSuccess"));
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
      toast.warning(t("toast.addAppointmentWarning"));
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
      await addAppointment({ ...appointmentData, status: "pending" });
    } catch (error) {
      toast.error(t("toast.addAppointmentError"));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[420px]">
        <h3 className="text-lg font-medium mb-4">{t("form.addAppointmentTitle")}</h3>

        {/* Project select */}
        <div className="mb-3">
          <Label>{t("form.researchTitleLabel")}</Label>
          <Select
            value={selectedProjectId?.toString() || ""}
            onValueChange={(v: string) => setSelectedProjectId(String(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("form.selectResearch")} />
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
          <Label>{t("form.researcherName")}</Label>
          <Input
            type="text"
            value={selectedProject ? getFullNameByResearcherID(selectedProject.researcher_id) : ""}
            readOnly
            disabled
          />
        </div>

        {/* Date input */}
        <div className="mb-3">
          <Label>{t("form.appointmentDate")}</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Time input */}
        <div className="mb-3">
          <Label>{t("form.time")}</Label>
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <Label>{t("form.location")}</Label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("form.locationPlaceholder")}
          />
        </div>

        {/* Details */}
        <div className="mb-3">
          <Label>{t("form.appointmentDetails")}</Label>
          <Textarea
            placeholder={t("form.enterDetails")}
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? t("common.loading") : t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
