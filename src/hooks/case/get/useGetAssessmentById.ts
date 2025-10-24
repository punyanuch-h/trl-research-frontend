import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetAssessmentById = (caseId: string) => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getAssessmentById", caseId],
    queryFn: async () => {
      return apiQueryClient.useGetAssessmentById(caseId);
    }
  });
};
