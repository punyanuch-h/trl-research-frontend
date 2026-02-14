import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Save, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

import ProfileField, {
  UserProfile,
} from "@/components/profile/ProfileField";

import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { useUpdateUserProfile } from "@/hooks/user/patch/useUpdateUserProfile";
import { useToast } from "@/hooks/toast/useToast";

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const FIELD_GROUPS: { label: string; name: keyof UserProfile }[][] = [
    [
      { label: t("profile.prefix"), name: "prefix" },
      { label: t("profile.academicPosition"), name: "academic_position" },
    ],
    [
      { label: t("profile.firstName"), name: "first_name" },
      { label: t("profile.lastName"), name: "last_name" },
      { label: t("profile.department"), name: "department" },
    ],
    [
      { label: t("profile.email"), name: "email" },
      { label: t("profile.phone"), name: "phone_number" },
    ],
  ];
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
    if (userProfile && !isEditing) setForm(userProfile);
  }, [userProfile, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (userProfile) setForm(userProfile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateUserProfile.mutateAsync(form);
      toast({
        title: t("common.success"),
        description: t("profile.updateSuccess"),
      });
      await refetch();
      setIsEditing(false);
    } catch {
      toast({
        title: t("common.error"),
        description: t("profile.updateError"),
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
            {t("auth.back")}
          </Button>

          <h2 className="text-2xl text-center font-semibold">
            {t("profile.title")}
          </h2>

          <div className="flex justify-end gap-2">
            {isEditing && !updateUserProfile.isPending && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
                {t("common.cancel")}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={updateUserProfile.isPending}
              className="flex items-center gap-2"
            >
              {updateUserProfile.isPending ? (
                t("profile.saving")
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  {t("common.save")}
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  {t("profile.edit")}
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
