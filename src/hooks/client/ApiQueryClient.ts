import { ApiBaseClient } from "@/hooks/client/ApiBaseClient";
import type {
  AssessmentResponse,
  CaseResponse,
  LoginResponse,
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
}
