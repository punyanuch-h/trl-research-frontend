import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiQueryClient } from "../../client/ApiQueryClient";
import axios, { AxiosError } from "axios";
import { SubmitResearcherFormRequest } from "@/types/request";
import { toast } from "@/lib/toast";
import { useTranslation } from "react-i18next";

export function useSubmitResearcherForm(setShowConfirmDialog?: (v: boolean) => void) {
  const { t } = useTranslation();
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
      toast.success(t("toast.saveSuccess"));
      localStorage.removeItem("currentFormStep");
      localStorage.removeItem("researcherFormData");
      navigate('/researcher-homepage');
    },
    onError: (error: unknown) => {
      console.error("submit error:", error);

      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ message?: string }>;
        if (!err.response || err.code === 'ERR_NETWORK' || err.response.status === 404 || err.response.status >= 500) {
          toast.error(t("common.serverConnectionError"));
        } else {
          toast.error(err.response?.data?.message || err.message);
        }
        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error(t("toast.unknownError"));
    },
  });
}