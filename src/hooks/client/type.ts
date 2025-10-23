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
  