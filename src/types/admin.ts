export interface AdminInfo {
    admin_id: string;
    admin_prefix: string;
    admin_academic_position: string;
    admin_first_name: string;
    admin_last_name: string;
    admin_department: string;
    admin_phone_number: string;
    admin_email: string;
    admin_password: string;
    case_id: string;
    created_at: Date;
    updated_at: Date | null;
}