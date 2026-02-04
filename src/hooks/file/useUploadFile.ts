import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

interface UploadFileInput {
  file: File;
  case_id?: string; // optional
}

export function useUploadFile(onSuccess: () => void, onClose?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const uploadFile = async ({ file, case_id }: UploadFileInput) => {
    setLoading(true);
    try {
      // --------------------------
      // STEP 1 — Request Presigned URL
      // --------------------------
      const { upload_url, object_path } = await apiQueryClient.presignUpload(file);

      // --------------------------
      // STEP 2 — Upload File to GCS
      // --------------------------
      await apiQueryClient.uploadToSignedUrl(upload_url, file);

      // --------------------------
      // STEP 3 — Notify Backend
      // --------------------------
      await apiQueryClient.useNotifyUploaded({
        case_id: case_id ?? "",
        cases_attachments: [object_path],
      });

      // --------------------------
      // STEP 4 — Refresh UI (React Query)
      // --------------------------
      await queryClient.invalidateQueries({ queryKey: ["getFilesByCase"] });
      await queryClient.invalidateQueries({ queryKey: ["getCaseById"] });

      onSuccess();
      onClose?.();

    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading };
}
