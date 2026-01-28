import { Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import formatPhoneNumber from "@/utils/phone";

/* =======================
   Types
======================= */
export type UserProfile = {
  id: string;
  prefix: string;
  first_name: string;
  last_name: string;
  academic_position: string;
  department: string;
  email: string;
  phone_number: string;
};

type ProfileFieldProps = {
  label: string;
  name: keyof UserProfile;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/* =======================
   Component
======================= */
export default function ProfileField({
  label,
  name,
  value,
  isEditing,
  onChange,
}: ProfileFieldProps) {
  const displayValue =
    name === "phone_number" ? formatPhoneNumber(value) : value;

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-sm font-medium text-primary">{label}</label>

      <div className="relative flex items-center">
        {isEditing ? (
          <Input
            name={name}
            value={value}
            onChange={onChange}
            className="text-base border-gray-300 pr-10 h-auto py-2"
          />
        ) : (
          <span className="text-base border border-gray-300 rounded-md p-2 w-full">
            {displayValue || "-"}
          </span>
        )}

        {isEditing && (
          <Edit className="absolute right-3 text-gray-500 w-4 h-4 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
