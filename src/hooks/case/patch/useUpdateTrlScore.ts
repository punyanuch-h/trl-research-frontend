import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";

export const useUpdateTrlScore = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: async ({ caseId, trlData }: {
      caseId: string;
      trlData: { trl_score: string }
    }) => {
      return apiClient.useUpdateTrlScore(caseId, trlData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case", variables.caseId] });
    },
  });
}