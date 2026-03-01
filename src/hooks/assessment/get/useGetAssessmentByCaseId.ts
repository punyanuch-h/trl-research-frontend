import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetAssessmentByCaseId = (caseId: string) => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getAssessmentByCaseId", caseId],
    queryFn: () => apiQueryClient.getAssessmentByCaseId(caseId),
    enabled: !!caseId
  });
};
