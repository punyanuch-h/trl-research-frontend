export function NotificationSkeleton() {
  return (
    <div className="flex flex-col divide-y">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 space-y-2 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-3 w-40 bg-gray-200 rounded" />
            <div className="h-2 w-2 bg-gray-200 rounded-full" />
          </div>

          <div className="h-3 w-52 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />

          <div className="flex gap-2 mt-2">
            <div className="h-2 w-24 bg-gray-200 rounded" />
            <div className="h-2 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
