import { useMutation } from "@tanstack/react-query";
import { ApiQueryClient } from "./client/ApiQueryClient";

export const useUpdateAssessment = (caseId: string) => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  
  return useMutation({
    mutationFn: async () => {
      return apiClient.useUpdateAssessment(caseId, { status: true });
    },
  });
};
