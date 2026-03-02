import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";

export const useUpdateUrgentStatusById = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ caseId, urgentData }: { 
      caseId: string; 
      urgentData: { is_urgent: boolean; urgent_feedback: string } 
    }) => apiClient.updateUrgentStatusById(caseId, urgentData),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: ["getAllCases"] });
      queryClient.invalidateQueries({ queryKey: ["getCaseById", caseId] });
    },
  });
};
