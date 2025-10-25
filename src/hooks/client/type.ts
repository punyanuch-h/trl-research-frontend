export type LoginResponse = {
    token: string;
    expires_in: number; // in hours (1 week)
    role: string;
};   

export type CaseResponse = {
    case_id: string;
    researcher_id: string;
    coordinator_email: string;
    trl_score: string; // or number if always numeric
    trl_suggestion: string;
    status: boolean;
    is_urgent: boolean;
    urgent_reason: string;
    urgent_feedback: string;
    case_title: string;
    case_type: string;
    case_description: string;
    case_keywords: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
};

export type AssessmentResponse = {
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
    cq1_answer: string[];
    cq2_answer: string[];
    cq3_answer: string[];
    cq4_answer: string[];
    cq5_answer: string[];
    cq6_answer: string[];
    cq7_answer: string[];
    cq8_answer: string[];
    cq9_answer: string[];
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
};

export type AppointmentResponse = {
    appointment_id: string;
    case_id: string;
    date: string;
    status: string;
    location: string;
    note: string;
    summary: string;
    created_at: string;
    updated_at: string;
};
  
export type IntellectualPropertyResponse = {
    id: string;
    case_id: string;
    ip_types: string;
    ip_protection_status: string;
    ip_request_number: string;
    created_at: string;
    updated_at: string;
};

export type CoordinatorResponse = {
    coordinator_id: string;
    case_id: string;
    coordinator_email: string;
    coordinator_name: string;
    coordinator_phone: string;
    department: string;
    created_at: string;
    updated_at: string;
};
  
export type SupporterResponse = {
    supporter_id: string;
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
    created_at: string;
    updated_at: string;
};
  
export type ResearcherResponse = {
    researcher_id: string;
    admin_id: string;
    researcher_prefix: string;
    researcher_academic_position: string;
    researcher_first_name: string;
    researcher_last_name: string;
    researcher_department: string;
    researcher_phone_number: string;
    researcher_email: string;
    created_at: string;
    updated_at: string;
};

export type UserProfileResponse = {
	prefix:           string;
	academic_position: string;
	first_name: string;
	last_name: string;
	department: string;
	phone_number: string;
	email: string;
};