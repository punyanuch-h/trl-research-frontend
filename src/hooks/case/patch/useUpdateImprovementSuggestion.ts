import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";

export const useUpdateImprovementSuggestion = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ assessmentId, suggestionData }: { 
      assessmentId: string; 
      suggestionData: { improvement_suggestion: string } 
    }) => {
      return apiClient.useUpdateImprovementSuggestionByID(assessmentId, suggestionData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assessment", variables.assessmentId] });
    },
  });
};