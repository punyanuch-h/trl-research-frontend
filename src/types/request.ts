import { CaseResponse, AssessmentResponse, CoordinatorResponse, SupportmentResponse } from "./type";

export interface IpFormRequest {
    noIp?: boolean;
    ipTypes: string[];
    ipStatus: string;
    requestNumbers: Record<string, string>;
    file?: File | null;
}

export interface SubmitResearcherFormRequest {
    id: string;

    // researcher
    headPrefix: string;
    headAcademicPosition: string;
    headAcademicPositionOther: string;
    headFirstName: string;
    headLastName: string;
    headDepartment: string;
    headPhoneNumber: string;
    headEmail: string;

    // coordinator
    sameAsHead: boolean;
    coordinatorPrefix: string;
    coordinatorAcademicPosition: string;
    coordinatorAcademicPositionOther: string;
    coordinatorFirstName: string;
    coordinatorLastName: string;
    coordinatorDepartment: string;
    coordinatorPhoneNumber: string;
    coordinatorEmail: string;

    // case
    researcherId: string;
    trlScore: number | null;
    status: boolean;
    isUrgent: boolean;
    urgentReason: string;
    urgentFeedback: string;
    researchTitle: string;
    researchType: string;
    description: string;
    keywords: string;
    researchDetailsFiles: File[];

    // TRL evaluate
    trlLevelResult: number | null;

    // RQ
    rq1_answer: boolean;
    rq2_answer: boolean;
    rq3_answer: boolean;
    rq4_answer: boolean;
    rq5_answer: boolean;
    rq6_answer: boolean;
    rq7_answer: boolean;

    // CQ
    cq1_answer: string[];
    cq2_answer: string[];
    cq3_answer: string[];
    cq4_answer: string[];
    cq5_answer: string[];
    cq6_answer: string[];
    cq7_answer: string[];
    cq8_answer: string[];
    cq9_answer: string[];

    assessmentFiles: Record<string, File | null>;

    // IP
    ipHas: boolean;
    ipForms: IpFormRequest[];

    // support
    supportDevNeeded: string[];
    supportMarketNeeded: string[];
    businessPartner: string;
    readyForShowcase: string;
    consent: string;
    otherSupportMarket: string;
}

export interface SubmitResearcherFormResponse {
    case: CaseResponse;
    coordinator: CoordinatorResponse;
    assessment: AssessmentResponse;
    supportment: SupportmentResponse;
}
