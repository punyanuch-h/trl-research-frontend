import { QueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { CaseResponse, AppointmentResponse } from "@/types/type";

export async function fetchCasePdfData(
  queryClient: QueryClient,
  apiQueryClient: ApiQueryClient,
  caseInfo: CaseResponse & { appointments?: AppointmentResponse[] }
) {
  let coordinatorData = null;
  try {
    coordinatorData = await queryClient.fetchQuery({
      queryKey: ["getCoordinatorByCaseId", caseInfo.id],
      queryFn: async () => {
        return await apiQueryClient.getCoordinatorByCaseId(caseInfo.id);
      },
    });
  } catch (err) {
    console.warn("No coordinator data found or error fetching", err);
  }

  let ipData = [];
  try {
    ipData = await queryClient.fetchQuery({
      queryKey: ["getIPByCaseId", caseInfo.id],
      queryFn: async () => {
        return await apiQueryClient.getIPByCaseId(caseInfo.id);
      },
    });
  } catch (err) {
    console.warn("No IP data found", err);
  }

  let supportmentData = null;
  try {
    supportmentData = await queryClient.fetchQuery({
      queryKey: ["getSupportmentByCaseId", caseInfo.id],
      queryFn: async () => {
        return await apiQueryClient.getSupportmentByCaseId(caseInfo.id);
      },
    });
  } catch (err) {
    console.warn("No supportment data found", err);
  }

  let assessmentData = null;
  try {
    assessmentData = await queryClient.fetchQuery({
      queryKey: ["getAssessmentByCaseId", caseInfo.id],
      queryFn: async () => {
        return await apiQueryClient.getAssessmentByCaseId(caseInfo.id);
      },
    });
  } catch (err) {
    console.warn("No assessment data found", err);
  }

  return {
    c: caseInfo,
    appointments: caseInfo.appointments || [],
    coordinatorData: coordinatorData,
    ipList: Array.isArray(ipData) ? ipData : (ipData ? [ipData] : []),
    supportmentData: supportmentData,
    assessmentData: assessmentData,
  };
}