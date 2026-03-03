import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiQueryClient } from "../../client/ApiQueryClient";
import axios, { AxiosError } from "axios";
import { SubmitResearcherFormRequest } from "@/types/request";
import { toast } from "@/lib/toast";
import i18n from "@/lib/i18n";

export function useSubmitResearcherForm(setShowConfirmDialog?: (v: boolean) => void) {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (form: SubmitResearcherFormRequest) =>
      apiClient.submitResearcherForm(form),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["getAllCases"] });
      queryClient.invalidateQueries({ queryKey: ["getAllCoordinators"] });
      queryClient.invalidateQueries({ queryKey: ["getAllSupportments"] });
      queryClient.invalidateQueries({ queryKey: ["getAllIPs"] });
      queryClient.invalidateQueries({ queryKey: ["getAllAssessments"] });

      // Success - clear and navigate
      setShowConfirmDialog?.(false);
      toast.success(i18n.t("toast.saveSuccess"));
      localStorage.removeItem("currentFormStep");
      localStorage.removeItem("researcherFormData");
      navigate('/researcher-homepage');
    },
    onError: (error: unknown) => {
      console.error("submit error:", error);

      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ message?: string }>;
        toast.error(err.response?.data?.message || err.message);
        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error(i18n.t("toast.unknownError"));
    },
  });
}