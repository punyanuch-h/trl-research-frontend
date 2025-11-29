import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { useUpdateUserProfile } from "@/hooks/user/patch/useUpdateUserProfile";
import formatPhoneNumber from "@/utils/phone";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/toast/useToast";
import Header from "@/components/Header";

export default function ProfilePage() {
  const { data: userProfile, refetch: refetchUserProfile } = useGetUserProfile();
  const navigate = useNavigate();
  const updateUserProfile = useUpdateUserProfile();
  const { toast } = useToast();

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
      if (updated) {
        // Show success toast
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });

        // Refetch profile data to get the latest from server
        const { data: newProfileData } = await refetchUserProfile();
        
        // Update form with the new data
        if (newProfileData) {
          setForm(newProfileData);
        }
      }
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Update failed", err);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header disabled />
      <div className="flex items-center justify-center py-10 px-4">
        <Card className="w-full max-w-xl relative">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <ArrowLeft
                className="w-6 h-6 mr-2 cursor-pointer"
                onClick={() => navigate(-1)}
              />
              <CardTitle className="text-2xl">User Profile</CardTitle>
            </div>

            {/* ปุ่ม Edit / Save มุมขวาบน */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              disabled={updateUserProfile.isPending}
              className="flex items-center gap-2"
            >
              {updateUserProfile.isPending ? (
                "Saving..."
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </>
              )}
            </Button>
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
                <div key={field.name} className="flex flex-col gap-2 relative">
                  <label className="text-sm font-medium text-primary">
                    {field.label}
                  </label>

                  <div className="relative flex items-center">
                    {isEditing ? (
                      <Input
                        name={field.name}
                        value={(form as any)[field.name] ?? ""}
                        onChange={handleChange}
                        className="text-base border-gray-300 pr-10 h-auto py-2"
                      />
                    ) : (
                      <span className="text-base border border-gray-300 rounded-md p-2 w-full">
                        {field.name === "phone_number"
                          ? formatPhoneNumber((form as any)?.[field.name])
                          : (form as any)?.[field.name]}
                      </span>
                    )}

                    {/* แสดงไอคอน ✏️ เมื่ออยู่ในโหมดแก้ไข */}
                    {isEditing && (
                      <Edit className="absolute right-3 text-gray-500 w-4 h-4 pointer-events-none" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
