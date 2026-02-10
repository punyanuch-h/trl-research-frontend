import { ApiBaseClient } from "@/hooks/client/ApiBaseClient";
import {
  AppointmentResponse,
  AssessmentResponse,
  CaseResponse,
  CoordinatorResponse,
  IntellectualPropertyResponse,
  LoginResponse,
  SupportmentResponse,
  ResearcherResponse,
  UserProfileResponse,
  PostResearcherData,
  PostAdminData,
  AddAppointmentData,
  NotificationListResponse,
} from "@/types/type";
import { getUserRole } from "@/lib/auth";
import { SubmitResearcherFormRequest, SubmitResearcherFormResponse } from "@/types/request";
import { checkboxQuestionList } from "@/data/checkboxQuestionList";

export class ApiQueryClient extends ApiBaseClient {
  // Authentication
  async useLogin(email: string, password: string): Promise<LoginResponse> {
    const response = await this.axiosInstance.post<LoginResponse>(`/auth/login`, {
      email,
      password,
    });

    return response.data;
  }

  async useGetAllResearcher(): Promise<ResearcherResponse[]> {
    const response = await this.axiosInstance.get<ResearcherResponse[]>(`/trl/researchers`);
    return response.data;
  }

  async useGetResearcherById(researcherId: string): Promise<ResearcherResponse> {
    const response = await this.axiosInstance.get<ResearcherResponse>(`/trl/researcher/${researcherId}`);
    return response.data;
  }

  async useGetAllCasesByID(researcherId: string): Promise<CaseResponse> {
    const response = await this.axiosInstance.get<CaseResponse>(`/trl/case/researcher/${researcherId}`);
    return response.data;
  }

  async useGetCaseById(caseId: string): Promise<CaseResponse> {
    const response = await this.axiosInstance.get<CaseResponse>(`/trl/case/${caseId}`);
    return response.data;
  }

  async useGetAllAssessments(): Promise<AssessmentResponse[]> {
    const response = await this.axiosInstance.get<AssessmentResponse[]>(`/trl/assessments`);
    return response.data;
  }

  async useGetAssessmentById(caseId: string): Promise<AssessmentResponse> {
    const response = await this.axiosInstance.get<AssessmentResponse>(`/trl/assessment/case/${caseId}`);
    return response.data;
  }

  async useUpdateImprovementSuggestionByID(assessmentId: string, improvementSuggestionData: { improvement_suggestion: string }): Promise<AssessmentResponse> {
    const response = await this.axiosInstance.patch<AssessmentResponse>(`/trl/assessment/${assessmentId}`, improvementSuggestionData);
    return response.data;
  }

  async useUpdateTrlEstimateByID(assessmentId: string, trlEstimateData: { trl_estimate: number }): Promise<AssessmentResponse> {
    const response = await this.axiosInstance.patch<AssessmentResponse>(`/trl/assessment/${assessmentId}`, trlEstimateData);
    return response.data;
  }

  async useUpdateAssessment(caseId: string, statusData: { status: boolean }) {
    const response = await this.axiosInstance.patch(`/trl/case/${caseId}`, statusData);
    return response.data;
  }

  async useUpdateTrlScore(caseId: string, trlData: { trl_score: number }) {
    const response = await this.axiosInstance.patch(`/trl/case/${caseId}`, trlData);
    return response.data;
  }

  async useUpdateUrgentStatus(caseId: string, urgentData: { is_urgent: boolean; urgent_feedback: string }) {
    const response = await this.axiosInstance.patch(`/trl/case/${caseId}`, urgentData);
    return response.data;
  }

  async useGetAllCases(): Promise<CaseResponse[]> {
    const response = await this.axiosInstance.get<CaseResponse[]>(`/trl/cases`);
    return response.data;
  }

  async useGetAllAppointments(): Promise<AppointmentResponse[]> {
    const response = await this.axiosInstance.get<AppointmentResponse[]>(`/trl/appointments`);
    return response.data;
  }

  async useGetAppointmentById(appointmentId: string): Promise<AppointmentResponse> {
    const response = await this.axiosInstance.get<AppointmentResponse>(`/trl/appointment/${appointmentId}`);
    return response.data;
  }

  async useGetAppointmentByCaseId(caseId: string): Promise<AppointmentResponse> {
    const response = await this.axiosInstance.get<AppointmentResponse>(`/trl/appointment/case/${caseId}`);
    return response.data;
  }

  async useGetIPAll(): Promise<IntellectualPropertyResponse[]> {
    const response = await this.axiosInstance.get<IntellectualPropertyResponse[]>(`/trl/ips`);
    return response.data;
  }

