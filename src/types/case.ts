// STEP 1+2:  Case Info
export interface CaseInfo {
  case_id: string;
  researcher_id: string;
  coordinator_email : string;
  trl_score: string;
  status: boolean;
  trl_suggestion?: string;
  is_urgent: boolean;
  urgent_reason?: string;
  urgent_feedback?: string;
  case_title: string;
  case_type: string;
  case_description: string;
  case_keywords: string;
  created_at: string;
  updated_at?: string;
}
// STEP 3: Research Assessment TRL
export interface AssessmentTrl {
  id: string;
  case_id: string;
  trl_level_result: number;
  rq1_answer: boolean;
  rq2_answer: boolean;
  rq3_answer: boolean;
  rq4_answer: boolean;
  rq5_answer: boolean;
  rq6_answer: boolean;
  rq7_answer: boolean;
  cq1_answer?: string;
  cq2_answer?: string;
  cq3_answer?: string;
  cq4_answer?: string;
  cq5_answer?: string;
  cq6_answer?: string;
  cq7_answer?: string;
  cq8_answer?: string;
  cq9_answer?: string;
}
// STEP 4: Intellectual Property
export interface IntellectualProperty {
  id: string;
  case_id: string;
  hasIP: boolean;
  ip_types?: 'สิทธิบัตร' | 'อนุสิทธิบัตร' | 'สิทธิบัตรออกแบบผลิตภัณฑ์' | 'ลิขสิทธิ์' | 'เครื่องหมายการค้า' | 'ความลับทางการค้า';
  ip_protection_status?: 'ได้เลขที่คำขอแล้ว' | 'กำลังดำเนินการ';
  ip_request_number?: string;
}
// STEP 5: Supporter
export interface Supporter {
  SupporterID: string;
  case_id: string;
  support_research: boolean;
  support_vdc: boolean;
  support_sieic: boolean;
  need_protect_intellectual_property: boolean;
  need_co_developers: boolean;
  need_activities: boolean;
  need_test: boolean;
  need_capital: boolean;
  need_partners: boolean;
  need_guidelines: boolean;
  need_certification: boolean;
  need_account: boolean;
  need: string;
  additional_documents: string;
}

export interface Appointment {
  id: number;
  case_id: string;
  date: string;
  location: string;
  status: "attended" | "absent" | "pending";
  summary?: string;
  notes?: string;
}