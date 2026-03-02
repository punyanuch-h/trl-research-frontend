import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";

export const useUpdateStatusById = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ caseId, status }: { caseId: string; status: boolean }) => 
      apiClient.updateStatusById(caseId, { status }),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: ["getAllCases"] });
      queryClient.invalidateQueries({ queryKey: ["getCaseById", caseId] });
    },
  });
};
