import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";
import type { UserProfileResponse } from "@/hooks/client/type.ts";

export const useUpdateUserProfile = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userProfile: UserProfileResponse) => {
      return apiClient.useUpdateUserProfile(userProfile);
    },
    onSuccess: async (data) => {
      if (data) {
        queryClient.setQueryData(["getUserProfile"], data);
      }
      await queryClient.invalidateQueries({ queryKey: ["getUserProfile"], exact: true });
    },
  });
};
