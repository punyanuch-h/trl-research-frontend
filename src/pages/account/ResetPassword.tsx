import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { usePostResetPassword } from "@/hooks/user/post/useResetPassword";
import { toast } from "@/lib/toast";

interface ResetPasswordData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>();

  useEffect(() => {
    const subscription = watch(() => {
      clearErrors("root");
    });

    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  const newPassword = watch("newPassword");

  const { postResetPassword } = usePostResetPassword();

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      await postResetPassword({
        old_password: data.oldPassword,
        new_password: data.newPassword,
      });
      toast.success(t("auth.resetPasswordSuccess"));
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("root", {
            message: t("auth.oldPasswordInvalid"),
          });
          return;
        }
      }

      toast.error(t("auth.resetPasswordError"));

      setError("root", {
        message: t("auth.signupError"),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header disabled />

      <div className="flex flex-col items-center py-10 px-4 gap-6">
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
            {t("auth.resetPassword")}
          </h2>
        </div>

        <Card className="w-full max-w-xl shadow-md">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 mt-6"
            >
              {/* Old Password */}
              <div className="space-y-2">
                <Label>{t("auth.oldPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register("oldPassword", {
                      required: t("auth.oldPasswordRequired"),
                    })}
                  />
                  <PasswordToggle
                    show={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {errors.oldPassword && (
                  <p className="text-sm text-destructive">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label>{t("auth.newPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register("newPassword", {
                      required: t("auth.newPasswordRequired"),
                      minLength: {
                        value: 8,
                        message: t("auth.passwordMin8"),
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d).+$/,
                        message: t("auth.passwordStrength"),
                      },
                    })}
                  />
                  <PasswordToggle
                    show={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label>{t("auth.confirmNewPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register("confirmNewPassword", {
                      required: t("auth.confirmNewPasswordRequired"),
                      validate: (value) =>
                        value === newPassword || t("auth.newPasswordMismatch"),
                    })}
                  />
                  <PasswordToggle
                    show={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              {errors.root && (
                <p className="text-sm text-destructive text-center">
                  {errors.root.message}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("auth.resettingPassword")}
                  </>
                ) : (
                  t("auth.resetPassword")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PasswordToggle({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-3 text-muted-foreground"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}
