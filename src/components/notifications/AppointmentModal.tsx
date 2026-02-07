import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { AppointmentResponse } from "@/hooks/client/type";
import { format, isValid } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar, MapPin, FileText } from "lucide-react";

interface AppointmentModalProps {
    appointment: AppointmentResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AppointmentModal({
    appointment,
    isOpen,
    onClose,
}: AppointmentModalProps) {
    if (!appointment) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary">
                        รายละเอียดการนัดหมาย
                    </DialogTitle>
                    <DialogDescription>
                        {appointment.case?.title || appointment.summary}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold">วันและเวลา</p>
                            <p className="text-sm">
                                {isValid(new Date(appointment.date))
                                    ? format(new Date(appointment.date), "PPP p", { locale: th })
                                    : "ไม่ระบุ"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold">สถานที่</p>
                            <p className="text-sm">{appointment.location || "ไม่ได้ระบุ"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold">รายละเอียด</p>
                            <p className="text-sm whitespace-pre-wrap">
                                {appointment.details || "ไม่มีรายละเอียดเพิ่มเติม"}
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 border-t text-xs text-muted-foreground">
                        รหัสงานวิจัย: {appointment.case_id}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
