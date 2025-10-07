export interface ResearcherInfo {
    researcher_id: string;
    admin_id: string;
    researcher_prefix: string;
    researcher_academic_position: string;
    researcher_first_name: string;
    researcher_last_name: string;
    researcher_department: string;
    researcher_phone_number: string;
    researcher_email: string;
    created_at: Date;
    updated_at: Date | null;
}