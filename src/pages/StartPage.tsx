import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Search } from "lucide-react";
import { getUserRole, isAuthenticated } from "@/lib/auth"; // ✅ import helper

export default function StartPage() {
  const navigate = useNavigate();

  const handleLogin = (target: "admin" | "researcher") => {
    // ✅ ถ้ายังไม่ได้ login -> ไปหน้า login
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // ✅ ถ้า login แล้ว ให้เช็ก role
    const role = getUserRole();
    if (role === "admin" && target === "admin") {
      navigate("/admin-homepage");
    } else if (role === "researcher" && target === "researcher") {
      navigate("/researcher-dashboard");
    } else {
      // role mismatch → logout แล้วให้ login ใหม่
      localStorage.removeItem("auth_token");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">TRL Assessment Platform</h1>
          <p className="text-xl text-muted-foreground">Technology Readiness Level Evaluation System</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Researcher */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleLogin("researcher")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Researcher</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Access your research dashboard to manage and submit TRL assessments.
              </p>
              <Button className="w-full" size="lg">
                Login as Researcher
              </Button>
            </CardContent>
          </Card>

          {/* Admin */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleLogin("admin")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Access your research dashboard to manage and review TRL assessments.
              </p>
              <Button className="w-full" size="lg">
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
