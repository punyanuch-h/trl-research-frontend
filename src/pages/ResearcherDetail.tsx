import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

interface ResearchItem {
  id: number;
  name: string;
  type: string;
  trlScore: string;
  status: string;
  result: string | null;
  description?: string;
}

export default function ResearcherDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const research: ResearchItem | undefined = location.state?.research;

  if (!research) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <p className="text-lg text-muted-foreground">No research data found. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{research.name}</CardTitle>
            <p className="text-muted-foreground mt-1">Submission ID: {research.id}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Type</h3>
              <p>{research.type}</p>
            </div>
            <div>
              <h3 className="font-semibold">TRL Score</h3>
              <p>{research.trlScore}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{research.status}</p>
            </div>
            {research.result && (
              <div>
                <h3 className="font-semibold">Result</h3>
                <a
                  href="#"
                  className="text-blue-600 underline"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "#";
                    link.download = research.result!;
                    link.click();
                  }}
                >
                  Download {research.result}
                </a>
              </div>
            )}
            {research.description && (
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{research.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
