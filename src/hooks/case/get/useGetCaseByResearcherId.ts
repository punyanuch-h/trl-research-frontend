import { useQuery, type UseQueryOptions }  from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetCaseByResearcherId = (researcherId: string, options?: UseQueryOptions) => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getCaseByResearcherId", researcherId],
    queryFn: () => apiQueryClient.getCaseByResearcherId(researcherId),
    enabled: !!researcherId,
    ...options,
  });
};
