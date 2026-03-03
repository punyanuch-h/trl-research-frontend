import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";

export const useUpdateImprovementSuggestionById = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ assessmentId, suggestionData }: { 
      assessmentId: string; 
      suggestionData: { improvement_suggestion: string } 
    }) => apiClient.updateImprovementSuggestionById(assessmentId, suggestionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAssessmentByCaseId"] });
      queryClient.invalidateQueries({ queryKey: ["getAllAssessments"] });
    },
  });
};