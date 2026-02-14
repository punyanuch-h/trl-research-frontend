import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setLang, type Lang } from "@/lib/i18n";

export function LanguageSwitch() {
  const { i18n } = useTranslation();

  const currentLang = (i18n.language?.startsWith("en") ? "en" : "th") as Lang;

  const toggleLang = () => {
    const newLang: Lang = currentLang === "th" ? "en" : "th";
    setLang(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLang}
      className="flex items-center gap-2 px-3"
      aria-label={`Switch to ${currentLang === "th" ? "English" : "Thai"}`}
    >
      <Globe className="w-4 h-4" />
      {currentLang === "th" ? "TH" : "EN"}
    </Button>
  );
}
