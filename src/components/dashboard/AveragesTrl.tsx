import { useTranslation } from "react-i18next";

interface AveragesCardProps {
  avgTRL: string;
  pendingRatio: number;
  urgentRatio: number;
}

export function AveragesCard({ avgTRL, pendingRatio, urgentRatio }: AveragesCardProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-5 border border-gray-100 rounded-lg">
      <h3 className="font-semibold mb-3 text-sm">{t("dashboard.averageLabel")}</h3>
      <div className="space-y-2 text-sm">
        <p>
          {t("dashboard.avgTrlLabel")}{" "}
          <span className="font-semibold text-blue-600">{avgTRL}</span>
        </p>
        <p>{t("dashboard.pendingRatioLabel")} {pendingRatio.toFixed(1)}%</p>
        <p>{t("dashboard.urgentRatioLabel")} {urgentRatio.toFixed(1)}%</p>
      </div>
    </div>
  );
}