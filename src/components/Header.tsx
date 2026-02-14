import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, User, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getUserRole } from "@/lib/auth";
import { LanguageSwitch } from "@/components/LanguageSwitch";

import { Home } from "lucide-react";
import { toast } from "@/lib/toast";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { NotificationIcon } from "@/components/notifications/NotificationIcon";

interface HeaderProps {
  disabled?: boolean;
}

export default function Header({ disabled = false }: HeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const role = getUserRole();
  const { data: userProfile } = useGetUserProfile();

  const handleLogout = () => {
    if (!navigator.onLine) {
      toast.error(t("auth.logoutInternetError"));
      localStorage.setItem("pendingLogout", "true");
      return;
    }

    try {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("pendingLogout");
      toast.success(t("auth.logoutSuccess"));
      navigate("/");
    } catch {
      toast.error(t("auth.logoutError"));
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
          <span>{t("header.appTitle")}</span>
        </h1>

        <div className="flex items-center gap-3">
          <LanguageSwitch />
          {!disabled && <NotificationIcon />}

          {disabled ? (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>{userProfile?.first_name?.slice(0, 1)}{userProfile?.last_name.slice(0, 1)}</AvatarFallback>
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
              <PopoverContent className="w-auto inline-block p-2 mr-4">
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    className="justify-start text-sm w-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t("header.accountInfo")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-sm w-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    onClick={() => navigate("/reset-password")}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    {t("header.changePassword")}
                  </Button>
                  {role === "admin" && (
                    <Button
                      variant="ghost"
                      className="justify-start text-sm w-full focus-visible:ring-0 focus-visible:ring-offset-0"
                      onClick={() => navigate("/admin/create-admin")}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t("header.addAdminAccount")}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="justify-start text-sm w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("header.logout")}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
}
