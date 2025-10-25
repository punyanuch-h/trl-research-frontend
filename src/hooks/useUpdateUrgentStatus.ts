import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "./client/ApiQueryClient";

export const useUpdateUrgentStatus = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ caseId, urgentData }: { 
      caseId: string; 
      urgentData: { is_urgent: boolean; urgent_feedback: string } 
    }) => {
      return apiClient.useUpdateUrgentStatus(caseId, urgentData);
    },
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["getAllCases"] });
    },
  });
};
