import { useMutation } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";

export const useUpdateStatusById = (caseId: string) => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  
  return useMutation({
    mutationFn: async () => {
      return apiClient.updateStatusById(caseId, { status: true });
    },
  });
};
