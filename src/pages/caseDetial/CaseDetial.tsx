import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Edit2, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddAppointmentModal } from "../../components/modal/appointment/AddAppointmentModal";
import EditAppointmentModal from "../../components/modal/appointment/EditAppointmentModal";

import { getUserRole } from "@/lib/auth";
import { useGetCaseById } from "@/hooks/case/get/useGetCaseById";
import { useGetCoordinatorByCaseId } from "@/hooks/case/get/useGetCoordinatorByCaseId";
import { useGetAppointmentByCaseId } from "@/hooks/case/get/useGetAppointmentByCaseId";
import { useGetAssessmentById } from "@/hooks/case/get/useGetAssessmentById";
import { useGetIPByCaseId } from "@/hooks/case/get/useGetIPByCaseId";
import { useGetSupporterByCaseId } from "@/hooks/case/get/useGetSupporterByCaseId";
import { useGetResearcherById } from "@/hooks/researcher/get/useGetResearcherById";

export default function CaseDetail() {
  const navigate = useNavigate();
  const role = getUserRole();
  const { id } = useParams<{ id: string }>();
  const { data: caseData, isPending: isCasePending, isError: isCaseError } = useGetCaseById(id || '');
  const { data: coordinatorData, isPending: isCoordinatorPending, isError: isCoordinatorError } = useGetCoordinatorByCaseId(id || '');
  const { data: appointmentData, isPending: isAppointmentPending, isError: isAppointmentError } = useGetAppointmentByCaseId(id || '');
  const { data: assessmentData, isPending: isAssessmentPending, isError: isAssessmentError  } = useGetAssessmentById(id || '');
  const { data: ipData, isPending: isIPPending, isError: isIPError  } = useGetIPByCaseId(id || '');
  const { data: supporterData, isPending: isSupporterPending, isError: isSupporterError } = useGetSupporterByCaseId(id || '');
  
  // Get researcher data for the case
  const { data: researcherData } = useGetResearcherById(caseData?.researcher_id || '');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any | null>(null);

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedAppointment: any) => {
    setEditModalOpen(false);
    setEditingAppointment(null);
  };

  // Function to get researcher full name
  const getFullNameByResearcherID = (researcher_id: string) => {
    if (!researcherData) return researcher_id;
    return `${researcherData.researcher_first_name} ${researcherData.researcher_last_name}`;
  };

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(role === "admin" ? "/admin-homepage" : "/researcher-homepage")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Research Details
                </h1> 
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">
                  Case ID: {caseData?.case_id || 'Loading...'}
                </Badge>
                {role === "admin" && (
                  <Button onClick={() => navigate(`/assessment/${id}`)} >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Assessment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-6 space-y-6">

        {/* Case Details */}
        <Card className="w-full">
          <CardHeader>
            {isCasePending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Loading case details...</span>
              </div>
            ) : isCaseError ? (
              <div className="text-destructive">
                <h2 className="text-xl font-bold">Error Loading Case</h2>
                <p className="text-sm">Unable to load case details</p>
              </div>
            ) : !caseData ? (
              <div className="text-muted-foreground">
                <h2 className="text-xl font-bold">Case Not Found</h2>
                <p className="text-sm">The requested case could not be found</p>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">
                    {caseData.case_title}
                  </CardTitle>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline">{caseData.case_type}</Badge>
                    <Badge variant={caseData.is_urgent ? "destructive" : "secondary"}>
                      {caseData.is_urgent ? "Urgent" : "Not Urgent"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Case ID: {caseData.case_id}</p>
                  <p>Submitted at: {new Date(caseData.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </CardHeader>
          
          {caseData && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm leading-relaxed">{caseData.case_description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Keywords</h3>
                  <p className="text-sm text-muted-foreground">{caseData.case_keywords}</p>
                </div>
  
                {coordinatorData && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Coordinator</h3>
                      <p className="text-sm text-muted-foreground">{coordinatorData.coordinator_name}</p>
                      <p className="text-sm text-muted-foreground">{coordinatorData.coordinator_email}</p>
                      <p className="text-sm text-muted-foreground">{coordinatorData.coordinator_phone}</p>
                    </div>

                  </div>
                )}
                {role === "admin" && caseData.trl_score && (
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Estimated TRL Level</h3>
                    <Badge variant="outline" className="text-lg px-3 py-1 border-primary">
                      Level {caseData.trl_score}
                    </Badge>
                  </div>
                )}

              </div>
            </CardContent>
          )}
        </Card>

        {/* Appointment Data */}
        {!isAppointmentPending && !isAppointmentError && (
          <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold text-primary mb-1">
                  Appointments
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  รายการนัดหมายทั้งหมดที่เกี่ยวข้องกับเคสนี้
                </p>
              </div>

              {/* Add appointment */}
              {role === "admin" && (
                <Button
                  variant="default"
                  size="sm"
                  className="mt-2 mr-2"
                  onClick={() => setShowAddModal(true)}
                >
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Add Appointment
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {Array.isArray(appointmentData) && appointmentData.length > 0 ? (
                <div className="space-y-4">
                  {appointmentData.map((a) => {
                    let badgeClass = "";
                    let badgeLabel = "";

                    switch (a.status) {
                      case "attended":
                        badgeClass = "bg-green-500 text-white";
                        badgeLabel = "เข้าร่วมแล้ว";
                        break;
                      case "absent":
                        badgeClass = "bg-red-500 text-white";
                        badgeLabel = "ไม่เข้าร่วม";
                        break;
                      case "pending":
                      default:
                        badgeClass = "bg-yellow-400 text-black";
                        badgeLabel = "รอดำเนินการ";
                        break;
                    }

                    return (
                      <div
                        key={a.appointment_id}
                        className="border rounded-xl p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                      >
                        {/* Header + Status + Edit */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{a.appointment_id}</h3>
                            <Badge className={badgeClass}>{badgeLabel}</Badge>
                          </div>

                          {role === "admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAppointment(a)}
                              className="flex items-center"
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                        </div>

                        {/* รายละเอียดการนัดหมาย */}
                        <div className="text-sm text-muted-foreground space-y-2">
                          <p>
                            <strong>วันที่นัดหมาย:</strong>{" "}
                            {new Date(a.date).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p>
                            <strong>สถานที่:</strong> {a.location || "-"}
                          </p>
                          {a.summary && (
                            <p>
                              <strong>สรุปการประชุม:</strong> {a.summary}
                            </p>
                          )}
                          {a.note && (
                            <p>
                              <strong>หมายเหตุ:</strong> {a.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-6">
                  ยังไม่มีการนัดหมาย โปรดติดตามการนัดหมายจากเจ้าหน้าที่
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Intellectual Property Data */}
        {!isIPPending && !isIPError && ipData && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary mb-2">
                Intellectual Property
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {(Array.isArray(ipData) ? ipData : [ipData]).map((ip, index) => (
                  <div
                    key={ip.id || index}
                    className="border p-4 rounded-2xl shadow-sm bg-gray-50"
                  >
                    <h3 className="font-semibold text-lg mb-1">
                      {ip.ip_types || "ไม่ระบุประเภทสิทธิ์"}
                    </h3>

                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={
                          ip.ip_protection_status?.toLowerCase().includes("filed") ||
                          ip.ip_protection_status?.toLowerCase().includes("granted")
                            ? "bg-green-500 text-white"
                            : "bg-yellow-400 text-black"
                        }
                      >
                        {ip.ip_protection_status || "สถานะไม่ระบุ"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {ip.ip_request_number || "-"}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      สร้างเมื่อ:{" "}
                      {new Date(ip.created_at).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supporter Data */}
        {!isSupporterPending && !isSupporterError && supporterData && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary mb-2">
                Supporter Information
              </CardTitle>
            </CardHeader>

            <CardContent>
            <div className="space-y-6">
              {/* หน่วยงานสนับสนุนนวัตกรรมที่มีอยู่เดิม */}
              <div>
                <h3 className="font-semibold mb-2">หน่วยงานสนับสนุนนวัตกรรมที่มีอยู่เดิม</h3>
                {(
                  supporterData.support_research ||
                  supporterData.support_vdc ||
                  supporterData.support_sieic
                ) ? (
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {supporterData.support_research && <li>ฝ่ายวิจัย (Research Division)</li>}
                    {supporterData.support_vdc && <li>ศูนย์ขับเคลื่อนคุณค่าการบริการ (VDC)</li>}
                    {supporterData.support_sieic && <li>ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (SiEIC)</li>}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">ไม่มีหน่วยงานสนับสนุนนวัตกรรม</p>
                )}
              </div>

              {/* ความช่วยเหลือที่ต้องการ */}
              <div>
                <h3 className="font-semibold mb-2">ความช่วยเหลือที่ต้องการ</h3>
                {(
                  supporterData.need_protect_intellectual_property ||
                  supporterData.need_co_developers ||
                  supporterData.need_activities ||
                  supporterData.need_test ||
                  supporterData.need_capital ||
                  supporterData.need_partners ||
                  supporterData.need_guidelines ||
                  supporterData.need_certification ||
                  supporterData.need_account
                ) ? (
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {supporterData.need_protect_intellectual_property && <li>การคุ้มครองทรัพย์สินทางปัญญา</li>}
                    {supporterData.need_co_developers && <li>หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม</li>}
                    {supporterData.need_activities && <li>จัดกิจกรรมร่วม เช่น Design Thinking, Prototype Testing</li>}
                    {supporterData.need_test && <li>หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม</li>}
                    {supporterData.need_capital && <li>หาแหล่งทุน</li>}
                    {supporterData.need_partners && <li>หาคู่ค้าทางธุรกิจ</li>}
                    {supporterData.need_guidelines && <li>แนะนำแนวทางการเริ่มธุรกิจ</li>}
                    {supporterData.need_certification && <li>การขอรับรองมาตรฐานหรือคุณภาพ</li>}
                    {supporterData.need_account && <li>บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม</li>}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">ไม่ต้องการความช่วยเหลือ</p>
                )}
              </div>

              {/* ฟิลด์เพิ่มเติม */}
              {supporterData.need && (
                <div>
                  <h3 className="font-semibold mb-2">รายละเอียดเพิ่มเติม</h3>
                  <p className="text-sm text-muted-foreground">{supporterData.need}</p>
                </div>
              )}

              {supporterData.additional_documents && (
                <div>
                  <h3 className="font-semibold mb-2">เอกสารเพิ่มเติม</h3>
                  <p className="text-sm text-muted-foreground">{supporterData.additional_documents}</p>
                </div>
              )}
            </div>
            </CardContent>
          </Card>
        )}

        {/* Appointment Modal */}
        <AddAppointmentModal
          projects={caseData ? [caseData] : []}
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={() => setShowAddModal(false)}
          getFullNameByResearcherID={(e) => e}
        />
        <EditAppointmentModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          projects={caseData ? [{
            ...caseData,
            researcherInfo: researcherData as any
          }] : []}
          appointment={editingAppointment}
          getFullNameByResearcherID={getFullNameByResearcherID}
          onSave={handleSaveEdit}
        />
        </div>
      </div>
    );
  };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}