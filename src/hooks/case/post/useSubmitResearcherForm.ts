import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiQueryClient } from "../../client/ApiQueryClient";
import axios, { AxiosError } from "axios";
import { SubmitResearcherFormRequest } from "@/types/request";
import { toast } from "@/lib/toast";

interface IpForm {
  noIp?: boolean;
  ipTypes: string[];
  ipStatus: string;
  requestNumbers: Record<string, string>;
  file?: File | null;
}

interface FormState {
  id: string;
  // researcher_info
  headPrefix: string;
  headAcademicPosition: string;
  headFirstName: string;
  headLastName: string;
  headDepartment: string;
  headPhoneNumber: string;
  headEmail: string;
  // coordinator_info
  sameAsHead: boolean;
  coordinatorPrefix: string;
  coordinatorAcademicPosition: string;
  coordinatorFirstName: string;
  coordinatorLastName: string;
  coordinatorDepartment: string;
  coordinatorPhoneNumber: string;
  coordinatorEmail: string;
  // caseDetails
  researcherId: string;
  trlScore: number | null;
  status: boolean;
  isUrgent: boolean;
  urgentReason: string;
  urgentFeedback: string;
  researchTitle: string;
  researchType: string;
  description: string;
  keywords: string;
  researchDetailsFiles: File[];
  // evaluateTRL
  trlSoftware: string;
  trlMedicalDevices: string;
  trlMedicinesVaccines: string;
  trlPlantAnimalBreeds: string;
  stageOfDevelopment: string;
  currentChallenges: string;
  targetUsers: string;

  // Assessment_trl
  trlLevelResult: number | null;
  assessmentFiles: Record<string, File | null>;
  // Research Questions (RQ)
  rq1_answer: boolean;
  rq2_answer: boolean;
  rq3_answer: boolean;
  rq4_answer: boolean;
  rq5_answer: boolean;
  rq6_answer: boolean;
  rq7_answer: boolean;
  // Commercialization Questions (CQ)
  cq1_answer: string[];
  cq2_answer: string[];
  cq3_answer: string[];
  cq4_answer: string[];
  cq5_answer: string[];
  cq6_answer: string[];
  cq7_answer: string[];
  cq8_answer: string[];
  cq9_answer: string[];
  // intellectualProperty
  ipHas: boolean;
  ipProtectionStatus: string;
  ipRequestNumber: string;
  ipTypes: string[];
  ipForms: IpForm[];
  // Supporter
  supportDevNeeded: string[];
  supportMarketNeeded: string[];
  businessPartner: string;
  readyForShowcase: string;
  consent: string;
  otherSupportMarket: string;
}

export function useSubmitResearcherForm() {
  const apiClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (form: SubmitResearcherFormRequest) =>
      apiClient.useSubmitResearcherForm(form),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["getAllCases"] });
      queryClient.invalidateQueries({ queryKey: ["getAllCoordinators"] });
      queryClient.invalidateQueries({ queryKey: ["getAllSupporters"] });
      queryClient.invalidateQueries({ queryKey: ["useGetIPAll"] });

      // Success - clear and navigate
      toast.success("บันทึกข้อมูลสำเร็จ!");
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

      toast.error("unknown error");
    },
  });
}