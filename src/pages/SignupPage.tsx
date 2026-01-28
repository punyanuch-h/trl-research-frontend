import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { usePostResearcher } from "@/hooks/researcher/post/usePostResearcher";

type SignupFormValues = {
  prefix: string;
  academic_position: string | null;
  first_name: string;
  last_name: string;
  department: string;
  phone_number: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<SignupFormValues>({
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

  const { postResearcher, loading } = usePostResearcher(() => {
    navigate("/login");
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await postResearcher({
        prefix: data.prefix,
        academic_position: data.academic_position,
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto px-6 mt-8 mb-32">
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
            <CardTitle className="text-center text-2xl">ลงทะเบียน</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Controller
                      control={control}
                      name="academic_position"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? "none"}
                          onValueChange={(val) => field.onChange(val === "none" ? null : val)}
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
                          </SelectContent>
                        </Select>
                      )}
                    />
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
              {/* Phone */}
              <div>
                <Label>เบอร์โทรศัพท์</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
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
              {/* Password */}
              <div>
                <Label>รหัสผ่าน</Label><span className="text-red-500">*</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    className="pl-10"
                    {...register("password", {
                      required: "กรุณากรอกรหัสผ่าน",
                      minLength: {
                        value: 6,
                        message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d).+$/,
                        message:
                          "ต้องมีตัวอักษรพิมพ์ใหญ่ และตัวเลขอย่างน้อย 1 ตัว",
                      },
                    })}
                  />
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
                    type="password"
                    className="pl-10"
                    {...register("confirmPassword", {
                      required: "กรุณายืนยันรหัสผ่าน",
                      validate: (value) =>
                        value === password || "รหัสผ่านไม่ตรงกัน",
                    })}
                  />
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
                    กำลังลงทะเบียน...
                  </>
                ) : (
                  "ลงทะเบียน"
                )}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-4">
              มีบัญชีอยู่แล้ว?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-primary cursor-pointer hover:underline"
              >
                เข้าสู่ระบบ
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}