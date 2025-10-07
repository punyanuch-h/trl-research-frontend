import { ApiBaseClient } from "@/hooks/client/ApiBaseClient";
import type {
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
  
}
