import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";

export const useUpdateTrlEstimateById = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: ({ assessmentId, trlData }: {
      assessmentId: string;
      trlData: { trl_estimate: number }
    }) => apiClient.updateTrlEstimateById(assessmentId, trlData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assessment", variables.assessmentId] });
    },
  });
}