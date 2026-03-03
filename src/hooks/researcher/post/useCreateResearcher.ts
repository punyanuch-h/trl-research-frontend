import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { PostResearcherData } from "@/types/type";

export function useCreateResearcher(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: PostResearcherData) => apiQueryClient.createResearcher(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAllResearchers"] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Failed to create researcher:", error);
    },
  });

  return { createResearcher: mutateAsync, loading: isPending };
}
