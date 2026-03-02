import { useTranslation } from "react-i18next";
import { useUploadFile } from "@/hooks/index";
import { toast } from "@/lib/toast";

export function UploadSection() {
  const { t } = useTranslation();
  const { uploadFile, loading } = useUploadFile(
    () => toast.success(t("toast.uploadSuccess"))
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile({ file }, {
        onError: () => {
          toast.error(t("toast.uploadError"));
        }
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
