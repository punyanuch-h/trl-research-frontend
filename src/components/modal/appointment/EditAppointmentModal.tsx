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

import type { CaseInfo, Appointment } from "../../../types/case";
import type { ResearcherInfo } from "../../../types/researcher";
import { useEditAppointment } from "@/hooks/case/useEditAppointment";

interface Project extends CaseInfo {
  appointments?: Appointment[];
  researcherInfo?: ResearcherInfo;
}

interface Props {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  appointment: Appointment | null;
  getFullNameByResearcherID: (researcher_id: string) => string;
  onSave: (updated: Appointment) => void;
}

export default function EditAppointmentModal({
  open,
  onClose,
  projects,
  appointment,
  getFullNameByResearcherID,
  onSave,
}: Props) {
  const [form, setForm] = useState<Appointment | null>(appointment);
  const [loading, setLoading] = useState(false);

  const { editAppointment, loading } = useEditAppointment(onSave, onClose);

  useEffect(() => {
    setForm(appointment);
  }, [appointment]);

  if (!form) return null;

  const handleChange = (field: keyof Appointment, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (form) editAppointment(form);
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
              value={projects.find(p => p.case_id === form.case_id)?.case_title || ""}
              readOnly
            />
          </div>

          <div>
            <Label>Researcher</Label>
            <Input
              type="text"
              value={
                getFullNameByResearcherID(
                  projects.find(p => p.case_id === form.case_id)?.researcher_id || ""
                ) || ""
              }
              readOnly
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
            <Label>Notes</Label>
            <Textarea
              value={form.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Enter notes"
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
