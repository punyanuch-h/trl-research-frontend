import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetAppointmentByCaseId = (caseId: string) => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getAppointmentByCaseId", caseId],
    queryFn: () => apiQueryClient.getAppointmentByCaseId(caseId),
    enabled: !!caseId
  });
};
