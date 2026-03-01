import { useMutation } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

interface UploadFileInput {
  file: File;
  case_id?: string; // optional
}

export function useUploadFile(onSuccess: () => void, onClose?: () => void) {
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file }: UploadFileInput) => {
      // STEP 1 — Request Presigned URL
      const { upload_url, object_path } = await apiQueryClient.presignUpload(file);

      // STEP 2 — Upload File to GCS
      await apiQueryClient.uploadToSignedUrl(upload_url, file);

      return object_path;
    },
    onSuccess: () => {
      onSuccess();
      onClose?.();
    },
  });

  return { uploadFile: mutate, loading: isPending };
}
