import { useMemo } from "react";

interface Case {
  id: string;
  status: boolean;
  is_urgent: boolean;
  trl_score: string | number;
  type?: string;
  title?: string;
  researcher_id: string;
}

interface Researcher {
  id: string;
  first_name?: string;
  last_name?: string;
}

interface Appointment {
  id: string;
  status: string;
  date: string;
  case_id: string;
}

interface IntellectualProperty {
  types?: string;
}

interface Supportment {
  [key: string]: boolean | string | number | null | undefined;
}

interface Assessment {
  id: string;
  trl_estimate: number | string;
}

interface UseDashboardStatsProps {
  allCases: Case[];
  allResearchers: Researcher[];
  allAppointments: Appointment[];
  allIntellectualProperties: IntellectualProperty[];
  allSupportments: Supportment[];
  allAssessments: Assessment[];
  colors: string[];
}

export function useDashboardStats({
  allCases,
  allResearchers,
  allAppointments,
  allIntellectualProperties,
  allSupportments,
  allAssessments,
  colors,
}: UseDashboardStatsProps) {
  return useMemo(() => {
    const total = allCases.length;
    const pending = allCases.filter((c) => c.status === false).length;
    const urgent = allCases.filter((c) => c.is_urgent).length;

    // TRL calculations
    const trlScores = allCases
      .map((c) => parseFloat(String(c.trl_score)))
      .filter((v) => !isNaN(v));
    const avgTRL =
      trlScores.length > 0
        ? (trlScores.reduce((a, b) => a + b, 0) / trlScores.length).toFixed(1)
        : "0";

    // TRL Real Distribution (based on case trl_score)
    const trlRealDistribution = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((level, index) => ({
      level: `TRL ${level}`,
      count: allCases.filter(
        (c) => Math.floor(parseFloat(String(c.trl_score))) === level
      ).length,
      fill: colors[index % colors.length],
    }));

    // TRL Estimate Distribution (based on assessment trl_estimate)
    const trlEstimateDistribution = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((level, index) => ({
      level: `TRL ${level}`,
      count: allAssessments.filter(
        (a) => Math.floor(parseFloat(String(a.trl_estimate))) === level
      ).length,
      fill: colors[index % colors.length],
    }));

    // Case types
    const typeCounts: Record<string, number> = {};
    allCases.forEach((c) => {
      const t = c.type || "Unspecified";
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    const caseTypeData = Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const statusData = [
      { name: "กำลังประเมิน", value: pending },
      { name: "ผ่านการประเมิน", value: total - pending },
      { name: "เร่งด่วน", value: urgent },
    ];

    // Intellectual Property
    const ipCounts: Record<string, number> = {};
    allIntellectualProperties.forEach((ip) => {
      const t = ip.types || "Unspecified";
      ipCounts[t] = (ipCounts[t] || 0) + 1;
    });
    const ipData = Object.entries(ipCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Supportment data with labels defined here
    const agencyLabels: Record<string, string> = {
      support_research: "ฝ่ายวิจัย",
      support_vdc: "VDC",
      support_sieic: "SiEIC",
    };

    const needLabels: Record<string, string> = {
      need_protect_intellectual_property: "การคุ้มครองทรัพย์สินทางปัญญา",
      need_co_developers: "ผู้ร่วมพัฒนา",
      need_activities: "กิจกรรมสนับสนุน",
      need_test: "การทดสอบ",
      need_capital: "เงินทุนสนับสนุน",
      need_partners: "พันธมิตร",
      need_guidelines: "แนวทาง/คำปรึกษา",
      need_certification: "การรับรองมาตรฐาน",
      need_account: "บัญชีผลประโยชน์",
    };

    const agencyData = Object.entries(agencyLabels)
      .map(([key, label]) => ({
        name: label,
        value: allSupportments.filter((s) => s[key] === true).length,
      }))
      .sort((a, b) => b.value - a.value);

    const neededSupportData = Object.entries(needLabels)
      .map(([key, label]) => ({
        name: label,
        value: allSupportments.filter((s) => s[key] === true).length,
      }))
      .sort((a, b) => b.value - a.value);

    // Researchers
    const topResearchers = Object.entries(
      allCases.reduce((acc: Record<string, number>, c) => {
        acc[c.researcher_id] = (acc[c.researcher_id] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => {
        const r = allResearchers.find((x) => x.id === id);
        const displayName = r
          ? `${r.first_name || ""} ${r.last_name || ""}`.trim()
          : "";
        return {
          id,
          name: displayName || id,
          count: count as number,
        };
      });

    // Appointments summary
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const attended = allAppointments.filter((a) => a.status === "attended").length;
    const absent = allAppointments.filter((a) => a.status === "absent").length;
    const upcoming = allAppointments
      .filter((a) => a.status === "pending")
      .map((a) => {
        const c = allCases.find((caseItem) => caseItem.id === a.case_id);
        return {
          id: a.id,
          case_title: c ? c.title || "Unknown Case" : "Unknown Case",
          date: a.date,
        };
      });

    return {
      total,
      pending,
      urgent,
      avgTRL,
      trlRealDistribution,
      trlEstimateDistribution,
      caseTypeData,
      statusData,
      ipData,
      agencyData,
      neededSupportData,
      topResearchers,
      attended,
      absent,
      upcoming,
    };
  }, [
    allCases,
    allResearchers,
    allAppointments,
    allIntellectualProperties,
    allSupportments,
    allAssessments,
    colors,
  ]);
}