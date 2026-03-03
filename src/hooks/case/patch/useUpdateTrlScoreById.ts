import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";

export const useUpdateTrlScoreById = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: ({ caseId, trlData }: {
      caseId: string;
      trlData: { trl_score: number }
    }) => apiClient.updateTrlScoreById(caseId, trlData),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: ["getAllCases"] });
      queryClient.invalidateQueries({ queryKey: ["getCaseById", caseId] });
    },
  });
}