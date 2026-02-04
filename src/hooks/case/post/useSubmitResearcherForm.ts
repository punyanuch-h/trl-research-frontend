import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiQueryClient } from "../../client/ApiQueryClient";
import { da } from "date-fns/locale";

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
    mutationFn: async (formData: FormState) => {
      try {
        const results = await Promise.all([
          apiClient.useSubmitResearcherForm(formData),
        ]);
        return results;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["getAllCases"] });
      queryClient.invalidateQueries({ queryKey: ["getAllCoordinators"] });
      queryClient.invalidateQueries({ queryKey: ["getAllSupporters"] });
      queryClient.invalidateQueries({ queryKey: ["useGetIPAll"] });

      // Success - clear and navigate
      alert("บันทึกข้อมูลสำเร็จ!");
      localStorage.removeItem("currentFormStep");
      localStorage.removeItem("researcherFormData");
      navigate('/researcher-homepage');
    },
    onError: (error) => {
      console.error("❌ Error submitting form:", error);
      console.error("❌ Error details:", {
        message: (error as any)?.message,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
        statusText: (error as any)?.response?.statusText,
      });
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล: " + (error as any)?.message);
    },
  });
}