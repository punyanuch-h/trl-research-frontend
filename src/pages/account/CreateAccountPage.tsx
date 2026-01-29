import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Phone,
  Building,
  ArrowLeft,
  EyeOff,
  Eye,
} from "lucide-react";
import { usePostAdmin } from "@/hooks/admin/post/usePostAdmin";
import Header from "@/components/Header";

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
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
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
    } catch (err: any) {
      setError("root", {
        message: "ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง หรือ ติดต่อเจ้าหน้าที่",
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
            ย้อนกลับ
          </Button>

          <h2 className="text-2xl text-center font-semibold">
            สร้างบัญชีผู้ใช้
          </h2>
        </div>

        <Card className="w-full max-w-xl shadow-md">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prefix */}
                <div>
                  <Label>คำนำหน้า</Label><span className="text-red-500">*</span>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Controller
                      control={control}
                      name="prefix"
                      rules={{ required: "กรุณาเลือกคำนำหน้า" }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="คำนำหน้า" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="นพ.">นพ.</SelectItem>
                            <SelectItem value="พญ.">พญ.</SelectItem>
                            <SelectItem value="ภญ.">ภญ.</SelectItem>
                            <SelectItem value="ทพญ.">ทพญ.</SelectItem>
                            <SelectItem value="นาย">นาย</SelectItem>
                            <SelectItem value="นาง">นาง</SelectItem>
                            <SelectItem value="นางสาว">นางสาว</SelectItem>
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
                  <Label>ตำแหน่งทางวิชาการ</Label>
                  <div
                    className={`grid gap-2 ${
                      academicPosition === "other" ? "grid-cols-3" : "grid-cols-1"
                    }`}
                  >
                    {/* Select */}
                    <div
                      className={`relative ${
                        academicPosition === "other" ? "col-span-1" : ""
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
                              <SelectValue placeholder="ตำแหน่งทางวิชาการ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">ไม่มี</SelectItem>
                              <SelectItem value="อ.">อ.</SelectItem>
                              <SelectItem value="ผศ.">ผศ.</SelectItem>
                              <SelectItem value="รศ.">รศ.</SelectItem>
                              <SelectItem value="ศ.">ศ.</SelectItem>
                              <SelectItem value="other">อื่นๆ</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {/* Input (Other) */}
                    {academicPosition === "other" && (
                      <div className="col-span-2">
                        <Input
                          placeholder="ระบุตำแหน่งทางวิชาการ"
                          {...register("academic_position_other", {
                            required: "กรุณาระบุตำแหน่งทางวิชาการ",
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
                <Label>ชื่อ</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="ชื่อ"
                    className="pl-10"
                    {...register("first_name", { required: "กรุณากรอกชื่อ" })}
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
                <Label>นามสกุล</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="นามสกุล"
                    className="pl-10"
                    {...register("last_name", { required: "กรุณากรอกนามสกุล" })}
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
                <Label>ภาควิชา / สถาน / หน่วยงาน</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="เช่น ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์"
                    className="pl-10"
                    {...register("department", { required: "กรุณากรอกภาควิชา / สถาน / หน่วยงาน" })}
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
                  <Label>เบอร์โทรศัพท์</Label><span className="text-red-500">*</span>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="0XXXXXXXXX"
                      className="pl-10"
                      {...register("phone_number", {
                        required: "กรุณากรอกเบอร์โทรศัพท์",
                        pattern: {
                          value: /^0[0-9]{9}$/,
                          message: "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง",
                        }
                      })}
                    />
                    {errors.phone_number && (
                      <p className="text-sm text-destructive">
                        {errors.phone_number.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label>อีเมล</Label><span className="text-red-500">*</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      className="pl-10"
                      {...register("email", {
                        required: "กรุณากรอกอีเมล",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "รูปแบบอีเมลไม่ถูกต้อง",
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
                <Label>รหัสผ่าน</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="pl-10"
                    {...register("password", {
                      required: "กรุณากรอกรหัสผ่าน",
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
                <Label>ยืนยันรหัสผ่าน</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="pl-10"
                    {...register("confirmPassword", {
                      required: "กรุณายืนยันรหัสผ่าน",
                      validate: (value) =>
                        value === password || "รหัสผ่านไม่ตรงกัน",
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
                    กำลังสร้างบัญชี...
                  </>
                ) : (
                  "สร้างบัญชีผู้ใช้"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}