import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Loader2,
  User,
  Lock,
  Mail,
  Building,
  ArrowLeft,
  EyeOff,
  Eye,
} from "lucide-react";
import { usePostAdmin } from "@/hooks/admin/post/usePostAdmin";
import Header from "@/components/Header";
import { PhoneInput } from "@/components/format/PhoneInput";

type CreateAccountFormValues = {
  prefix: string;
  academic_position: string | null;
  academic_position_other?: string;
  first_name: string;
  last_name: string;
  department: string;
  phone_number: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function CreateAccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<CreateAccountFormValues>({
    defaultValues: {
      prefix: "",
      academic_position: null,
      first_name: "",
      last_name: "",
      department: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const subscription = watch(() => {
      if (errors.root) clearErrors("root");
    });

    return () => subscription.unsubscribe();
  }, [watch, clearErrors, errors.root]);

  const { postAdmin, loading } = usePostAdmin(() => {
    navigate("/admin/homepage");
  });

  const password = watch("password");
  const academicPosition = watch("academic_position");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: CreateAccountFormValues) => {
    const academicPosition =
      data.academic_position === "other"
        ? data.academic_position_other
        : data.academic_position;

    try {
      await postAdmin({
        prefix: data.prefix,
        academic_position: academicPosition,
        first_name: data.first_name,
        last_name: data.last_name,
        department: data.department,
        phone_number: data.phone_number,
        email: data.email,
        password: data.password,
      });
    } catch (err: unknown) {
      console.error(err);
      setError("root", {
        message: t("auth.signupError"),
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
            {t("auth.createAccount")}
          </h2>
        </div>

        <Card className="w-full max-w-xl shadow-md">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prefix */}
                <div>
                  <Label>{t("auth.prefix")}</Label><span className="text-red-500">*</span>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Controller
                      control={control}
                      name="prefix"
                      rules={{ required: t("auth.prefixRequired") }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder={t("form.prefixPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="นพ.">นพ.</SelectItem>
                            <SelectItem value="พญ.">พญ.</SelectItem>
                            <SelectItem value="ภญ.">ภญ.</SelectItem>
                            <SelectItem value="ทพญ.">ทพญ.</SelectItem>
                            <SelectItem value="นาย">{t("form.prefixMr")}</SelectItem>
                            <SelectItem value="นาง">{t("form.prefixMrs")}</SelectItem>
                            <SelectItem value="นางสาว">{t("form.prefixMs")}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {errors.prefix && (
                    <p className="text-sm text-destructive">
                      {errors.prefix.message}
                    </p>
                  )}
                </div>

                {/* Academic Position */}
                <div>
                  <Label>{t("auth.academicPosition")}</Label>
                  <div
                    className={`grid gap-2 ${academicPosition === "other" ? "grid-cols-3" : "grid-cols-1"
                      }`}
                  >
                    {/* Select */}
                    <div
                      className={`relative ${academicPosition === "other" ? "col-span-1" : ""
                        }`}
                    >
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

                      <Controller
                        control={control}
                        name="academic_position"
                        render={({ field }) => (
                          <Select
                            value={field.value ?? "none"}
                            onValueChange={(val) =>
                              field.onChange(val === "none" ? null : val)
                            }
                          >
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder={t("form.academicPositionPlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">{t("form.none")}</SelectItem>
                              <SelectItem value="อ.">อ.</SelectItem>
                              <SelectItem value="ผศ.">ผศ.</SelectItem>
                              <SelectItem value="รศ.">รศ.</SelectItem>
                              <SelectItem value="ศ.">ศ.</SelectItem>
                              <SelectItem value="other">{t("common.other")}</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {/* Input (Other) */}
                    {academicPosition === "other" && (
                      <div className="col-span-2">
                        <Input
                          placeholder={t("form.academicPositionPlaceholder")}
                          {...register("academic_position_other", {
                            required: t("auth.academicPositionRequired"),
                          })}
                        />
                        {errors.academic_position_other && (
                          <p className="text-sm text-destructive">
                            {errors.academic_position_other.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* First Name */}
              <div>
                <Label>{t("auth.firstName")}</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("form.namePlaceholder")}
                    className="pl-10"
                    {...register("first_name", { required: t("auth.firstNameRequired") })}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-destructive">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <Label>{t("auth.lastName")}</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("form.lastNamePlaceholder")}
                    className="pl-10"
                    {...register("last_name", { required: t("auth.lastNameRequired") })}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-destructive">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Department */}
              <div>
                <Label>{t("auth.department")}</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("auth.departmentPlaceholder")}
                    className="pl-10"
                    {...register("department", { required: t("auth.departmentRequired") })}
                  />
                  {errors.department && (
                    <p className="text-sm text-destructive">
                      {errors.department.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <Label>{t("auth.phone")}</Label><span className="text-red-500">*</span>
                  <Controller
                    name="phone_number"
                    control={control}
                    rules={{
                      required: t("auth.phoneRequired"),
                      pattern: {
                        value: /^0\d{9}$/,
                        message: t("auth.phoneInvalid"),
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <PhoneInput
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label>{t("auth.email")}</Label><span className="text-red-500">*</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      className="pl-10"
                      {...register("email", {
                        required: t("auth.emailRequired"),
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: t("auth.emailInvalid"),
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <Label>{t("auth.password")}</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="pl-10"
                    {...register("password", {
                      required: t("auth.passwordRequired"),
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label>{t("auth.confirmPassword")}</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="pl-10"
                    {...register("confirmPassword", {
                      required: t("auth.confirmPasswordRequired"),
                      validate: (value) =>
                        value === password || t("auth.passwordMismatch"),
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {errors.root && (
                <p className="text-sm text-destructive text-center">
                  {errors.root.message}
                </p>
              )}

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("auth.creatingAccount")}
                  </>
                ) : (
                  t("auth.createAccount")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}