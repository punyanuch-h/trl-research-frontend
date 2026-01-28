import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Save } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { useUpdateUserProfile } from "@/hooks/user/patch/useUpdateUserProfile";
import { useToast } from "@/hooks/toast/useToast";
import formatPhoneNumber from "@/utils/phone";

type UserProfile = {
  id: string;
  prefix: string;
  first_name: string;
  last_name: string;
  academic_position: string;
  department: string;
  email: string;
  phone_number: string;
};

/* =======================
   Reusable Field Component
======================= */
type ProfileFieldProps = {
  label: string;
  name: keyof UserProfile;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function ProfileField({
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

const FIELD_GROUPS: { label: string; name: keyof UserProfile }[][] = [
  [
    { label: "คำนำหน้า", name: "prefix" },
    { label: "ตำแหน่งทางวิชาการ", name: "academic_position" },
  ],
  [
    { label: "ชื่อ", name: "first_name" },
    { label: "นามสกุล", name: "last_name" },
    { label: "ภาควิชา", name: "department" },
  ],
  [
    { label: "อีเมล", name: "email" },
    { label: "เบอร์โทรศัพท์", name: "phone_number" },
  ],
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: userProfile, refetch } = useGetUserProfile();
  const updateUserProfile = useUpdateUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UserProfile>({
    id: "",
    prefix: "",
    first_name: "",
    last_name: "",
    academic_position: "",
    department: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    if (userProfile) setForm(userProfile);
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile.mutateAsync(form);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      await refetch();
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header disabled />

      <div className="flex flex-col items-center py-10 px-4 gap-6">
        {/* Header */}
        <div className="w-full max-w-xl grid grid-cols-3 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ย้อนกลับ
          </Button>

          <h2 className="text-2xl text-center font-semibold">
            ข้อมูลบัญชีผู้ใช้
          </h2>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={updateUserProfile.isPending}
              className="flex items-center gap-2"
            >
              {updateUserProfile.isPending ? (
                "Saving..."
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  บันทึก
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  แก้ไข
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Card */}
        <Card className="w-full max-w-xl">
          <CardContent>
            {FIELD_GROUPS.map((group, index) => (
              <div
                key={index}
                className={
                  group.length === 2
                    ? "grid grid-cols-2 gap-4 mt-4"
                    : "space-y-4 mt-4"
                }
              >
                {group.map((field) => (
                  <ProfileField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
