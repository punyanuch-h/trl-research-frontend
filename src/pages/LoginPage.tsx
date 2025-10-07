import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({ mode: "onChange" });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Step 1: Try login API
      const response = await mutateAsync({
        email: data.email,
        password: data.password,
      });

      // Step 2: Save token
      const token = response?.token;
      if (token) {
        localStorage.setItem("auth_token", token);
      }

      // Step 3: Check token before navigating
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken) {
        console.log("success");
        navigate("/startpage");
      } else {
        console.log("fail: token not found");
      }
    } catch {
      // Step 4: Handle invalid credentials
      setError("email", { type: "manual" });
      setError("password", {
        type: "manual",
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
      console.log("fail: invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">เข้าสู่ระบบ</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm text-foreground"
                data-testid="username-label"
              >
                อีเมล
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="example@email.com"
                  {...register("email", { required: "กรุณากรอกอีเมล" })}
                  onClick={() => {
                    if (errors.email || errors.password) {
                      clearErrors(["email", "password"]);
                    }
                  }}
                  className={`pl-10 ${
                    errors.email ? "border-destructive" : ""
                  }`}
                  data-testid="username-input"
                />
              </div>
              {errors.email && (
                <p
                  className="text-sm text-destructive"
                  data-testid="username-error"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm text-foreground"
                data-testid="password-label"
              >
                รหัสผ่าน
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
                  onClick={() => {
                    if (errors.password) {
                      clearErrors(["email", "password"]);
                      resetField("password");
                    }
                  }}
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-destructive" : ""
                  }`}
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  className="text-sm text-destructive"
                  data-testid="password-error"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isPending}
            >
              {isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>

            {/* Signup link */}
            <p className="text-sm text-center text-muted-foreground">
              ยังไม่มีบัญชีใช่หรือไม่?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-primary cursor-pointer hover:underline"
              >
                สมัครสมาชิก
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
