import { LucideIcon } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export function KPICard({ icon: Icon, label, value }: KPICardProps) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-100 flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}