import { useDownloadFile } from "@/hooks/file/useDownloadFile";

export function FileRow({ file }: { file: any }) {
  const { downloadFile, loading } = useDownloadFile();

  return (
    <div className="flex justify-between border p-3 rounded-lg">
      <span>{file.file_name}</span>
      <button
        className="bg-green-600 text-white px-3 py-1 rounded"
        onClick={() => downloadFile(file.id)}
      >
        {loading ? "Loading..." : "Download"}
      </button>
    </div>
  );
}
