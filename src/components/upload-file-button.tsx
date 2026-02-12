import { useUploadFile } from "@/hooks/file/useUploadFile";
import { toast } from "sonner";

export function UploadSection({ caseId }: { caseId: string }) {
  const { uploadFile, loading } = useUploadFile(
    () => toast.success("Upload Success!"),
    () => console.log("Closed")
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile({ file, case_id: caseId });
  };

  return (
    <div className="p-4 border rounded-lg">
      <input type="file" onChange={handleSelect} accept="application/pdf" />
      {loading && <p>Uploading...</p>}
    </div>
  );
}
