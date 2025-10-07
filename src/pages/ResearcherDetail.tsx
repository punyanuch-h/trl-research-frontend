import React, { useState, useEffect, use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import { getUserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CalendarPlus, Edit } from "lucide-react";
import Header from "@/components/Header";
import { Download } from "lucide-react";
import { AddAppointmentModal } from "../components/modal/appointment/AddAppointmentModal";
import EditAppointmentModal from "../components/modal/appointment/EditAppointmentModal";

// ---------- Types ----------
interface TRLRecommendation {
  trlScore: number | null;
  status: boolean;
  reason: string | null;
  suggestion: string | null;
  sources: string[] | null;
  result?: string | null;
}

interface Appointment {
  id: number;
  research_id: string;
  date: string;
  location: string;
  attendees: {
    email: string;
    name: string;
  }[];
  status: "attended" | "absent" | "pending";
  summary?: string;
  notes?: string;
}

interface ResearchItem {
  id: number;
  research_id: string;
  createdAt: string;

  // Step 1: TRL Type
  researchType: string;
  
  // Step 2: Research Details
  researchTitle: string;
  description: string;
  stageOfDevelopment: string;
  currentChallenges: string;
  targetUsers: string;

  // Step 3: Technical Details
  technologiesUsed: string;
  marketComparison: string;
  ipStatus: string;
  marketing: string;
  support: string;

  // Step 4: Commercial Opportunity
  medicalBenefits: string;
  commercializationChallenges: string;
  devSupportNeeded: string;
  marketSupportNeeded: string;
  hasBusinessPartner: string;

  // Step 5: Innovation Showcase
  readyForShowcase: string;
  consent: string;

  // TRL level recommendation
  trlRecommendation: TRLRecommendation;

  // Urgent case
  isUrgent: boolean;
  urgentReason?: string;
  urgentFeedback?: string;

  createdBy: string;
  appointments?: Appointment[];
}

// ---------- Main Component ----------
export default function ResearcherDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [research, setResearch] = useState<ResearchItem | undefined>(location.state?.research);
  const [showModal, setShowModal] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchRole() {
      const userRole = await getUserRole();
      setRole(userRole);
    }
    fetchRole();
  }, []);

  const display = (value: any) => {
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '-';
    return value ? value : '-';
  };

  const handleDownloadResult = (filename: string) => {
    const link = document.createElement("a");
    link.href = "#";
    link.download = filename;
    link.click();
  };

  const handleAddAppointment = (
    projectId: number,
    date: string,
    time: string,
    locationValue?: string,
    attendees?: { email: string; name: string }[]
  ) => {
    if (!research) return;
    if (research.id !== projectId) return;

    // const newAppointment: Appointment = {
    //   id: Date.now(),
    //   research_id: research.research_id ?? String(research.id),
    //   date: `${date}T${time}:00.000Z`,
    //   location: locationValue || "-",
    //   attendees: attendees || [],
    //   status: "pending",
    //   notes: "",
    // };

    setResearch({
      ...research,
      // appointments: [...(research.appointments || []), newAppointment],
    });
    setShowModal(false);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setEditModalOpen(true);
  };
  const handleSaveEdit = (updated: any) => {
    // ตัวอย่าง: อัปเดตใน projects หรือ allAppointments ตามโครงสร้างจริง
    setEditModalOpen(false);
  };


  const getFullNameByEmail = (email: string) => email;

  if (!research) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <p className="text-lg text-muted-foreground">
          No research data found. Please go back and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <p className="text-muted-foreground">Submission ID: {research.id}</p>
              <h1 className="text-3xl font-bold text-foreground">{research.researchTitle}</h1>
              <p className="text-muted-foreground">Description: {research.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {research.trlRecommendation.result ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleDownloadResult(
                    research.trlRecommendation.result
                      ? `result_${research.researchTitle}.pdf`
                      : `result_${research.researchTitle}.txt`
                  )
                }
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            ) : research.trlRecommendation.status === false ? (
              role === "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/trl-1?research=${encodeURIComponent(research.researchTitle)}&type=${encodeURIComponent(
                        research.researchType
                      )}`
                    )
                  }
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Assessment
                </Button>
              )
            ) : (
              <span className="text-muted-foreground"></span>
            )}
          </div>
        </div>

        {/* Research Card */}
        <Card>
          <CardContent className="space-y-6">
            {/* Appointment Details */}
            <div className="flex items-center justify-between mb-2 mt-4">
              <h3 className="text-lg font-semibold">Appointment</h3>
              {role === "admin" && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowModal(true)}
                >
                  <CalendarPlus className="w-4 h-4 mr-1" />
                  Add Appointment
                </Button>
              )}
            </div>
            <AddAppointmentModal
              projects={[research]}
              getFullNameByEmail={getFullNameByEmail}
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onAdd={handleAddAppointment}
            />
            {research.appointments && research.appointments.length > 0 ? (
              <ul className="space-y-2 text-muted-foreground">
                {research.appointments.map((a, index) => (
                  <li
                    key={a.id || index}
                    className="p-2 border rounded-md flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span><strong>Location:</strong> {a.location || "-"}</span>
                      <span>
                        <strong>Status:</strong>{" "}
                        {a.status === "attended"
                          ? "✅ Attended"
                          : a.status === "absent"
                          ? "❌ Absent"
                          : "⏳ Pending"}
                      </span>
                      {a.summary && (
                        <span><strong>Summary:</strong> {a.summary}</span>
                      )}
                      {a.notes && (
                        <span><strong>Notes:</strong> {a.notes}</span>
                      )}
                      {/* {a.attendees && a.attendees.length > 0 && (
                        <span>
                          <strong>Attendees:</strong>{" "}
                          {a.attendees.map((att) => att.name).join(", ")}
                        </span>
                      )} */}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {a.date
                          ? new Date(a.date).toLocaleString("th-TH", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </span>
                        {role === "admin" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                handleEditAppointment({
                                  ...a,
                                  researchTitle: research.researchTitle,
                                  researcherName: getFullNameByEmail(research.createdBy),
                                });
                              }}
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>

                            {/* Modal สำหรับแก้ไข appointment */}
                            <EditAppointmentModal
                              open={editModalOpen}
                              onClose={() => setEditModalOpen(false)}
                              appointment={editingAppointment}
                              projects={[research]}
                              onSave={handleSaveEdit}
                            />
                          </>
                        )}
                    </div>                    
                    
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No appointments available</p>
            )}
          </CardContent>
        </Card>
        <br />
        <Card>
          <CardContent className="space-y-6 mt-4">
            {/* Research Details */}
            <Section title="Research Details">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Type:</strong> {research.researchType}</li>
                <li><strong>Stage of Development:</strong> {research.stageOfDevelopment}</li>
                <li><strong>Current Challenges:</strong> {research.currentChallenges}</li>
                <li><strong>Target Users:</strong> {research.targetUsers}</li>
              </ul>
            </Section>

            {/* Technical Details */}
            <Section title="Technical Details">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Technologies Used:</strong> {research.technologiesUsed}</li>
                <li><strong>Market Comparison:</strong> {research.marketComparison}</li>
                <li><strong>IP Status:</strong> {research.ipStatus}</li>
                <li><strong>Marketing:</strong> {research.marketing}</li>
                <li><strong>Support:</strong> {research.support}</li>
              </ul>
            </Section>

            {/* Commercial Opportunity */}
            <Section title="Commercial Opportunity">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Medical Benefits:</strong> {research.medicalBenefits}</li>
                <li><strong>Commercialization Challenges:</strong> {research.commercializationChallenges}</li>
                <li><strong>Development Support Needed:</strong> {research.devSupportNeeded}</li>
                <li><strong>Market Support Needed:</strong> {research.marketSupportNeeded}</li>
                <li><strong>Business Partner:</strong> {research.hasBusinessPartner}</li>
              </ul>
            </Section>

            {/* Innovation Showcase */}
            <Section title="Innovation Showcase">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Ready For Showcase:</strong> {research.readyForShowcase}</li>
                <li><strong>Consent:</strong> {research.consent}</li>
              </ul>
            </Section>

            {/* TRL Recommendation */}
            <Section title="TRL Recommendation">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>TRL Score:</strong> {display(research.trlRecommendation.trlScore)}</li>
                <li><strong>Status:</strong> {display(research.trlRecommendation.status)}</li>
                <li><strong>Reason:</strong> {display(research.trlRecommendation.reason)}</li>
                <li><strong>Suggestion:</strong> {display(research.trlRecommendation.suggestion)}</li>
                <li><strong>Sources:</strong> {display(research.trlRecommendation.sources)}</li>
              </ul>
            </Section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------- Reusable Components ----------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
