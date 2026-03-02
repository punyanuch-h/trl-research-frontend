import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "../../client/ApiQueryClient";
import type { UserProfileResponse } from "@/types/type";

export const useUpdateUserProfile = () => {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  return useMutation({
    mutationFn: (userProfile: UserProfileResponse) => apiClient.updateUserProfile(userProfile),
    onSuccess: async (data) => {
      if (data) {
        queryClient.setQueryData(["getUserProfile", token], data);
      }
      await queryClient.invalidateQueries({ queryKey: ["getUserProfile", token] });
    },
  });
};
