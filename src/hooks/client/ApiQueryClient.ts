import { ApiBaseClient } from "@/hooks/client/ApiBaseClient";
import type {
  AppointmentResponse,
  AssessmentResponse,
  CaseResponse,
  CoordinatorResponse,
  IntellectualPropertyResponse,
  LoginResponse,
  SupporterResponse,
  ResearcherResponse,
  UserProfileResponse,
} from "@/hooks/client/type";
import { getUserRole } from "@/lib/auth";

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

  async useGetCaseById(caseId: string): Promise<CaseResponse> {
    const response = await this.axiosInstance.get<CaseResponse>(`/trl/case/${caseId}`);
    return response.data;
  }

  async useGetAssessmentById(caseId: string): Promise<AssessmentResponse> {
    const response = await this.axiosInstance.get<AssessmentResponse>(`/trl/assessment_trl/case/${caseId}`);
    return response.data;
  }

  async useUpdateAssessment(caseId: string, statusData: { status: boolean }){
    const response = await this.axiosInstance.patch(`/trl/case/${caseId}`, statusData);
    return response.data;
  }

  async useUpdateUrgentStatus(caseId: string, urgentData: { is_urgent: boolean; urgent_feedback: string }){
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

  async useGetIPByCaseId(caseId: string): Promise<IntellectualPropertyResponse> {
    const response = await this.axiosInstance.get<IntellectualPropertyResponse>(`/trl/ip/case/${caseId}`);
    return response.data;
  }

  async useGetAllSupporters(): Promise<SupporterResponse[]> {
    const response = await this.axiosInstance.get<SupporterResponse[]>(`/trl/supporters`);
    return response.data;
  }

  async useGetSupporterById(supporterId: string): Promise<SupporterResponse> {
    const response = await this.axiosInstance.get<SupporterResponse>(`/trl/supporter/${supporterId}`);
    return response.data;
  }

  async useGetSupporterByCaseId(caseId: string): Promise<SupporterResponse> {
    const response = await this.axiosInstance.get<SupporterResponse>(`/trl/supporter/case/${caseId}`);
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
  async useSubmitResearcherForm(formData: any): Promise<any> {    
    // 1. Create Case
    const casePayload = {
      researcher_id: formData.id ?? "",
      coordinator_email: formData.coordinatorEmail,
      trl_score: formData.trlScore ?? "",
      is_urgent: formData.isUrgent ?? false,
      urgent_reason: formData.urgentReason ?? "",
      urgent_feedback: formData.urgentFeedback ?? "",
      case_title: formData.researchTitle,
      case_type: formData.researchType,
      case_description: formData.description,
      case_keywords: formData.keywords,
      status: formData.status ?? false,
    };
    
    const caseResponse = await this.axiosInstance.post(`/trl/case`, casePayload);
    const caseId = caseResponse.data.case_id;

    // 2. Create Coordinator
    const coordinatorPayload = {
      case_id: caseId,
      coordinator_email: formData.coordinatorEmail,
      coordinator_name: `${formData.coordinatorFirstName} ${formData.coordinatorLastName}`,
      coordinator_phone: formData.coordinatorPhoneNumber,
    };
    const coordinatorResponse = await this.axiosInstance.post(`/trl/coordinator`, coordinatorPayload);
    // 3. Create Assessment
    const assessmentPayload = {
      case_id: caseId,
      trl_level_result: formData.trlLevelResult,
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
    };

    const assessmentResponse = await this.axiosInstance.post(`/trl/assessment_trl`, assessmentPayload);

    // 4. Create IP records (if applicable)
    if (formData.ipHas && Array.isArray(formData.ipForms) && formData.ipForms.length > 0) {
      for (let i = 0; i < formData.ipForms.length; i++) {
        const ipForm = formData.ipForms[i];        
        if (ipForm.noIp) {
          continue;
        }

        const ipPayload = {
          case_id: caseId,
          ip_types: ipForm.ipTypes[0] || "",
          ip_protection_status: ipForm.ipStatus || "",
          ip_request_number: ipForm.requestNumbers?.[ipForm.ipTypes[0]] || "",
        };
        
        await this.axiosInstance.post(`/trl/ip`, ipPayload);
      }
    }

    // 5. Create Supporter
    const supporterPayload = {
      case_id: caseId,
      support_research: (formData.supportDevNeeded || []).includes("ฝ่ายวิจัย"),
      support_vdc: (formData.supportDevNeeded || []).includes("ศูนย์ขับเคลื่อนคุณค่าการบริการ (Center for Value Driven Care: VDC)"),
      support_sieic: (formData.supportDevNeeded || []).includes("ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (Siriraj Excellent Innovation Center: SiEIC)"),
      need_protect_intellectual_property: (formData.supportMarketNeeded || []).includes("การคุ้มครองทรัพย์สินทางปัญญา"),
      need_co_developers: (formData.supportMarketNeeded || []).includes("หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม"),
      need_activities: (formData.supportMarketNeeded || []).includes("การจัดกิจกรรมร่วมกับผู้ร่วมพัฒนานวัตกรรม"),
      need_test: (formData.supportMarketNeeded || []).includes("หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม"),
      need_capital: (formData.supportMarketNeeded || []).includes("หาแหล่งทุน"),
      need_partners: (formData.supportMarketNeeded || []).includes("หาคู่ค้าทางธุรกิจ"),
      need_guidelines: (formData.supportMarketNeeded || []).includes("แนะนำแนวทางการเริ่มธุรกิจ"),
      need_certification: (formData.supportMarketNeeded || []).includes("การขอรับรองมาตรฐานหรือคุณภาพ"),
      need_account: (formData.supportMarketNeeded || []).includes("บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม"),
      need: formData.otherSupportMarket || "",
      additional_documents: "", // if you want to upload file, use multipart/form-data
    };

    const supporterResponse = await this.axiosInstance.post(`/trl/supporter`, supporterPayload);

    return {
      caseId,
      coordinatorId: coordinatorResponse.data.coordinator_id,
      assessmentId: assessmentResponse.data.assessment_id,
      supporterId: supporterResponse.data.supporter_id,
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
}
