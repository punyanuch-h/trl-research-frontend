import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Home } from "lucide-react";
import { toast } from "sonner";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";

interface HeaderProps {
  disabled?: boolean;
}

export default function Header({ disabled = false }: HeaderProps) {
  const navigate = useNavigate();
  const { data: userProfile } = useGetUserProfile();

  const handleLogout = () => {
    // if success logout then show toast success else toast error
    try {
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1
            className={`flex items-center gap-2 text-2xl font-bold text-primary ${disabled ? "" : "cursor-pointer hover:opacity-80 transition"}`}
            onClick={disabled ? undefined : () => navigate("/")}
        >
          <Home className="w-5 h-5" />
          <span>TRL Assessment Platform</span>
        </h1>


        {disabled ? (
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="" alt="User" />
              <AvatarFallback>{userProfile?.first_name.slice(0, 1)}{userProfile?.last_name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userProfile?.first_name} {userProfile?.last_name}</span>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>{userProfile?.first_name.slice(0, 1)}{userProfile?.last_name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{userProfile?.first_name} {userProfile?.last_name}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  className="justify-start text-sm w-full focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={() => navigate("/admin/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-sm w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </header>
  );
}
