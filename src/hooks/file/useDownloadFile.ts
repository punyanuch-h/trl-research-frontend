import { useState } from "react";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export function useGetDownloadUrl() {
  const [loading, setLoading] = useState(false);
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const openFile = async (path: string) => {
    setLoading(true);
    try {
      const response = await apiQueryClient.useGetDownloadUrl(path);
      
      if (response?.download_url) {
        window.open(response.download_url, '_blank');
      } else {
        throw new Error("Invalid download URL");
      }

    } catch (error) {
      console.error("❌ Failed to open file:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { openFile, loading };
}
