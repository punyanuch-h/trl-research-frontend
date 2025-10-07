// STEP 1+2:  Case Info
export interface CaseInfo {
  CaseID: string;
  ResearcherID: string;
  CoordinatorEmail
  TrlScore: string;
  Status: boolean;
  IsUrgent: boolean;
  UrgentReason?: string;
  UrgentFeedback?: string;
  CaseTitle: string;
  CaseType: string;
  CaseDescription: string;
  CaseKeywords: string;
  CreatedAt: string;
  UpdatedAt?: string;
}
// STEP 3: Research Assessment TRL
export interface AssessmentTrl {
  id: string;
  CaseID: string;
  TrlLevelResult: number;
  Rq1Answer: boolean;
  Rq2Answer: boolean;
  Rq3Answer: boolean;
  Rq4Answer: boolean;
  Rq5Answer: boolean;
  Rq6Answer: boolean;
  Rq7Answer: boolean;
  Cq1Answer?: string;
  Cq2Answer?: string;
  Cq3Answer?: string;
  Cq4Answer?: string;
  Cq5Answer?: string;
  Cq6Answer?: string;
  Cq7Answer?: string;
  Cq8Answer?: string;
  Cq9Answer?: string;
}
// STEP 4: Intellectual Property
export interface IntellectualProperty {
  id: string;
  CaseID: string;
  HasIP: boolean;
  IPTypes?: 'สิทธิบัตร' | 'อนุสิทธิบัตร' | 'สิทธิบัตรออกแบบผลิตภัณฑ์' | 'ลิขสิทธิ์' | 'เครื่องหมายการค้า' | 'ความลับทางการค้า';
  IPProtectionStatus?: 'ได้เลขที่คำขอแล้ว' | 'กำลังดำเนินการ';
  IPRequestNumber?: string;
}
// STEP 5: Supporter
export interface Supporter {
  SupporterID: string;
  CaseID: string;
  SupportResearch: boolean;
  SupportVDC: boolean;
  SupportSiEIC: boolean;
  NeedProtectIntellectualProperty: boolean;
  NeedCoDevelopers: boolean;
  NeedActivities: boolean;
  NeedTest: boolean;
  NeedCapital: boolean;
  NeedPartners: boolean;
  NeedGuidelines: boolean;
  NeedCertification: boolean;
  NeedAccount: boolean;
  Need: string;
  AdditionalDocuments: string;
}

export interface TRLRecommendation {
  trlScore?: number;
  status: boolean;
  reason?: string;
  suggestion?: string;
  sources?: string[];
  result?: string;
  aiEstimate?: string;
}

export interface Appointment {
  id: number;
  CaseID: string;
  date: string;
  location: string;
  status: "attended" | "absent" | "pending";
  summary?: string;
  notes?: string;
}