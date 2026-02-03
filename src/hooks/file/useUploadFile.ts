import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BACKEND_HOST } from "@/constant/constants";

interface UploadFileInput {
  file: File;
  case_id?: string; // optional
}

export function useUploadFile(onSuccess: () => void, onClose?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const uploadFile = async ({ file, case_id }: UploadFileInput) => {
    setLoading(true);
    try {
      // --------------------------
      // STEP 1 — Request Presigned URL
      // --------------------------
      const presignResponse = await fetch(`${BACKEND_HOST}/trl/presign/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          file_name: file.name,
          content_type: file.type,
        }),
      });

      if (!presignResponse.ok) {
        const error = await presignResponse.text();
        throw new Error(`Presign failed: ${error}`);
      }

      const { upload_url, object_path } = await presignResponse.json();

      // --------------------------
      // STEP 2 — Upload File to GCS
      // --------------------------
      const uploadResult = await fetch(upload_url, {
        method: "PUT",
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error("Upload to GCS failed");
      }

      // --------------------------
      // STEP 3 — Notify Backend
      // --------------------------
      const notifyResponse = await fetch(`${BACKEND_HOST}/trl/files/uploaded`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          case_id: case_id ?? "",
          cases_attachments: [object_path],
        }),
      });

      if (!notifyResponse.ok) {
        const err = await notifyResponse.text();
        throw new Error(`Notify backend failed: ${err}`);
      }

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
