import { useQuery, type UseQueryOptions }  from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetAllCasesByID = (researcherId: string, options?: UseQueryOptions) => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getCasesById", researcherId],
    queryFn: () => apiQueryClient.useGetAllCasesByID(researcherId),
    enabled: !!researcherId,
    ...options,
  });
};
