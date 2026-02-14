import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
      message: t("auth.loginError"),
    });
  }, [loginError, setError, t]);

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
            {t("auth.appTitle")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("auth.appSubtitle")}
          </p>
        </div>

        <Card className="w-full max-w-md shadow-md mx-auto">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">{t("auth.login")}</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* EMAIL */}
              <div className="space-y-1">
                <Label>{t("auth.email")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    autoComplete="email"
                    disabled={isLoading}
                    {...register("email", {
                      required: t("auth.emailRequired"),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t("auth.emailInvalid"),
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
                <Label>{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...register("password", {
                      required: t("auth.passwordRequired"),
                      minLength: {
                        value: 6,
                        message: t("auth.passwordMin6"),
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
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
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
                    {t("auth.forgetPassword")}
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
                    {t("auth.loggingIn")}
                  </>
                ) : (
                  t("auth.login")
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {t("auth.noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-primary hover:underline font-medium"
                >
                  {t("auth.signup")}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}