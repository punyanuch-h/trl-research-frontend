import { useUploadFile } from "@/hooks/file/useUploadFile";

export function UploadSection({ caseId }: { caseId: string }) {
  const { uploadFile, loading } = useUploadFile(
    () => alert("Upload Success!"),
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
