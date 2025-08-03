import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Code, TestTube, GitBranch } from "lucide-react";
import { useState } from "react";

export default function Step3() {
  const [checklist, setChecklist] = useState({
    proofOfConcept: false,
    analyticalDemo: false,
    experimentalValidation: false,
    performanceMetrics: false,
    documentationComplete: false
  });

  const checklistItems = [
    { key: 'proofOfConcept', label: 'Proof of concept demonstrated', score: 20 },
    { key: 'analyticalDemo', label: 'Analytical demonstration completed', score: 20 },
    { key: 'experimentalValidation', label: 'Experimental validation performed', score: 20 },
    { key: 'performanceMetrics', label: 'Performance metrics established', score: 20 },
    { key: 'documentationComplete', label: 'Technical documentation completed', score: 20 }
  ];

  const currentScore = checklistItems.reduce((sum, item) => 
    sum + (checklist[item.key as keyof typeof checklist] ? item.score : 0), 0
  );
  const totalPossibleScore = checklistItems.reduce((sum, item) => sum + item.score, 0);
  const cumulativeScore = 200 + currentScore; // Previous 2 steps max score + current

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const implementationItems = [
    {
      icon: <Code className="w-5 h-5 text-primary" />,
      title: "Core Development",
      description: "Build the main features and functionality according to specifications and requirements."
    },
    {
      icon: <TestTube className="w-5 h-5 text-primary" />,
      title: "Testing & Quality",
      description: "Implement comprehensive testing strategies including unit, integration, and user acceptance tests."
    },
    {
      icon: <GitBranch className="w-5 h-5 text-primary" />,
      title: "Version Control",
      description: "Maintain proper version control with meaningful commits and branch management."
    }
  ];

  return (
    <StepLayout
      currentStep={3}
      title="Concepts Demonstrated Analytically or Experimentally"
      description="Validate core concepts through analytical models and experimental demonstrations."
    >
      <div className="space-y-6">
        {/* Checklist Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Step 3 Checklist</span>
              <div className="text-sm font-normal text-muted-foreground space-y-1">
                <div>Step Score: {currentScore}/{totalPossibleScore} ({Math.round((currentScore/totalPossibleScore)*100)}%)</div>
                <div>Cumulative: {cumulativeScore}/300 ({Math.round((cumulativeScore/300)*100)}%)</div>
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