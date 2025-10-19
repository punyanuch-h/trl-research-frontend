import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Search, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { getUserRole } from "@/lib/auth";

interface LoginFormData {
  email: string;
  password: string;
}

export default function StartPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const {
    data: response,
    mutateAsync,
    error: loginError,
    isPending: loginPending,
  } = useLogin();

  useEffect(() => {
    if (response) {
      const { role, token } = response;

      if (role && token) {
        localStorage.setItem("token", token);

        if (role === "admin") {
          navigate("/admin-homepage");
        } else if (role === "researcher") {
          navigate("/researcher-homepage");
        } else {
          navigate("/login");
        }
      }
    }
  }, [response, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    await mutateAsync({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            TRL Assessment
          </h1>
          <p className="text-xl text-muted-foreground">
            Technology Readiness Level Evaluation System
          </p>
        </div>

        <div>
          <div className="hover:shadow-lg transition-shadow bg-white rounded-xl border p-6 flex flex-col items-center w-full">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Login</h2>
            </div>

            {/* Content */}
            <div className="w-full text-center">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="email" className="text-left">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email"
                    {...register("email", { required: "กรุณากรอกอีเมล" })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="password" className="text-left">รหัสผ่าน</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {loginError && (
                  <p className="text-sm text-destructive">
                    อีเมลหรือรหัสผ่านไม่ถูกต้อง
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loginPending}
                >
                  {loginPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังเข้าสู่ระบบ...
                    </>
                  ) : (
                    "เข้าสู่ระบบ"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
