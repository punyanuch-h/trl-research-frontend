import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { Download } from "lucide-react";

// ---------- Types ----------
interface TRLRecommendation {
  trlScore: number | null;
  status: string;
  reason: string | null;
  suggestion: string | null;
  sources: string[] | null;
  result?: string | null;
}

interface ResearchItem {
  id: number;
  researchTitle: string;
  researchType: string;
  description: string;
  stageOfDevelopment: string;
  currentChallenges: string;
  targetUsers: string;
  technologiesUsed: string;
  marketComparison: string;
  ipStatus: string;
  marketing: string;
  support: string;
  medicalBenefits: string;
  commercializationChallenges: string;
  devSupportNeeded: string;
  marketSupportNeeded: string;
  hasBusinessPartner: string;
  readyForShowcase: string;
  consent: string;
  trlRecommendation: TRLRecommendation;
  createdBy: string;
}

// ---------- Main Component ----------
export default function ResearcherDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const research: ResearchItem | undefined = location.state?.research;

  const display = (value: any) => {
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '-';
    return value ? value : '-';
  };

  const handleDownloadResult = (filename: string) => {
    const link = document.createElement("a");
    link.href = "#";
    link.download = filename;
    link.click();
  };

  if (!research) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <p className="text-lg text-muted-foreground">
          No research data found. Please go back and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <p className="text-muted-foreground">Submission ID: {research.id}</p>
              <h1 className="text-3xl font-bold text-foreground">{research.researchTitle}</h1>
              <p className="text-muted-foreground">Description: {research.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {research.trlRecommendation.result ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadResult(research.trlRecommendation.result ? `result_${research.researchTitle}.pdf` : `result_${research.researchTitle}.txt`)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        ) : (
                          <span className="text-muted-foreground"></span>
                        )}
          </div>
        </div>

        {/* Research Card */}
        <Card>
          <br />

          <CardContent className="space-y-6">
            {/* Research Details */}
            <Section title="Research Details">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Type:</strong> {research.researchType}</li>
                <li><strong>Stage of Development:</strong> {research.stageOfDevelopment}</li>
                <li><strong>Current Challenges:</strong> {research.currentChallenges}</li>
                <li><strong>Target Users:</strong> {research.targetUsers}</li>
              </ul>
            </Section>

            {/* Technical Details */}
            <Section title="Technical Details">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Technologies Used:</strong> {research.technologiesUsed}</li>
                <li><strong>Market Comparison:</strong> {research.marketComparison}</li>
                <li><strong>IP Status:</strong> {research.ipStatus}</li>
                <li><strong>Marketing:</strong> {research.marketing}</li>
                <li><strong>Support:</strong> {research.support}</li>
              </ul>
            </Section>

            {/* Commercial Opportunity */}
            <Section title="Commercial Opportunity">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Medical Benefits:</strong> {research.medicalBenefits}</li>
                <li><strong>Commercialization Challenges:</strong> {research.commercializationChallenges}</li>
                <li><strong>Development Support Needed:</strong> {research.devSupportNeeded}</li>
                <li><strong>Market Support Needed:</strong> {research.marketSupportNeeded}</li>
                <li><strong>Business Partner:</strong> {research.hasBusinessPartner}</li>
              </ul>
            </Section>

            {/* Innovation Showcase */}
            <Section title="Innovation Showcase">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Ready For Showcase:</strong> {research.readyForShowcase}</li>
                <li><strong>Consent:</strong> {research.consent}</li>
              </ul>
            </Section>

            {/* TRL Recommendation */}
            <Section title="TRL Recommendation">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>TRL Score:</strong> {display(research.trlRecommendation.trlScore)}</li>
                <li><strong>Status:</strong> {display(research.trlRecommendation.status)}</li>
                <li><strong>Reason:</strong> {display(research.trlRecommendation.reason)}</li>
                <li><strong>Suggestion:</strong> {display(research.trlRecommendation.suggestion)}</li>
                <li><strong>Sources:</strong> {display(research.trlRecommendation.sources)}</li>
              </ul>
            </Section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------- Reusable Components ----------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
