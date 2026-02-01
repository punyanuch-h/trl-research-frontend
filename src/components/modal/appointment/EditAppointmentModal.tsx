// src/components/modal/appointment/EditAppointmentModal.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { CaseResponse, AppointmentResponse,  ResearcherResponse} from '@/hooks/client/type.ts';
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

  const handleChange = (field: keyof AppointmentResponse, value: any) => {
    if (field === "date") {
      // Convert datetime-local format to ISO string
      const dateValue = value ? new Date(value).toISOString() : value;
      setForm({ ...form, [field]: dateValue });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const handleSubmit = () => {
    if (form) {
      const formToSubmit = {
        ...form,
        date: new Date(form.date).toISOString()
      };
      editAppointment(formToSubmit);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Project</Label>
            <Input
              type="text"
              value={projects.find(p => p.id === form.case_id)?.title || ""}
              readOnly
              disabled
            />
          </div>

          <div>
            <Label>Researcher</Label>
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
              <Label>Date & Time</Label>
              <Input
                type="datetime-local"
                value={format(new Date(form.date), "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v: "attended" | "absent" | "pending") => handleChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Location</Label>
            <Input
              type="text"
              value={form.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div>
            <Label>Summary</Label>
            <Textarea
              value={form.summary || ""}
              onChange={(e) => handleChange("summary", e.target.value)}
              placeholder="Enter summary"
              rows={3}
            />
          </div>

          <div>
            <Label>Details</Label>
            <Textarea
              value={form.detail || ""}
              onChange={(e) => handleChange("detail", e.target.value)}
              placeholder="Enter details"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
