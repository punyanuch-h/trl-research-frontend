import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Edit2, Download } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddAppointmentModal } from "../components/modal/appointment/AddAppointmentModal";
import EditAppointmentModal from "../components/modal/appointment/EditAppointmentModal";
import type { 
  CaseInfo, AssessmentTrl, IntellectualProperty, Supporter, Appointment 
} from "../types/case";
import { BACKEND_HOST } from "@/constant/constants";

export default function CaseDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // --- State สำหรับข้อมูลจาก API ---
  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [coordinator, setCoordinator] = useState<AssessmentTrl | null>(null);
  const [assessmentTrl, setAssessmentTrl] = useState<AssessmentTrl | null>(null);
  const [intellectualProperty, setIP] = useState<IntellectualProperty | null>(null);
  const [supporter, setSupporter] = useState<Supporter | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // --- ดึงข้อมูลจาก API ---
  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${BACKEND_HOST}/trl/case/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json()),
      fetch(`${BACKEND_HOST}/trl/coordinator/case/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json()),
      fetch(`${BACKEND_HOST}/trl/appointment/case/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json()),
      fetch(`${BACKEND_HOST}/trl/assessment_trl/case/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json()),
      fetch(`${BACKEND_HOST}/trl/ip/case/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json()),
      fetch(`${BACKEND_HOST}/trl/supporter/case/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json()),
    ])
      .then(([casesData, coordinatorData, appointmentsData, assessmentData, ipData, supporterData]) => {
        
        setCaseInfo(casesData);
        setAppointments(appointmentsData);
        setCoordinator(coordinatorData);
        setAssessmentTrl(assessmentData);
        setIP(ipData);
        setSupporter(supporterData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!caseInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <p className="text-lg text-muted-foreground">No case data found.</p>
      </div>
    );
  }

  const display = (value: any) => {
    if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "-";
    if (typeof value === "boolean") return value ? "✅ Yes" : "❌ No";
    return value ?? "-";
  };

  const handleEditAppointment = (a: Appointment) => {
    setEditingAppointment(a);
    setEditModalOpen(true);
  };
  console.log("Case Info:", caseInfo);
  console.log("Appointments:", appointments);
  console.log("Assessment TRL:", assessmentTrl);
  console.log("Intellectual Property:", intellectualProperty);
  console.log("Supporter:", supporter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-start space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <p className="text-muted-foreground">Submission ID: {caseInfo.case_id}</p>
              <h1 className="text-3xl font-bold text-foreground">{caseInfo.case_title}</h1>
              <p className="text-muted-foreground">
                <strong>{caseInfo.case_type}</strong> : {caseInfo.case_description}
              </p>
              {caseInfo.case_keywords && <p><strong>Keywords:</strong> {caseInfo.case_keywords}</p>}
            </div>
          </div>
        </div>

        {/* Appointments */}
        <Card className="mb-6">
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Appointments</h3>
              <Button variant="default" size="sm" onClick={() => setShowAddModal(true)}>
                <CalendarPlus className="w-4 h-4 mr-1" /> Add Appointment
              </Button>
            </div>
            <AddAppointmentModal
              projects={[caseInfo]}
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onAdd={() => setShowAddModal(false)}
              getFullNameByEmail={(e) => e}
            />

            {appointments.length > 0 ? (
              <ul className="space-y-2 text-muted-foreground">
                {appointments.map((a) => (
                  <li key={a.id} className="p-2 border rounded-md flex justify-between items-center">
                    <div className="flex flex-col">
                      <span><strong>Location:</strong> {a.location || "-"}</span>
                      <span><strong>Status:</strong> {display(a.status)}</span>
                      {a.summary && <span><strong>Summary:</strong> {a.summary}</span>}
                      {a.notes && <span><strong>Notes:</strong> {a.notes}</span>}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditAppointment(a)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No appointments available</p>
            )}

            {editingAppointment && (
              <EditAppointmentModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                appointment={editingAppointment}
                projects={[caseInfo]}
                onSave={() => setEditModalOpen(false)}
              />
            )}
          </CardContent>
        </Card>

        {/* Case Details */}
        <Card>
          <CardContent className="space-y-4">
            <Section title="Case Info">
              <ul className="space-y-1">
                <li><strong>TRL Score:</strong> {caseInfo.trl_score}</li>
                <li><strong>Status:</strong> {display(caseInfo.status)}</li>
                <li><strong>Urgent:</strong> {display(caseInfo.is_urgent)}</li>
                <li><strong>Urgent Reason:</strong> {caseInfo.urgent_reason}</li>
                <li><strong>Urgent Feedback:</strong> {caseInfo.urgent_feedback}</li>
                <li><strong>Created At:</strong> {caseInfo.created_at}</li>
              </ul>
            </Section>

            <Section title="Assessment TRL">
              <ul className="space-y-1">
                <li><strong>TRL Level Result:</strong> {assessmentTrl?.trl_level_result}</li>
                <li><strong>RQ1 Answer:</strong> {display(assessmentTrl?.rq1_answer)}</li>
                <li><strong>RQ2 Answer:</strong> {display(assessmentTrl?.rq2_answer)}</li>
                <li><strong>RQ3 Answer:</strong> {display(assessmentTrl?.rq3_answer)}</li>
                {/* ... แสดง RQ4-RQ7, CQ1-CQ9 ตามต้องการ */}
              </ul>
            </Section>

            <Section title="Intellectual Property">
              <ul className="space-y-1">
                <li><strong>Has IP:</strong> {display(intellectualProperty?.hasIP)}</li>
                <li><strong>IP Type:</strong> {intellectualProperty?.ip_types}</li>
                <li><strong>IP Status:</strong> {intellectualProperty?.ip_protection_status}</li>
                <li><strong>IP Request Number:</strong> {intellectualProperty?.ip_request_number}</li>
              </ul>
            </Section>

            <Section title="Supporter">
              <ul className="space-y-1">
                <li><strong>Support Research:</strong> {display(supporter?.support_research)}</li>
                <li><strong>Support VDC:</strong> {display(supporter?.support_vdc)}</li>
                <li><strong>Support SIEIC:</strong> {display(supporter?.support_sieic)}</li>
                <li><strong>Need Co-Developers:</strong> {display(supporter?.need_co_developers)}</li>
                <li><strong>Need Activities:</strong> {display(supporter?.need_activities)}</li>
                <li><strong>Additional Documents:</strong> {supporter?.additional_documents}</li>
              </ul>
            </Section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}