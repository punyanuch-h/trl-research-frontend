import { ApiBaseClient } from "@/hooks/client/ApiBaseClient";
import type {
  AppointmentResponse,
  AssessmentResponse,
  CaseResponse,
  CoordinatorResponse,
  IntellectualPropertyResponse,
  LoginResponse,
  SupporterResponse,
} from "@/hooks/client/type";

export class ApiQueryClient extends ApiBaseClient {
  // Authentication
  async useLogin(email: string, password: string): Promise<LoginResponse> {
    const response = await this.axiosInstance.post<LoginResponse>(`/auth/login`, {
      email,
      password,
    });

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
}
