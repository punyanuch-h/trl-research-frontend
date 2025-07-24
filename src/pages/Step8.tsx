import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Award, TestTube, FileCheck } from "lucide-react";
import { useState } from "react";

export default function Step8() {
  const [checklist, setChecklist] = useState({
    qualificationTesting: false,
    demonstrationCompleted: false,
    certificationObtained: false,
    documentationComplete: false,
    qualityAssurance: false
  });

  const checklistItems = [
    { key: 'qualificationTesting', label: 'Formal qualification testing completed', score: 20 },
    { key: 'demonstrationCompleted', label: 'Final demonstration successfully executed', score: 20 },
    { key: 'certificationObtained', label: 'Required certifications obtained', score: 20 },
    { key: 'documentationComplete', label: 'Complete documentation delivered', score: 20 },
    { key: 'qualityAssurance', label: 'Quality assurance protocols verified', score: 20 }
  ];

  const currentScore = checklistItems.reduce((sum, item) => 
    sum + (checklist[item.key as keyof typeof checklist] ? item.score : 0), 0
  );
  const totalPossibleScore = checklistItems.reduce((sum, item) => sum + item.score, 0);
  const cumulativeScore = 700 + currentScore; // Previous 7 steps max score + current

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const qualificationItems = [
    {
      icon: <TestTube className="w-5 h-5 text-primary" />,
      title: "Qualification Testing",
      description: "Execute formal qualification tests to verify deliverable meets all specified requirements."
    },
    {
      icon: <Award className="w-5 h-5 text-primary" />,
      title: "Final Demonstration",
      description: "Conduct comprehensive demonstration showcasing full operational capabilities."
    },
    {
      icon: <FileCheck className="w-5 h-5 text-primary" />,
      title: "Documentation & Certification",
      description: "Complete all required documentation and obtain necessary certifications for deployment."
    }
  ];

  return (
    <StepLayout
      currentStep={8}
      title="Actual Deliverable Qualified Through Test and Demonstration"
      description="Formally qualify the deliverable through rigorous testing and comprehensive demonstration."
    >
      <div className="space-y-6">
        {/* Checklist Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Step 8 Checklist</span>
              <div className="text-sm font-normal text-muted-foreground space-y-1">
                <div>Step Score: {currentScore}/{totalPossibleScore} ({Math.round((currentScore/totalPossibleScore)*100)}%)</div>
                <div>Cumulative: {cumulativeScore}/800 ({Math.round((cumulativeScore/800)*100)}%)</div>
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