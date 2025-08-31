import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { TRLItem } from "../../../types/trl";

interface Props {
  projects: TRLItem[];
  getFullNameByEmail: (email: string) => string;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (projectId: number, date: string, time: string) => void;
}

export function AddAppointmentModal({ projects, getFullNameByEmail, isOpen, onClose, onAdd }: Props) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleAdd = () => {
    if (!selectedProjectId || !selectedDate || !selectedTime) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    onAdd(selectedProjectId, selectedDate, selectedTime);
    setSelectedProjectId(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h3 className="text-lg font-medium mb-4">Add Appointment</h3>
        
        {/* Project select */}
        {/* Project Title */}
        <div className="flex-1">
          <Label>Researcher Title</Label>
          <Select
            value={selectedProjectId?.toString() || ""} 
            onValueChange={(v: string) => setSelectedProjectId(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Researcher" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.researchTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Researcher Name */}
        <div>
          <Label>Researcher</Label>
          <Input
            type="text"
            value={selectedProject ? getFullNameByEmail(selectedProject.createdBy) : ""}
            readOnly
          />
        </div>

        {/* Date input */}
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Time input */}
        <div>
          <Label>Time</Label>
          <Input
            type="time"
            value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <Label>Location</Label>
          <Input
            type="text"
          />
        </div>

        {/* Notes */}
        <div>
          <Label>Notes</Label>
          <Textarea
            placeholder="Enter notes"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={onClose}>
                Cancel
            </Button>
            <Button onClick={handleAdd} variant="default">
                Add
            </Button>
        </div>
      </div>
    </div>
  );
}
