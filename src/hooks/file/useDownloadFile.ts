import { useState } from "react";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export function useDownloadFile() {
  const [loading, setLoading] = useState(false);
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const downloadFile = async (fileId: string) => {
    setLoading(true);
    try {
      const { download_url } = await apiQueryClient.useGetDownloadURL(fileId);

      // open in new tab
      window.open(download_url, "_blank");
    } catch (error) {
      console.error("❌ Download failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { downloadFile, loading };
}
