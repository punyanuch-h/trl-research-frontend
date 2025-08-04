export interface TRLRecommendation {
  trlScore?: number;
  status?: string;
  reason?: string;
  suggestion?: string;
  sources?: string[];
  result?: string;
  aiEstimate?: string;
}

export interface TRLItem {
    id: number;
    createdAt: string;

    // Step 1: TRL Type
    researchType: string;
    
    // Step 2: Research Details
    researchTitle: string;
    description: string;
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
    readyForShowcase: string;
    consent: string;

    // TRL level recommendation
    trlRecommendation?: TRLRecommendation;

    // Created By
    createdBy: string;
}
