import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Download, Award, TrendingUp, CheckCircle } from "lucide-react";

export default function CompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const researchName = searchParams.get('research') || 'Research Project';

  // Calculate final score (this would come from your state management)
  const scores = [100, 100, 100, 100, 100, 100, 100, 100, 100]; // Example: all steps completed
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const maxScore = 900; // 9 steps × 100 points each
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Determine TRL level based on score
  const getTRLLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 9, name: "TRL 9 - System Proven" };
    if (percentage >= 80) return { level: 8, name: "TRL 8 - System Complete" };
    if (percentage >= 70) return { level: 7, name: "TRL 7 - System Prototype" };
    if (percentage >= 60) return { level: 6, name: "TRL 6 - Technology Demonstrated" };
    if (percentage >= 50) return { level: 5, name: "TRL 5 - Technology Validated" };
    if (percentage >= 40) return { level: 4, name: "TRL 4 - Technology Validated in Lab" };
    if (percentage >= 30) return { level: 3, name: "TRL 3 - Experimental Proof of Concept" };
    if (percentage >= 20) return { level: 2, name: "TRL 2 - Technology Concept Formulated" };
    return { level: 1, name: "TRL 1 - Basic Principles Observed" };
  };

  const trlResult = getTRLLevel(percentage);

  const getLevelColor = (level: number) => {
    if (level >= 8) return "bg-green-100 text-green-800";
    if (level >= 6) return "bg-blue-100 text-blue-800";
    if (level >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getReasons = (level: number) => {
    const reasons = [];
    if (level >= 8) {
      reasons.push("Comprehensive documentation completed");
      reasons.push("Operational environment validation successful");
      reasons.push("All performance metrics achieved");
    } else if (level >= 6) {
      reasons.push("Core technology demonstrated successfully");
      reasons.push("Key elements validated in relevant environment");
      reasons.push("Performance benchmarks met");
    } else if (level >= 4) {
      reasons.push("Laboratory validation completed");
      reasons.push("Basic functionality demonstrated");
      reasons.push("Proof of concept established");
    } else {
      reasons.push("Basic principles identified");
      reasons.push("Initial research phase completed");
      reasons.push("Foundational work established");
    }
    return reasons;
  };

  const getSuggestions = (level: number) => {
    const suggestions = [];
    if (level < 9) {
      suggestions.push("Complete comprehensive operational testing");
      suggestions.push("Finalize all documentation and procedures");
      suggestions.push("Conduct final performance validation");
    }
    if (level < 7) {
      suggestions.push("Enhance system integration testing");
      suggestions.push("Validate performance in operational environment");
      suggestions.push("Complete scalability assessments");
    }
    if (level < 5) {
      suggestions.push("Expand laboratory testing scope");
      suggestions.push("Develop more comprehensive prototypes");
      suggestions.push("Strengthen experimental validation");
    }
    if (level < 3) {
      suggestions.push("Develop more detailed proof of concept");
      suggestions.push("Expand analytical demonstrations");
      suggestions.push("Strengthen theoretical foundations");
    }
    return suggestions;
  };

  const handleDownloadReport = () => {
    // Generate and download report
    const reportContent = `
TRL Assessment Report
=====================

Research Project: ${researchName}
Assessment Date: ${new Date().toLocaleDateString()}

FINAL RESULTS
=============
Total Score: ${totalScore}/${maxScore} (${percentage}%)
TRL Level: ${trlResult.name}

ASSESSMENT BREAKDOWN
===================
${scores.map((score, index) => `TRL ${index + 1}: ${score}/100`).join('\n')}

STRENGTHS
=========
${getReasons(trlResult.level).map(reason => `• ${reason}`).join('\n')}

RECOMMENDATIONS
===============
${getSuggestions(trlResult.level).map(suggestion => `• ${suggestion}`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TRL_Assessment_Report_${researchName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Assessment Complete!</h1>
          <p className="text-lg text-muted-foreground">{researchName}</p>
        </div>

        <div className="grid gap-6">
          {/* Final Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Final Assessment Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{totalScore}/{maxScore}</div>
                <div className="text-lg text-muted-foreground mb-4">Overall Score ({percentage}%)</div>
                <Badge className={`text-lg px-4 py-2 ${getLevelColor(trlResult.level)}`}>
                  {trlResult.name}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>TRL Score Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {scores.map((score, index) => (
                  <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium">TRL {index + 1}</div>
                    <div className="text-2xl font-bold text-primary">{score}/100</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Strengths Identified</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {getReasons(trlResult.level).map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {getSuggestions(trlResult.level).map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button onClick={handleDownloadReport} size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} size="lg">
              New Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}