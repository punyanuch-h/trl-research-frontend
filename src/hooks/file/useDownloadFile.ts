import { useState } from "react";
import { BACKEND_HOST } from "@/constant/constants";

export function useDownloadFile() {
  const [loading, setLoading] = useState(false);

  const downloadFile = async (fileId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_HOST}/trl/file/download-url/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to get download URL: ${err}`);
      }

      const { download_url } = await res.json();

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
