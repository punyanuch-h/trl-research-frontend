import { AxiosResponse } from "axios";
import client from "./api-client";


const getToken = (): string | null => {
  return localStorage.getItem("token");
};


export class AppService {
  // ตัวอย่างเมธอดสำหรับเรียก API จริง
  async getData(endpoint: string, params?: any): Promise<AxiosResponse<any>> {
    const token = getToken();
    return client.get(`/${endpoint}`, {
      params,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  }

  // เพิ่มเมธอดอื่นๆ สำหรับ POST, PUT, DELETE ได้ตามต้องการ
  async postData(endpoint: string, data: any): Promise<AxiosResponse<any>> {
    const token = getToken();
    return client.post(`/${endpoint}`, data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  }
}