  async useGetIPById(ipId: string): Promise<IntellectualPropertyResponse> {
    const response = await this.axiosInstance.get<IntellectualPropertyResponse>(`/trl/ip/${ipId}`);
    return response.data;
  }

  async useGetIPByCaseId(caseId: string): Promise<IntellectualPropertyResponse[]> {
    const response = await this.axiosInstance.get<IntellectualPropertyResponse[]>(`/trl/ip/case/${caseId}`);
    return response.data;
  }

  async useGetAllSupporters(): Promise<SupportmentResponse[]> {
    const response = await this.axiosInstance.get<SupportmentResponse[]>(`/trl/supportments`);
    return response.data;
  }

  async useGetSupporterById(supportmentId: string): Promise<SupportmentResponse> {
    const response = await this.axiosInstance.get<SupportmentResponse>(`/trl/supportment/${supportmentId}`);
    return response.data;
  }

  async useGetSupporterByCaseId(caseId: string): Promise<SupportmentResponse> {
    const response = await this.axiosInstance.get<SupportmentResponse>(`/trl/supportment/case/${caseId}`);
    return response.data;
  }

  async useGetAllCoordinators(): Promise<CoordinatorResponse[]> {
    const response = await this.axiosInstance.get<CoordinatorResponse[]>(`/trl/coordinators`);
    return response.data;
  }

  async useGetCoordinatorById(coordinatorId: string): Promise<CoordinatorResponse> {
    const response = await this.axiosInstance.get<CoordinatorResponse>(`/trl/coordinator/${coordinatorId}`);
    return response.data;
  }

  async useGetCoordinatorByCaseId(caseId: string): Promise<CoordinatorResponse> {
    const response = await this.axiosInstance.get<CoordinatorResponse>(`/trl/coordinator/case/${caseId}`);
    return response.data;
  }

