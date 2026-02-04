import axios, { type AxiosInstance, type AxiosStatic } from "axios";

const { create }: AxiosStatic = axios;

export class ApiBaseClient {
  readonly axiosInstance: AxiosInstance;

  constructor(
    baseURL: string,
    headers?: NonNullable<Parameters<typeof create>[0]>["headers"]
  ) {
    this.axiosInstance = create({
      baseURL,
      headers,
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 498) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }
}
