import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { format } from "date-fns";

interface Appointment {
  id: number;
  researchTitle: string;
  researcherName: string;
  date: string;
  location: string;
  status: "attended" | "absent" | "pending";
  summary?: string;
  notes?: string;
}

interface EditAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  projects: { id: number; researchTitle: string; createdBy: string }[];
  onSave: (updated: Appointment) => void;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  open,
  onClose,
  appointment,
  projects,
  onSave,
}) => {
  const [form, setForm] = useState<Appointment | null>(appointment);

  useEffect(() => {
    setForm(appointment);
  }, [appointment]);

  if (!form) return null;

  const handleChange = (field: keyof Appointment, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (form) {
      onSave(form);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Project Title */}
          <div>
            <Label>Project</Label>
            <Input
              type="text"
              value={form.researchTitle}
              readOnly
            />
          </div>

          {/* Researcher Name */}
          <div>
            <Label>Researcher</Label>
            <Input
              type="text"
              value={form.researcherName}
              readOnly
            />
          </div>

          {/* Date & Status on the same row */}
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
                onValueChange={(v: "attended" | "absent" | "pending") =>
                  handleChange("status", v)
                }
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

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              type="text"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          {/* Summary */}
          <div>
            <Label>Summary</Label>
            <Textarea
              value={form.summary || ""}
              onChange={e => handleChange("summary", e.target.value)}
              placeholder="Enter summary"
              rows={3}
            />
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Textarea
              value={form.notes || ""}
              onChange={e => handleChange("notes", e.target.value)}
              placeholder="Enter notes"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentModal;
