import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Globe, Users, Shield } from "lucide-react";
import { useState } from "react";

export default function Step6() {
  const [checklist, setChecklist] = useState({
    relevantEnvironment: false,
    stakeholderValidation: false,
    realWorldTesting: false,
    userAcceptance: false,
    performanceValidation: false
  });

  const checklistItems = [
    { key: 'relevantEnvironment', label: 'Relevant operational environment established', score: 20 },
    { key: 'stakeholderValidation', label: 'Key stakeholder validation completed', score: 20 },
    { key: 'realWorldTesting', label: 'Real-world testing scenarios executed', score: 20 },
    { key: 'userAcceptance', label: 'User acceptance criteria met', score: 20 },
    { key: 'performanceValidation', label: 'Performance benchmarks validated', score: 20 }
  ];

  const currentScore = checklistItems.reduce((sum, item) => 
    sum + (checklist[item.key as keyof typeof checklist] ? item.score : 0), 0
  );
  const totalPossibleScore = checklistItems.reduce((sum, item) => sum + item.score, 0);
  const cumulativeScore = 500 + currentScore; // Previous 5 steps max score + current

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const demonstrationItems = [
    {
      icon: <Globe className="w-5 h-5 text-primary" />,
      title: "Relevant Environment Testing",
      description: "Demonstrate deliverable performance in conditions closely matching intended operational environment."
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Stakeholder Validation",
      description: "Engage key stakeholders and end-users to validate functionality and usability."
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "Risk Assessment",
      description: "Identify and mitigate potential risks in operational deployment scenarios."
    }
  ];

  return (
    <StepLayout
      currentStep={6}
      title="Representative of Deliverable Demonstrated in Relevant Environment"
      description="Showcase deliverable capabilities in conditions that closely match the intended operational environment."
    >
      <div className="space-y-6">
        {/* Checklist Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Step 6 Checklist</span>
              <div className="text-sm font-normal text-muted-foreground space-y-1">
                <div>Step Score: {currentScore}/{totalPossibleScore} ({Math.round((currentScore/totalPossibleScore)*100)}%)</div>
                <div>Cumulative: {cumulativeScore}/600 ({Math.round((cumulativeScore/600)*100)}%)</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Done</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead className="w-20 text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklistItems.map((item) => (
                  <TableRow key={item.key}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={checklist[item.key as keyof typeof checklist]}
                        onChange={(e) => handleChecklistChange(item.key, e.target.checked)}
                        className="w-4 h-4 rounded border border-input"
                      />
                    </TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-medium">
                      {checklist[item.key as keyof typeof checklist] ? item.score : 0}/{item.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {demonstrationItems.map((item, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  {item.icon}
                  <span>{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StepLayout>
  );
}