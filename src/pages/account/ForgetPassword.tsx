import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForgetPassword } from "@/hooks/useForgetPassword";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    mode: "onSubmit",
    defaultValues: { email: "" },
  });

  const {
    data: response,
    mutate,
    error: forgotPasswordError,
    isPending: forgotPasswordPending,
    isSuccess,
    reset: resetMutation,
  } = useForgetPassword();

  useEffect(() => {
    if (isSuccess && response) {
      setSuccessMessage(
        "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมล"
      );
    }
  }, [isSuccess, response]);

  useEffect(() => {
    if (forgotPasswordError) {
      setError("root", {
        type: "manual",
        message: "ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบอีเมลอีกครั้ง",
      });
    }
  }, [forgotPasswordError, setError]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSuccessMessage(null);
    clearErrors("root");
    resetMutation();
    mutate(data.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            ระบบประเมินระดับความพร้อมทางเทคโนโลยี
          </h1>
          <p className="text-xl text-muted-foreground">
            Technology Readiness Level (TRL) Evaluation System
          </p>
        </div>

        <Card className="w-full max-w-md shadow-md mx-auto">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">ลืมรหัสผ่าน</CardTitle>
            <CardDescription className="text-center">
              กรอกอีเมลของคุณเพื่อรับอีเมลรีเซ็ตรหัสผ่าน
            </CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage ? (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    {successMessage}
                  </AlertDescription>
                </Alert>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  กลับไปหน้าเข้าสู่ระบบ
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      autoComplete="email"
                      autoFocus
                      {...register("email", {
                        required: "กรุณากรอกอีเมล",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "รูปแบบอีเมลไม่ถูกต้อง",
                        },
                      })}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Error message */}
                {errors.root && (
                  <p className="text-sm text-destructive text-center" role="alert">
                    {errors.root.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={forgotPasswordPending}
                >
                  {forgotPasswordPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังส่งอีเมล...
                    </>
                  ) : (
                    "ส่งอีเมลรีเซ็ตรหัสผ่าน"
                  )}
                </Button>

                {/* Back to login */}
                <div className="text-center text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-primary hover:underline font-medium inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    กลับไปหน้าเข้าสู่ระบบ
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}