import { useState, useEffect } from "react";
import { BACKEND_HOST } from "@/constant/constants";
import type { 
  CaseInfo, AssessmentTrl, IntellectualProperty, Supporter, Appointment 
} from "../../types/case";

export function useCaseData(caseId: string) {
const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [coordinator, setCoordinator] = useState<AssessmentTrl | null>(null);
  const [assessmentTrl, setAssessmentTrl] = useState<AssessmentTrl | null>(null);
  const [ip, setIP] = useState<IntellectualProperty | null>(null);
  const [supporter, setSupporter] = useState<Supporter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!caseId) return;

    setLoading(true);
    setError(null);

    const urls = [
      `${BACKEND_HOST}/trl/case/${caseId}`,
      `${BACKEND_HOST}/trl/coordinator/case/${caseId}`,
      `${BACKEND_HOST}/trl/appointment/case/${caseId}`,
      `${BACKEND_HOST}/trl/assessment_trl/case/${caseId}`,
      `${BACKEND_HOST}/trl/ip/case/${caseId}`,
      `${BACKEND_HOST}/trl/supporter/case/${caseId}`,
    ];

    Promise.all(urls.map(url => fetch(url).then(res => res.json())))
      .then(([caseRes, coordinatorRes, appointmentRes, assessmentRes, ipRes, supporterRes]) => {
        setCaseInfo(caseRes);
        setCoordinator(coordinatorRes);
        setAppointments(appointmentRes);
        setAssessmentTrl(assessmentRes);
        setIP(ipRes);
        setSupporter(supporterRes);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));

  }, [caseId]);

  return { caseInfo, coordinator, appointments, setAppointments, assessmentTrl, ip, supporter, loading, error };
}