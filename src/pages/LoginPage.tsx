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
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
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
        if (role === "admin") navigate("/admin-homepage");
        else if (role === "researcher") navigate("/researcher-homepage");
        else navigate("/login");
      }
    }
  }, [response, navigate]);

  useEffect(() => {
    if (loginError) {
      setLoginErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  }, [loginError]);

  const onSubmit = async (data: LoginFormData) => {
    setLoginErrorMessage(null);
    await mutateAsync({
      email: data.email,
      password: data.password,
    });
  };

  const handleInputChange = () => {
    setLoginErrorMessage(null);
    clearErrors(["email", "password"]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            TRL Assessment
          </h1>
          <p className="text-xl text-muted-foreground">
            Technology Readiness Level Evaluation System
          </p>
        </div>

        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">เข้าสู่ระบบ</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="example@email.com"
                    {...register("email", { required: "กรุณากรอกอีเมล" })}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${
                      errors.password ? "border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Error message */}
              {loginErrorMessage && (
                <p className="text-sm text-destructive text-center">
                  {loginErrorMessage}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={!isValid || loginPending}>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
