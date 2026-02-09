import { useState } from "react";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export function useGetDownloadUrl() {
  const [processingPaths, setProcessingPaths] = useState<Set<string>>(new Set());
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const openFile = async (path: string) => {
    setProcessingPaths(prev => new Set(prev).add(path));

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
      setProcessingPaths(prev => {
        const next = new Set(prev);
        next.delete(path);
        return next;
      });
    }
  };

  return { 
    openFile, 
    processingPaths,
    isPathLoading: (path: string) => processingPaths.has(path)
  };
}