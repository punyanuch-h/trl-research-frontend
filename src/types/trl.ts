export interface TRLRecommendation {
  trlScore?: number;
  status: boolean;
  reason?: string;
  suggestion?: string;
  sources?: string[];
  result?: string;
  aiEstimate?: string;
}

export interface TRLItem {
    id: number;
    research_id: string;
    createdAt: string;

    // Step 1: TRL Type
    
    // Step 2: Research Details
    researchTitle: string;
    researchType: string;
    description: string;
    keyword?: string;
    stageOfDevelopment: string;
    currentChallenges: string;
    targetUsers: string;

    // Step 3: Technical Details
    technologiesUsed: string;
    marketComparison: string;
    ipStatus: string;
    marketing: string;
    support: string;

    // Step 4: Commercial Opportunity
    medicalBenefits: string;
    commercializationChallenges: string;
    devSupportNeeded: string;
    marketSupportNeeded: string;
    hasBusinessPartner: string;

    // Step 5: Innovation Showcase
    supportDevNeeded: string[];
    supportMarketNeeded: string[];

    // Not used in form
    readyForShowcase: string;
    consent: string;

    // TRL level recommendation
    trlRecommendation?: TRLRecommendation;

    // Urgent case
    isUrgent: boolean;
    urgentReason?: string;
    urgentFeedback?: string;

    // Created By
    createdBy: string;

    // Appointment
    appointments?: Appointment[];
}

export interface Appointment {
  id: number;
  research_id: string;
  date: string;
  location: string;
  attendees: {
    email: string;
    name: string;
  }[];
  status: "attended" | "absent" | "pending";
  summary?: string;
  notes?: string;
}