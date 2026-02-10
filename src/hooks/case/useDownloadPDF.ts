import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { generateCaseReportHTML } from "@/utils/pdfHtmlTemplates";
import type { CaseResponse, AppointmentResponse } from "@/types/type";

export const useDownloadPDF = () => {
    const queryClient = useQueryClient();
    const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

    const downloadPDF = async (caseInfo: CaseResponse & { appointments: AppointmentResponse[]; latestAppointment: AppointmentResponse | null }) => {
        try {
            console.log("Generating Server-side PDF for:", caseInfo.title);

            // 1. Fetch all necessary data
            let coordinatorData = null;
            try {
                coordinatorData = await queryClient.fetchQuery({
                    queryKey: ["useGetCoordinatorByCaseId", caseInfo.id],
                    queryFn: async () => {
                        return await apiQueryClient.useGetCoordinatorByCaseId(caseInfo.id);
                    },
                });
            } catch (err) {
                console.warn("No coordinator data found or error fetching", err);
            }

            let ipData = [];
            try {
                ipData = await queryClient.fetchQuery({
                    queryKey: ["useGetIPByCaseId", caseInfo.id],
                    queryFn: async () => {
                        return await apiQueryClient.useGetIPByCaseId(caseInfo.id);
                    },
                });
            } catch (err) {
                console.warn("No IP data found", err);
            }

            let supportmentData = null;
            try {
                supportmentData = await queryClient.fetchQuery({
                    queryKey: ["useGetSupporterByCaseId", caseInfo.id],
                    queryFn: async () => {
                        return await apiQueryClient.useGetSupporterByCaseId(caseInfo.id);
                    },
                });
            } catch (err) {
                console.warn("No supportment data found", err);
            }

            let assessmentData = null;
            try {
                assessmentData = await queryClient.fetchQuery({
                    queryKey: ["useGetAssessmentByCaseId", caseInfo.id],
                    queryFn: async () => {
                        return await apiQueryClient.useGetAssessmentById(caseInfo.id);
                    },
                });
            } catch (err) {
                console.warn("No assessment data found", err);
            }

            // 2. Construct HTML string
            const html = generateCaseReportHTML({
                c: caseInfo,
                appointments: caseInfo.appointments || [],
                coordinatorData: coordinatorData || undefined,
                ipList: Array.isArray(ipData) ? ipData : (ipData ? [ipData] : []),
                supportmentData: supportmentData || undefined,
                assessmentData: assessmentData || undefined,
            });

            // 3. Call API to generate PDF
            const blob = await apiQueryClient.useGeneratePDF(html);

            // 4. Download PDF
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const rawTitle = caseInfo.title || caseInfo.id;
            const sanitizedTitle = rawTitle.toString()
                .replace(/[<>:"/\\|?*]/g, '_')
                .trim();
            link.download = `result_${sanitizedTitle}.pdf`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF ผ่านเซิร์ฟเวอร์");
        }
    };

    return { downloadPDF };
};