  // Submit researcher form
  async useSubmitResearcherForm(
    formData: SubmitResearcherFormRequest
  ): Promise<SubmitResearcherFormResponse> {
    const getStringArray = (value: unknown): string[] => {
      if (Array.isArray(value)) return value as string[];
      return [];
    };

    // 1. Create Coordinator
    const coordinatorPayload = {
      prefix: formData.coordinatorPrefix,
      academic_position: formData.coordinatorAcademicPosition === "other" ? formData.coordinatorAcademicPositionOther : formData.coordinatorAcademicPosition,
      department: formData.coordinatorDepartment,
      email: formData.coordinatorEmail,
      first_name: formData.coordinatorFirstName,
      last_name: formData.coordinatorLastName,
      phone_number: formData.coordinatorPhoneNumber,
    };
    const coordinatorResponse = await this.axiosInstance.post(`/trl/coordinator`, coordinatorPayload);
    // Handle Case File Uploads via Signed URL
    const casesAttachments: string[] = [];
    const researchFiles = formData.researchDetailsFiles as File[] | undefined;

    if (researchFiles && researchFiles.length > 0) {
      for (const file of researchFiles) {
        console.log(`📎 Uploading research file: ${file.name}`);
        try {
          const { upload_url, object_path } = await this.presignUpload(file);
          await this.uploadToSignedUrl(upload_url, file);
          casesAttachments.push(object_path);
          console.log(`✅ Uploaded research file: ${file.name}`);
        } catch (error) {
          console.error(`❌ Failed to upload research file ${file.name}:`, error);
          throw error;
        }
      }
    }

    // Create Case
    const casePayload: Record<string, unknown> = {
      researcher_id: formData.id ?? "",
      coordinator_id: coordinatorResponse.data.id,
      trl_score: formData.trlScore ?? null,
      is_urgent: formData.isUrgent ?? false,
      urgent_reason: formData.urgentReason ?? "",
      urgent_feedback: formData.urgentFeedback ?? "",
      title: formData.researchTitle,
      type: formData.researchType,
      description: formData.description,
      keywords: formData.keywords,
      status: formData.status ?? false,
    };

    if (casesAttachments.length > 0) {
      casePayload.cases_attachments = casesAttachments;
    }

    // Create Case (Always JSON)
    const caseResponse = await this.axiosInstance.post(`/trl/case`, casePayload);
    const caseId = caseResponse.data.id;


    // Create Assessment
    const uploadOrBlank = async (file: unknown): Promise<string> => {
      if (file instanceof File) {
        try {
          const { upload_url, object_path } = await this.presignUpload(file);
          await this.uploadToSignedUrl(upload_url, file);
          return object_path;
        } catch (error) {
          console.error(`❌ Upload failed:`, error);
          throw error;
        }
      }
      return "";
    };

    const assessmentAttachmentsRecord: Record<string, string[]> = {};

    const rqKeys = ['rq1', 'rq2', 'rq3', 'rq4', 'rq5', 'rq6', 'rq7'];
    for (const key of rqKeys) {
      const file = formData.assessmentFiles[key];
      const path = await uploadOrBlank(file);
      assessmentAttachmentsRecord[`${key}_attachments`] = path === "" ? [] : [path];
    }

    const cqLevelKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (const level of cqLevelKeys) {
      const fieldName = `cq${level}_attachments`;
      const questionsInLevel = checkboxQuestionList[level - 1] || [];

      const uploadPromises = questionsInLevel.map((_, i) => {
        const fileKey = `cq${level}-${i + 1}`;
        const file = formData.assessmentFiles[fileKey];
        return uploadOrBlank(file);
      });

      const results = await Promise.all(uploadPromises);

      const hasAnyFile = results.some(path => path !== "");

      if (hasAnyFile) {
        assessmentAttachmentsRecord[fieldName] = results;
      } else {
        assessmentAttachmentsRecord[fieldName] = [];
      }
    }

    const assessmentPayload: Record<string, unknown> = {
      case_id: caseId,
      trl_estimate: formData.trlLevelResult,
      rq1_answer: formData.rq1_answer,
      rq2_answer: formData.rq2_answer,
      rq3_answer: formData.rq3_answer,
      rq4_answer: formData.rq4_answer,
      rq5_answer: formData.rq5_answer,
      rq6_answer: formData.rq6_answer,
      rq7_answer: formData.rq7_answer,
      cq1_answer: formData.cq1_answer || [],
      cq2_answer: formData.cq2_answer || [],
      cq3_answer: formData.cq3_answer || [],
      cq4_answer: formData.cq4_answer || [],
      cq5_answer: formData.cq5_answer || [],
      cq6_answer: formData.cq6_answer || [],
      cq7_answer: formData.cq7_answer || [],
      cq8_answer: formData.cq8_answer || [],
      cq9_answer: formData.cq9_answer || [],
      ...assessmentAttachmentsRecord,
      improvement_suggestion: "",
    };

    const assessmentResponse = await this.axiosInstance.post(`/trl/assessment`, assessmentPayload);

    // 4. Create IP records (if applicable)
    if (formData.ipHas && Array.isArray(formData.ipForms) && formData.ipForms.length > 0) {
      for (let i = 0; i < formData.ipForms.length; i++) {
        const ipForm = formData.ipForms[i];
        if (ipForm.noIp) {
          continue;
        }

        const ipAttachments: string[] = [];
        if (ipForm.file) {
          try {
            console.log(`📎 Uploading IP file: ${ipForm.file.name}`);
            const { upload_url, object_path } = await this.presignUpload(ipForm.file);
            await this.uploadToSignedUrl(upload_url, ipForm.file);
            ipAttachments.push(object_path);
            console.log(`✅ Uploaded IP file: ${ipForm.file.name}`);
          } catch (error) {
            console.error(`❌ Failed to upload IP file:`, error);
            throw error;
          }
        }

        const ipPayload: Record<string, unknown> = {
          case_id: caseId,
          types: ipForm.ipTypes?.[0] || "",
          protection_status: ipForm.ipStatus || "",
          request_number: ipForm.requestNumbers?.[ipForm.ipTypes?.[0]] || "",
        };

        if (ipAttachments.length > 0) {
          ipPayload.ips_attachments = ipAttachments;
        }

        await this.axiosInstance.post(`/trl/ip`, ipPayload);
      }
    }

    // 5. Create Supportment
    const supportmentPayload: Record<string, unknown> = {
      case_id: caseId,
      support_research: getStringArray(formData.supportDevNeeded).includes("ฝ่ายวิจัย"),
      support_vdc: getStringArray(formData.supportDevNeeded).includes("ศูนย์ขับเคลื่อนคุณค่าการบริการ (Center for Value Driven Care: VDC)"),
      support_sieic: getStringArray(formData.supportDevNeeded).includes("ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (Siriraj Excellent Innovation Center: SiEIC)"),
      need_protect_intellectual_property: getStringArray(formData.supportMarketNeeded).includes("การคุ้มครองทรัพย์สินทางปัญญา"),
      need_co_developers: getStringArray(formData.supportMarketNeeded).includes("หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม"),
      need_activities: getStringArray(formData.supportMarketNeeded).includes("การจัดกิจกรรมร่วมกับผู้ร่วมพัฒนานวัตกรรม"),
      need_test: getStringArray(formData.supportMarketNeeded).includes("หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม"),
      need_capital: getStringArray(formData.supportMarketNeeded).includes("หาแหล่งทุน"),
      need_partners: getStringArray(formData.supportMarketNeeded).includes("หาคู่ค้าทางธุรกิจ"),
      need_guidelines: getStringArray(formData.supportMarketNeeded).includes("แนะนำแนวทางการเริ่มธุรกิจ"),
      need_certification: getStringArray(formData.supportMarketNeeded).includes("การขอรับรองมาตรฐานหรือคุณภาพ"),
      need_account: getStringArray(formData.supportMarketNeeded).includes("บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม"),
      need: formData.otherSupportMarket || "",
    };

    const supportmentResponse = await this.axiosInstance.post(`/trl/supportment`, supportmentPayload);

    return {
      case: caseResponse.data,
      coordinator: coordinatorResponse.data,
      assessment: assessmentResponse.data,
      supportment: supportmentResponse.data,
    };
  }

