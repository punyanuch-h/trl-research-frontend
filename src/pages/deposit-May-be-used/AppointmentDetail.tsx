import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import type { CaseResponse, AppointmentResponse, ResearcherResponse } from "@/hooks/client/type";


interface Project extends CaseResponse {
  appointments?: AppointmentResponse[];
  researcherInfo?: ResearcherResponse;
}

interface Props {
  projects: Project[];
  getFullNameByResearcherID: (researcher_id: string) => string;
}

export default function AppointmentDetail({ projects, getFullNameByResearcherID }: Props) {
  const { id } = useParams(); // appointment id
  const navigate = useNavigate();

  // หา appointment ที่ตรงกับ id
  const appointment = projects
    .flatMap((p) =>
      (p.appointments || []).map((a) => ({
        ...a,
        researchTitle: p.title,
        researcherName: getFullNameByResearcherID(p.researcher_id),
      }))
    )
    .find((a) => a.id.toString() === id);

  if (!appointment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ไม่พบนัดหมาย</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate(-1)}>⬅ กลับ</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>📌 รายละเอียดนัดหมาย</CardTitle>
        <Button variant="outline" onClick={() => navigate(-1)}>
          ⬅ กลับ
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <p>
          <span className="font-semibold">โครงการ:</span> {appointment.researchTitle}
        </p>
        <p>
          <span className="font-semibold">นักวิจัย:</span> {appointment.researcherName}
        </p>
        <p>
          <span className="font-semibold">สถานที่:</span> {appointment.location || "-"}
        </p>
        <p>
          <span className="font-semibold">วันเวลา:</span>{" "}
          {format(new Date(appointment.date), "dd/MM/yyyy HH:mm", { locale: th })}
        </p>
        <p>
          <span className="font-semibold">สถานะ:</span>{" "}
          {appointment.status === "attended" && "✅ เข้าร่วมแล้ว"}
          {appointment.status === "absent" && "❌ ขาดนัด"}
          {appointment.status === "pending" && "⏳ รอดำเนินการ"}
        </p>
        <div>
          <span className="font-semibold">ผู้เข้าร่วม:</span>
          {/* <ul className="list-disc ml-6 mt-1">
            {appointment.attendees?.length > 0 ? (
              appointment.attendees.map((att: string, idx: number) => (
                <li key={idx}>{getFullNameByResearcherID(att)}</li>
              ))
            ) : (
              <li>-</li>
            )}
          </ul> */}
        </div>
      </CardContent>
    </Card>
  );
}
