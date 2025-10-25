import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetResearcherById = (researcherId: string) => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getResearcherById", researcherId],
    queryFn: async () => {
      return apiQueryClient.useGetResearcherById(researcherId);
    }
  });
};
