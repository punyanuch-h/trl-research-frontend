import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";

export const useUpdateTrlLevelResult = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: async ({ assessmentId, trlData }: {
      assessmentId: string;
      trlData: { trl_level_result: number }
    }) => {
      return apiClient.useUpdateTrlLevelResultByID(assessmentId, trlData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assessment", variables.assessmentId] });
    },
  });
}