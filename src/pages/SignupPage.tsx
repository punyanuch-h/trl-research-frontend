import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { GraduationCap, Loader2, User, Lock, Mail, Phone, Building } from "lucide-react";
import { usePostResearcher } from "@/hooks/researcher/post/usePostResearcher";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prefix: "",
    academic_position: "",
    first_name: "",
    last_name: "",
    department: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    api: "",
  });

  const { postResearcher, loading } = usePostResearcher(() => {
    navigate("/login");
  });

  const validatePassword = (password: string) => {
    if (password.length < 6) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    if (!/[A-Z]/.test(password)) return "ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว";
    if (!/[0-9]/.test(password)) return "ต้องมีตัวเลขอย่างน้อย 1 ตัว";
    return "";
  };

  const handleSignup = async () => {
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError =
      formData.password !== formData.confirmPassword ? "รหัสผ่านไม่ตรงกัน" : "";

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
        api: "",
      });
      return;
    }

    try {
      const payload = {
        prefix: formData.prefix,
        academic_position: formData.academic_position,
        first_name: formData.first_name,
        last_name: formData.last_name,
        department: formData.department,
        phone_number: formData.phone_number,
        email: formData.email,
        password: formData.password,
      };

      await postResearcher(payload);
    } catch (err: any) {
      setErrors({
        ...errors,
        api: err.message || "สมัครสมาชิกไม่สำเร็จ",
      });
    }
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
            <CardTitle className="text-center text-2xl">สมัครสมาชิก</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prefix */}
                <div>
                  <Label>คำนำหน้า</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Select
                      value={formData.prefix}
                      onValueChange={(value) =>
                        setFormData({ ...formData, prefix: value })
                      }
                      required
                    >
                      <SelectTrigger className="w-full pl-10">
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
                  </div>
                </div>

                {/* Academic Position */}
                <div>
                  <Label>ตำแหน่งทางวิชาการ</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Select
                        value={formData.academic_position}
                        onValueChange={(value) =>
                          setFormData({ ...formData, academic_position: value })
                        }
                        required
                      >
                      <SelectTrigger className="w-full pl-10">
                          <SelectValue placeholder="ตำแหน่งทางวิชาการ" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value={null}>ไม่มี</SelectItem>
                          <SelectItem value="อ.">อ.</SelectItem>
                          <SelectItem value="ผศ.">ผศ.</SelectItem>
                          <SelectItem value="รศ.">รศ.</SelectItem>
                          <SelectItem value="ศ.">ศ.</SelectItem>
                      </SelectContent>
                      </Select>
                  </div>
                </div>
              </div>
              {/* First Name */}
              <div>
                <Label>ชื่อ</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="ชื่อ"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <Label>นามสกุล</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="นามสกุล"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <Label>ภาควิชา / สถาน / หน่วยงาน</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="เช่น ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <Label>เบอร์โทรศัพท์</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="0xxxxxxxxx"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone_number: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label>อีเมล</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label>รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10 pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label>ยืนยันรหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10 pr-10"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* API Error */}
              {errors.api && (
                <p className="text-sm text-destructive text-center">
                  {errors.api}
                </p>
              )}

              {/* Submit */}
              <Button className="w-full" onClick={handleSignup} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังสมัครสมาชิก...
                  </>
                ) : (
                  "สมัครสมาชิก"
                )}
              </Button>

              {/* Login link */}
              <p className="text-sm text-center text-muted-foreground">
                มีบัญชีแล้ว?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-primary cursor-pointer hover:underline"
                >
                  เข้าสู่ระบบ
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}