  async useGetUserProfile(): Promise<UserProfileResponse> {
    if (getUserRole() === "admin") {
      const response = await this.axiosInstance.get<UserProfileResponse>(`/trl/admin/profile`);
      return response.data;
    } else {
      const response = await this.axiosInstance.get<UserProfileResponse>(`/trl/researcher/profile`);
      return response.data;
    }
  }

  async useUpdateUserProfile(userProfile: UserProfileResponse): Promise<UserProfileResponse> {
    if (getUserRole() === "admin") {
      const response = await this.axiosInstance.patch<UserProfileResponse>(`/trl/admin/${userProfile.id}`, userProfile);
      return response.data;
    } else {
      const response = await this.axiosInstance.patch<UserProfileResponse>(`/trl/researcher/${userProfile.id}`, userProfile);
      return response.data;
    }
  }

  async presignUpload(file: File) {
    const response = await this.axiosInstance.post("/trl/presign/upload", {
      file_name: file.name,
      content_type: file.type,
    });
    return response.data;
  }

  async uploadToSignedUrl(uploadUrl: string, file: File | Blob) {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Upload failed with status: ${response.status}, Body: ${errorDetails}`
      );
    }
  }

  async useNotifyUploaded(payload: {
    case_id: string;
    cases_attachments: string[];
  }) {
    const response = await this.axiosInstance.post("/trl/files/uploaded", {
      case_id: payload.case_id,
      cases_attachments: payload.cases_attachments,
    });
    return response.data;
  }

  async useGetDownloadUrl(path: string): Promise<{ download_url: string }> {
    const response = await this.axiosInstance.get(`/trl/file/download`, {
      params: { path },
    });
    return response.data; // { download_url: "..." }
  }

  async useGetFilesByCase(caseId: string) {
    const response = await this.axiosInstance.get(`/trl/files?case_id=${caseId}`);
    return response.data;
  }

  async getAllIPs(): Promise<IntellectualPropertyResponse[]> {
    const response = await this.axiosInstance.get<IntellectualPropertyResponse[]>(`/trl/ips`);
    return response.data;
  }

  async getAllSupportments(): Promise<SupportmentResponse[]> {
    const response = await this.axiosInstance.get<SupportmentResponse[]>(`/trl/supportments`);
    return response.data;
  }

  async useResetPassword(data: { old_password: string; new_password: string }) {
    const response = await this.axiosInstance.post(`/trl/auth/reset-password`, data);
    return response.data;
  }

  async useForgetPassword(email: string) {
    const response = await this.axiosInstance.post(`/auth/forget-password`, { email });
    return response.data;
  }

  async usePostResearcher(data: PostResearcherData) {
    const response = await this.axiosInstance.post(`/researcher`, data);
    return response.data;
  }

  async useAddAppointment(data: AddAppointmentData) {
    const response = await this.axiosInstance.post(`/trl/appointment`, data);
    return response.data;
  }

  async useEditAppointment(id: string, data: Partial<AddAppointmentData>) {
    const response = await this.axiosInstance.patch(`/trl/appointment/${id}`, data);
    return response.data;
  }

  async usePostAdmin(data: PostAdminData) {
    const response = await this.axiosInstance.post(`/trl/admin`, data);
    return response.data;
  }

  async useGetNotificationAppointments(): Promise<NotificationListResponse> {
    const response = await this.axiosInstance.get<NotificationListResponse>(`/trl/notifications/appointments`);
    return response.data;
  }

  async useMarkAppointmentAsRead(id: string): Promise<void> {
    await this.axiosInstance.patch(`/trl/notifications/appointments/${id}/read`);
  }

  async useMarkAllAppointmentsAsRead(): Promise<void> {
    await this.axiosInstance.patch(`/trl/notifications/appointments/read-all`);
  }

  async useGeneratePDF(html: string): Promise<Blob> {
    const response = await this.axiosInstance.post(`/trl/generate-pdf`, { html }, {
      responseType: 'blob'
    });
    return response.data;
  }
}
