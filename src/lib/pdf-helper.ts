import { QueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { CaseResponse, AppointmentResponse, CoordinatorResponse, IntellectualPropertyResponse, SupportmentResponse, AssessmentResponse, UserProfileResponse } from "@/types/type";

export interface CasePdfData {
  c: CaseResponse & { appointments?: AppointmentResponse[] };
  appointments: AppointmentResponse[];
  researcherData: UserProfileResponse | null;
  coordinatorData: CoordinatorResponse | null;
  ipList: IntellectualPropertyResponse[];
  supportmentData: SupportmentResponse | null;
  assessmentData: AssessmentResponse | null;
}

export async function fetchCasePdfData(
  queryClient: QueryClient,
  apiQueryClient: ApiQueryClient,
  caseInfo: CaseResponse & { appointments?: AppointmentResponse[] }
): Promise<CasePdfData> {
  const [researcherRes, coordinatorRes, ipRes, supportmentRes, assessmentRes] = await Promise.allSettled([
    queryClient.fetchQuery({
      queryKey: ["getResearcherById", caseInfo.researcher_id],
      queryFn: () => apiQueryClient.getResearcherById(caseInfo.researcher_id),
    }),
    queryClient.fetchQuery({
      queryKey: ["getCoordinatorByCaseId", caseInfo.id],
      queryFn: () => apiQueryClient.getCoordinatorByCaseId(caseInfo.id),
    }),
    queryClient.fetchQuery({
      queryKey: ["getIPByCaseId", caseInfo.id],
      queryFn: () => apiQueryClient.getIPByCaseId(caseInfo.id),
    }),
    queryClient.fetchQuery({
      queryKey: ["getSupportmentByCaseId", caseInfo.id],
      queryFn: () => apiQueryClient.getSupportmentByCaseId(caseInfo.id),
    }),
    queryClient.fetchQuery({
      queryKey: ["getAssessmentByCaseId", caseInfo.id],
      queryFn: () => apiQueryClient.getAssessmentByCaseId(caseInfo.id),
    }),
  ]);

  const researcherData = researcherRes.status === "fulfilled" ? researcherRes.value : null;
  if (researcherRes.status === "rejected") {
    console.warn("No researcher data found or error fetching", researcherRes.reason);
  }

  const coordinatorData = coordinatorRes.status === "fulfilled" ? coordinatorRes.value : null;
  if (coordinatorRes.status === "rejected") {
    console.warn("No coordinator data found or error fetching", coordinatorRes.reason);
  }

  const ipData = ipRes.status === "fulfilled" ? ipRes.value : [];
  if (ipRes.status === "rejected") {
    console.warn("No IP data found", ipRes.reason);
  }

  const supportmentData = supportmentRes.status === "fulfilled" ? supportmentRes.value : null;
  if (supportmentRes.status === "rejected") {
    console.warn("No supportment data found", supportmentRes.reason);
  }

  const assessmentData = assessmentRes.status === "fulfilled" ? assessmentRes.value : null;
  if (assessmentRes.status === "rejected") {
    console.warn("No assessment data found", assessmentRes.reason);
  }

  return {
    c: caseInfo,
    appointments: caseInfo.appointments || [],
    researcherData: researcherData,
    coordinatorData: coordinatorData,
    ipList: ipData,
    supportmentData: supportmentData,
    assessmentData: assessmentData,
  };
}