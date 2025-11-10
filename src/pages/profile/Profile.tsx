import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { useUpdateUserProfile } from "@/hooks/user/patch/useUpdateUserProfile";
import formatPhoneNumber from "@/utils/phone";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: userProfile } = useGetUserProfile();
  const navigate = useNavigate();
  const updateUserProfile = useUpdateUserProfile();

  const [form, setForm] = useState({
    id: userProfile?.id || "",
    prefix: "",
    first_name: "",
    last_name: "",
    academic_position: "",
    department: "",
    email: "",
    phone_number: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setForm(userProfile);
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updated = await updateUserProfile.mutateAsync(form as any);
      // ปรับ form ให้แสดงผลทันทีหลัง update สำเร็จ
      if (updated) {
        setForm(updated);
      }
      setIsEditing(false);
    } catch (err) {
      // สามารถเพิ่มการแจ้งเตือนได้ตามต้องการ
      console.error("Update failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center py-10 px-4">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <ArrowLeft className="w-6 h-6 mr-2 cursor-pointer" onClick={() => navigate(-1)} />
            <CardTitle className="text-center text-2xl">User Profile</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Prefix", name: "prefix" },
                { label: "First Name", name: "first_name" },
                { label: "Last Name", name: "last_name" },
                { label: "Academic Position", name: "academic_position" },
                { label: "Department", name: "department" },
                { label: "Email", name: "email" },
                { label: "Phone Number", name: "phone_number" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-primary">{field.label}</label>
                  {isEditing ? (
                    <Input
                      name={field.name}
                      value={(form as any)[field.name] ?? ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <span className="text-base font-medium border border-gray-300 rounded-md p-2">
                      {field.name === "phone_number"
                        ? formatPhoneNumber((form as any)?.[field.name])
                        : (form as any)?.[field.name]}
                    </span>
                  )}
                </div>
              ))}

              {/* ปุ่ม Edit / Save */}
              <Button
                variant="outline"
                onClick={() => {
                  if (isEditing) handleSave();
                  else setIsEditing(true);
                }}
                disabled={updateUserProfile.isPending}
              >
                {isEditing
                  ? updateUserProfile.isPending
                    ? "Saving..."
                    : "Save"
                  : "Edit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
