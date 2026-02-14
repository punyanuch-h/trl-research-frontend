import { useTranslation } from "react-i18next";
import { useUploadFile } from "@/hooks/file/useUploadFile";
import { toast } from "@/lib/toast";

export function UploadSection({ caseId }: { caseId: string }) {
  const { t } = useTranslation();
  const { uploadFile, loading } = useUploadFile(
    () => toast.success(t("toast.uploadSuccess")),
    () => console.log("Closed")
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile({ file, case_id: caseId }).catch((err) => {
        toast.error(t("toast.uploadError"));
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <input type="file" onChange={handleSelect} accept="application/pdf" />
      {loading && <p>Uploading...</p>}
    </div>
  );
}
