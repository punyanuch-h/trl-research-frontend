import axios from "axios";
import { useState, useEffect } from "react";
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
      toast.success("รีเซ็ตรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบด้วยรหัสใหม่อีกครั้ง");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("root", {
            message: "ขออภัยรหัสผ่านเดิมไม่ถูกต้อง",
          });
          return;
        }
      }

      toast.error("เปลี่ยนรหัสผ่านไม่สำเร็จ");

      setError("root", {
        message: "ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง หรือ ติดต่อเจ้าหน้าที่",
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
            ย้อนกลับ
          </Button>

          <h2 className="text-2xl text-center font-semibold">
            เปลี่ยนรหัสผ่าน
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
                <Label>รหัสผ่านเดิม</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register("oldPassword", {
                      required: "กรุณากรอกรหัสผ่านเดิม",
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
                <Label>รหัสผ่านใหม่</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register("newPassword", {
                      required: "กรุณากรอกรหัสผ่านใหม่",
                      minLength: {
                        value: 8,
                        message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d).+$/,
                        message:
                          "ต้องมีตัวอักษรพิมพ์ใหญ่ และตัวเลขอย่างน้อย 1 ตัว",
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
                <Label>ยืนยันรหัสผ่านใหม่</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register("confirmNewPassword", {
                      required: "กรุณายืนยันรหัสผ่านใหม่",
                      validate: (value) =>
                        value === newPassword || "รหัสผ่านใหม่ไม่ตรงกัน",
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
                    กำลังเปลี่ยนรหัสผ่าน...
                  </>
                ) : (
                  "เปลี่ยนรหัสผ่าน"
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
