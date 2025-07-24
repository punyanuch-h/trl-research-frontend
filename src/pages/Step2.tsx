import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Settings, Database, Shield } from "lucide-react";
import { useState } from "react";

export default function Step2() {
  const [checklist, setChecklist] = useState({
    conceptFormulated: false,
    feasibilityStudy: false,
    technicalSpecs: false,
    resourcesIdentified: false,
    risksAssessed: false
  });

  const checklistItems = [
    { key: 'conceptFormulated', label: 'Technology concept clearly formulated', score: 20 },
    { key: 'feasibilityStudy', label: 'Initial feasibility study completed', score: 20 },
    { key: 'technicalSpecs', label: 'Technical specifications defined', score: 20 },
    { key: 'resourcesIdentified', label: 'Required resources identified', score: 20 },
    { key: 'risksAssessed', label: 'Potential risks assessed', score: 20 }
  ];

  const currentScore = checklistItems.reduce((sum, item) => 
    sum + (checklist[item.key as keyof typeof checklist] ? item.score : 0), 0
  );
  const totalPossibleScore = checklistItems.reduce((sum, item) => sum + item.score, 0);
  const cumulativeScore = 100 + currentScore; // Previous step max score + current

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const setupItems = [
    {
      icon: <Settings className="w-5 h-5 text-primary" />,
      title: "Environment Configuration",
      description: "Set up development, staging, and production environments with proper configurations."
    },
    {
      icon: <Database className="w-5 h-5 text-primary" />,
      title: "Data Infrastructure",
      description: "Initialize databases, APIs, and data storage systems required for the project."
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "Security & Access",
      description: "Configure authentication, authorization, and security protocols."
    }
  ];

  return (
    <StepLayout
      currentStep={2}
      title="Technology Concept and/or Application Formulated"
      description="Develop and formulate the technology concept with clear applications and implementation pathways."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Step 2 Checklist</span>
              <div className="text-sm font-normal text-muted-foreground space-y-1">
                <div>Step Score: {currentScore}/{totalPossibleScore} ({Math.round((currentScore/totalPossibleScore)*100)}%)</div>
                <div>Cumulative: {cumulativeScore}/200 ({Math.round((cumulativeScore/200)*100)}%)</div>
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

      </div>
    </StepLayout>
  );
}