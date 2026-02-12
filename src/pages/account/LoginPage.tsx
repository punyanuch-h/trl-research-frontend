import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Loader2, User, Lock, EyeOff, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogin } from "@/hooks/login/useLogin";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  const {
    data: response,
    mutate,
    error: loginError,
    isPending: loginPending,
    reset: resetMutation,
  } = useLogin();

  /* ================= SUCCESS LOGIN ================= */
  useEffect(() => {
    if (!response) return;

    const { role, token } = response;

    if (token) localStorage.setItem("token", token);

    if (role === "admin") navigate("/admin/homepage");
    else if (role === "researcher") navigate("/researcher/homepage");
    else navigate("/login");
  }, [response, navigate]);

  /* ================= LOGIN ERROR ================= */
  useEffect(() => {
    if (!loginError) return;

    setError("root", {
      type: "manual",
      message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    });
  }, [loginError, setError]);

  /* ================= CLEAR ERROR WHEN TYPING ================= */
  useEffect(() => {
    const subscription = watch(() => {
      if (errors.root) clearErrors("root");
    });

    return () => subscription.unsubscribe();
  }, [watch, clearErrors, errors.root]);

  /* ================= SUBMIT ================= */
  const onSubmit = (data: LoginFormData) => {
    if (loginPending || isSubmitting) return; // กันยิงซ้ำ

    clearErrors("root");
    resetMutation();

    mutate({
      email: data.email.trim(),
      password: data.password,
    });
  };

  const isLoading = loginPending || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            ระบบประเมินระดับความพร้อมทางเทคโนโลยี
          </h1>
          <p className="text-xl text-muted-foreground">
            Technology Readiness Level (TRL) Evaluation System
          </p>
        </div>

        <Card className="w-full max-w-md shadow-md mx-auto">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">เข้าสู่ระบบ</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* EMAIL */}
              <div className="space-y-1">
                <Label>อีเมล</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    autoComplete="email"
                    disabled={isLoading}
                    {...register("email", {
                      required: "กรุณากรอกอีเมล",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "รูปแบบอีเมลไม่ถูกต้อง",
                      },
                    })}
                    className={`pl-10 ${
                      errors.email || errors.root ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label>รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...register("password", {
                      required: "กรุณากรอกรหัสผ่าน",
                      minLength: {
                        value: 6,
                        message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
                      },
                    })}
                    className={`pl-10 pr-10 ${
                      errors.password || errors.root ? "border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}

                <div className="text-right text-sm">
                  <button
                    type="button"
                    onClick={() => navigate("/forget-password")}
                    className="text-primary hover:underline"
                  >
                    ลืมรหัสผ่าน
                  </button>
                </div>
              </div>

              {/* ROOT ERROR */}
              {errors.root && (
                <p className="text-sm text-destructive text-center">
                  {errors.root.message}
                </p>
              )}

              {/* BUTTON */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                ยังไม่มีบัญชี?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-primary hover:underline font-medium"
                >
                  ลงทะเบียน
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}