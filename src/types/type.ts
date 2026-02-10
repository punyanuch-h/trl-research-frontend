export type LoginResponse = {
    token: string;
    expires_in: number; // in hours (1 week)
    role: string;
};

export type CaseResponse = {
    id: string;
    researcher_id: string;
    coordinator_id: string;
    title: string;
    type: string;
    description: string;
    keywords: string;
    attachments?: string[];
    trl_score: number;
    trl_suggestion: string;
    status: boolean;
    is_urgent: boolean;
    urgent_reason: string;
    urgent_feedback: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
};

export type AssessmentResponse = {
    id: string;
    case_id: string;
    trl_estimate: number;
    rq1_answer: boolean;
    rq2_answer: boolean;
    rq3_answer: boolean;
    rq4_answer: boolean;
    rq5_answer: boolean;
    rq6_answer: boolean;
    rq7_answer: boolean;
    rq1_attachments: string[];
    rq2_attachments: string[];
    rq3_attachments: string[];
    rq4_attachments: string[];
    rq5_attachments: string[];
    rq6_attachments: string[];
    rq7_attachments: string[];
    cq1_answer: string[];
    cq2_answer: string[];
    cq3_answer: string[];
    cq4_answer: string[];
    cq5_answer: string[];
    cq6_answer: string[];
    cq7_answer: string[];
    cq8_answer: string[];
    cq9_answer: string[];
    cq1_attachments: string[];
    cq2_attachments: string[];
    cq3_attachments: string[];
    cq4_attachments: string[];
    cq5_attachments: string[];
    cq6_attachments: string[];
    cq7_attachments: string[];
    cq8_attachments: string[];
    cq9_attachments: string[];
    improvement_suggestion: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
};

export type AppointmentResponse = {
    id: string;
    case_id: string;
    case?: CaseResponse;
    date: string;
    status: string;
    location: string;
    detail: string;
    summary: string;
    is_read: boolean;
    is_notify: boolean;
    created_at: string;
    updated_at: string;
};

export type IntellectualPropertyResponse = {
    id: string;
    case_id: string;
    types: string;
    protection_status: string;
    request_number: string;
    attachments?: string[];
    created_at: string;
    updated_at: string;
};

export type CoordinatorResponse = {
    id: string;
    prefix: string;
    academic_position: string;
    first_name: string;
    last_name: string;
    department: string;
    phone_number: string;
    email: string;
    created_at: string;
    updated_at: string;
};

export type SupportmentResponse = {
    id: string;
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
    id: string;
    prefix: string;
    academic_position: string;
    first_name: string;
    last_name: string;
    department: string;
    phone_number: string;
    email: string;
    created_at: string;
    updated_at: string;
};

export type UserProfileResponse = {
    id: string;
    prefix: string;
    academic_position: string;
    first_name: string;
    last_name: string;
    department: string;
    phone_number: string;
    email: string;
};

export interface FileResponse {
    id: string;
    file_name: string;
    file_path?: string;
    created_at?: string;
}

export type PostResearcherData = {
    prefix: string;
    academic_position: string | null;
    first_name: string;
    last_name: string;
    department: string;
    phone_number: string;
    email: string;
    password: string;
};

export type PostAdminData = {
    prefix: string;
    academic_position: string | null;
    first_name: string;
    last_name: string;
    department: string;
    phone_number: string;
    email: string;
    password: string;
};

export type AddAppointmentData = {
    case_id: string;
    date: string;
    status: "pending" | string;
    location?: string;
    detail?: string;
    [key: string]: string | boolean | number | undefined;
};

export type NotificationListResponse = {
    data: AppointmentResponse[];
    unread_count: number;
};
