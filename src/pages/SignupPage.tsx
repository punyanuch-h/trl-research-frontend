import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "",
    organization: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password: string) => {
    if (password.length < 6) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    if (!/[A-Z]/.test(password)) return "ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว";
    if (!/[0-9]/.test(password)) return "ต้องมีตัวเลขอย่างน้อย 1 ตัว";
    return "";
  };

  const handleSignup = () => {
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError =
      formData.password !== formData.confirmPassword ? "รหัสผ่านไม่ตรงกัน" : "";

    if (passwordError || confirmPasswordError) {
      setErrors({ password: passwordError, confirmPassword: confirmPasswordError });
      return;
    }

    // ล้าง error และดำเนินการสมัคร
    setErrors({ password: "", confirmPassword: "" });
    console.log("Sign up with", formData);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
            />
            <Input
              placeholder="Lastname"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            {/* <div className="space-y-1.5">
                <label htmlFor="role" className="text-sm font-medium">
                    Role
                </label> */}
                <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                    required
                >
                    <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="role" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="student">นักศึกษา</SelectItem>
                    <SelectItem value="อาจารย์แพทย์">อาจารย์แพทย์</SelectItem>
                    <SelectItem value="พยาบาล">พยาบาล</SelectItem>
                    <SelectItem value="นักวิจัย">นักวิจัย</SelectItem>
                    <SelectItem value="พนักงาน">พนักงาน</SelectItem>
                    </SelectContent>
                </Select>
                {/* </div> */}
            <Input
              placeholder="Organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              required
            />
            {/* Password */}
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>
            {/* Confirm Password */}
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button className="w-full" onClick={handleSignup}>
              Sign Up
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-primary cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}