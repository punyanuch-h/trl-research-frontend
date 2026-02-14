import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentResponse, ResearcherResponse } from "@/types/type";

export default function CaseDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const role = getUserRole();
  const { id } = useParams<{ id: string }>();
  const { data: caseData, isPending: isCasePending, isError: isCaseError } = useGetCaseById(id || '');
  const { data: coordinatorData, isPending: isCoordinatorPending, isError: isCoordinatorError } = useGetCoordinatorByCaseId(id || '');
  const { data: appointmentData, isPending: isAppointmentPending, isError: isAppointmentError } = useGetAppointmentByCaseId(id || '');
  const { data: assessmentData, isPending: isAssessmentPending, isError: isAssessmentError } = useGetAssessmentById(id || '');
  const { data: ipData, isPending: isIPPending, isError: isIPError } = useGetIPByCaseId(id || '');
  const { data: supportmentData, isPending: isSupporterPending, isError: isSupporterError } = useGetSupporterByCaseId(id || '');
  const { data: researcherData, isPending: isResearcherPending, isError: isResearcherError } = useGetResearcherById(caseData?.researcher_id || '');

  console.log("CaseDetail Render State:", {
    id,
    caseDataId: caseData?.id,
    researcherId: caseData?.researcher_id,
    isCasePending,
    isResearcherPending,
    hasResearcherData: !!researcherData
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentResponse | null>(null);

  const handleEditAppointment = (appointment: AppointmentResponse) => {
    setEditingAppointment(appointment);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedAppointment: AppointmentResponse) => {
    setEditModalOpen(false);
    setEditingAppointment(null);
  };

  // Function to get researcher full name
  const getFullNameByResearcherID = (researcher_id: string) => {
    if (!researcherData) return researcher_id;
    return `${researcherData.first_name} ${researcherData.last_name}`;
  };

  const ipTypeIds = ["patent", "pettyPatent", "designPatent", "copyright", "trademark", "tradeSecret"] as const;
  // API may return id ("patent") or Thai label ("สิทธิบัตร") - map Thai to id for correct i18n
  const ipTypeThaiToId: Record<string, string> = {
    "สิทธิบัตร": "patent",
    "อนุสิทธิบัตร": "pettyPatent",
    "สิทธิบัตรออกแบบผลิตภัณฑ์": "designPatent",
    "ลิขสิทธิ์": "copyright",
    "เครื่องหมายการค้า": "trademark",
    "ความลับทางการค้า": "tradeSecret",
  };

  const getIPTypeLabel = (type: string | undefined | null) => {
    if (!type) return t("caseDetail.ipTypeUnspecified");
    const id = ipTypeThaiToId[type] ?? type;
    if (ipTypeIds.includes(id as (typeof ipTypeIds)[number])) {
      return t(`assessment.${id}`);
    }
    return type;
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
                {t("form.back")}
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                {t("caseDetail.title")}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {t("caseDetail.researchIdLabel")} {caseData?.id || t("common.loading")}
              </Badge>
              {role === "admin" && (
                <Button onClick={() => navigate(`/assessment/${id}`)} >
                  <Sparkles className="w-4 h-4 mr-1" />
                  {t("assessment.assessResearch")}
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
          {isCasePending ? (
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardContent>
          ) : isCaseError ? (
            <CardHeader>
              <div className="text-destructive">
                <h2 className="text-xl font-bold">{t("caseDetail.loadErrorTitle")}</h2>
                <p className="text-sm">{t("caseDetail.loadErrorDesc")}</p>
              </div>
            </CardHeader>
          ) : !caseData ? (
            <CardHeader>
              <div className="text-muted-foreground">
                <h2 className="text-xl font-bold">{t("caseDetail.noDataTitle")}</h2>
                <p className="text-sm">{t("caseDetail.noDataDesc")}</p>
              </div>
            </CardHeader>
          ) : (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2">
                      {caseData.title}
                    </CardTitle>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline">{caseData.type}</Badge>
                      <Badge variant={caseData.is_urgent ? "destructive" : "secondary"}>
                        {caseData.is_urgent ? t("home.urgent") : t("home.notUrgent")}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{t("caseDetail.researchIdLabel")} {caseData.id}</p>
                    <p>{t("admin.createdAt")}: {new Date(caseData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{t("form.descriptionLabel")}</h3>
                    <p className="text-sm leading-relaxed">{caseData.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">{t("form.keywordsLabel")}</h3>
                    <p className="text-sm text-muted-foreground">{caseData.keywords}</p>
                  </div>

                  {isResearcherPending ? (
                    <div className="space-y-2 py-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ) : isResearcherError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <h3 className="font-semibold">{t("caseDetail.researcherLoadError")}</h3>
                    <p className="text-sm">{t("caseDetail.refreshOrContact")}</p>
                  </div>
                  ) : researcherData ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">{t("caseDetail.researcherInfo")}</h3>
                        <p className="text-sm text-muted-foreground">{researcherData.first_name} {researcherData.last_name}</p>
                        <p className="text-sm text-muted-foreground">{researcherData.email}</p>
                        <p className="text-sm text-muted-foreground">{researcherData.phone_number}</p>
                      </div>
                    </div>
                  ) : null}

                  {isCoordinatorPending ? (
                    <div className="space-y-2 py-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ) : isCoordinatorError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <h3 className="font-semibold">{t("caseDetail.coordinatorLoadError")}</h3>
                    <p className="text-sm">{t("caseDetail.refreshOrContact")}</p>
                  </div>
                  ) : coordinatorData ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">{t("caseDetail.coordinatorInfo")}</h3>
                        <p className="text-sm text-muted-foreground">{coordinatorData.first_name} {coordinatorData.last_name}</p>
                        <p className="text-sm text-muted-foreground">{coordinatorData.email}</p>
                        <p className="text-sm text-muted-foreground">{coordinatorData.phone_number}</p>
                      </div>
                    </div>
                  ) : null}

                  {isAssessmentPending ? (
                    <div className="flex items-center gap-2 py-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ) : (
                    <>
                      {role === "admin" && assessmentData?.trl_estimate !== undefined && assessmentData?.trl_estimate !== null && (
                        <>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{t("admin.estimatedLevel")}</h3>
                            <Badge variant="outline" className="text-lg px-3 py-1 border-primary">
                              TRL {assessmentData.trl_estimate}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{t("admin.readinessLevel")}</h3>
                            <Badge variant="outline" className="text-lg px-3 py-1 border-primary">
                              TRL {caseData.trl_score ?? assessmentData.trl_estimate}
                            </Badge>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {role === "researcher" && caseData.status === true && caseData.trl_score !== null && (
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{t("admin.readinessLevel")}</h3>
                      <Badge variant="outline" className="text-lg px-3 py-1 border-primary">
                        TRL {caseData.trl_score}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Appointment Data */}
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl font-bold text-primary mb-1">
                {t("caseDetail.appointmentListTitle")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("caseDetail.appointmentListDesc")}
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
                {t("form.addAppointmentTitle")}
              </Button>
            )}
          </CardHeader>

          <CardContent>
            {isAppointmentPending ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            ) : isAppointmentError ? (
              <div className="text-center text-sm text-destructive py-6">
                {t("caseDetail.appointmentLoadError")}
              </div>
            ) : Array.isArray(appointmentData) && appointmentData.length > 0 ? (
              <div className="space-y-4">
                {appointmentData.map((a) => {
                  let badgeClass = "";
                  let badgeLabel = "";

                  switch (a.status) {
                    case "attended":
                      badgeClass = "bg-green-500 text-white";
                      badgeLabel = t("form.statusAttended");
                      break;
                    case "absent":
                      badgeClass = "bg-red-500 text-white";
                      badgeLabel = t("caseDetail.absentShort");
                      break;
                    case "pending":
                    default:
                      badgeClass = "bg-yellow-400 text-black";
                      badgeLabel = t("form.statusPending");
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
                            {t("profile.edit")}
                          </Button>
                        )}
                      </div>

                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                          <strong>{t("form.appointmentDate")}:</strong>{" "}
                          {new Date(a.date).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p>
                          <strong>{t("form.location")}:</strong> {a.location || "-"}
                        </p>
                        {a.summary && (
                          <p>
                            <strong>{t("form.meetingSummary")}:</strong> {a.summary}
                          </p>
                        )}
                        {a.note && (
                          <p>
                            <strong>{t("caseDetail.noteLabel")}</strong> {a.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-6">
                {t("caseDetail.noAppointments")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Intellectual Property Data */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-2">
              {t("caseDetail.ipDataTitle")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isIPPending ? (
              <div className="space-y-6">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            ) : isIPError ? (
              <div className="text-center text-sm text-destructive py-6">
                {t("caseDetail.ipLoadError")}
              </div>
            ) : Array.isArray(ipData) && ipData.length > 0 ? (
              <div className="space-y-6">
                {ipData.map((ip, index) => (
                  <div
                    key={ip.id || index}
                    className="border p-4 rounded-2xl shadow-sm bg-gray-50"
                  >
                    <h3 className="font-semibold text-lg mb-1">
                      {getIPTypeLabel(ip.types)}
                    </h3>

                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={
                          ip.protection_status?.toLowerCase().includes("filed") ||
                            ip.protection_status?.toLowerCase().includes("granted")
                            ? "bg-green-500 text-white"
                            : "bg-yellow-400 text-black"
                        }
                      >
                        {ip.protection_status || t("caseDetail.statusUnspecified")}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {ip.request_number || "-"}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {t("caseDetail.createdAtLabel")}{" "}
                      {new Date(ip.created_at).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-6">
                {t("caseDetail.noIpData")}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-2">
              {t("caseDetail.supportDataTitle")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isSupporterPending ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ) : isSupporterError ? (
              <div className="text-center text-sm text-destructive py-6">
                {t("caseDetail.supporterLoadError")}
              </div>
            ) : supportmentData ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t("form.innovationSupportLabel")}</h3>
                  {(
                    supportmentData.support_research ||
                    supportmentData.support_vdc ||
                    supportmentData.support_sieic
                  ) ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {supportmentData.support_research && <li>{t("form.innovationSupport1")}</li>}
                      {supportmentData.support_vdc && <li>{t("form.innovationSupport2")}</li>}
                      {supportmentData.support_sieic && <li>{t("form.innovationSupport3")}</li>}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("caseDetail.noAgencySupport")}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t("form.assistanceNeededLabel")}</h3>
                  {(
                    supportmentData.need_protect_intellectual_property ||
                    supportmentData.need_co_developers ||
                    supportmentData.need_activities ||
                    supportmentData.need_test ||
                    supportmentData.need_capital ||
                    supportmentData.need_partners ||
                    supportmentData.need_guidelines ||
                    supportmentData.need_certification ||
                    supportmentData.need_account
                  ) ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {supportmentData.need_protect_intellectual_property && <li>{t("form.assistance1")}</li>}
                      {supportmentData.need_co_developers && <li>{t("form.assistance2")}</li>}
                      {supportmentData.need_activities && <li>{t("form.assistance3")}</li>}
                      {supportmentData.need_test && <li>{t("form.assistance4")}</li>}
                      {supportmentData.need_capital && <li>{t("form.assistance5")}</li>}
                      {supportmentData.need_partners && <li>{t("form.assistance6")}</li>}
                      {supportmentData.need_guidelines && <li>{t("form.assistance7")}</li>}
                      {supportmentData.need_certification && <li>{t("form.assistance8")}</li>}
                      {supportmentData.need_account && <li>{t("form.assistance9")}</li>}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("caseDetail.noAssistanceNeeded")}</p>
                  )}
                </div>

                {supportmentData.need && (
                  <div>
                    <h3 className="font-semibold mb-2">{t("caseDetail.additionalDetails")}</h3>
                    <p className="text-sm text-muted-foreground">{supportmentData.need}</p>
                  </div>
                )}

                {supportmentData.additional_documents && (
                  <div>
                    <h3 className="font-semibold mb-2">{t("form.additionalDocs")}</h3>
                    <p className="text-sm text-muted-foreground">{supportmentData.additional_documents}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-6">
                {t("caseDetail.noSupportData")}
              </div>
            )}
          </CardContent>
        </Card>

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
            researcherInfo: researcherData ?? undefined
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