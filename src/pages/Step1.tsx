import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

export default function Step1() {
  const [checklist, setChecklist] = useState({
    principleIdentified: false,
    literatureReviewed: false,
    hypothesisFormed: false,
    objectivesDefined: false,
    methodologyOutlined: false
  });


  const checklistItems = [
    { key: 'principleIdentified', label: 'Basic scientific principle identified', score: 20 },
    { key: 'literatureReviewed', label: 'Literature review completed', score: 20 },
    { key: 'hypothesisFormed', label: 'Initial hypothesis formulated', score: 20 },
    { key: 'objectivesDefined', label: 'Research objectives clearly defined', score: 20 },
    { key: 'methodologyOutlined', label: 'Basic methodology outlined', score: 20 }
  ];

  const currentScore = checklistItems.reduce((sum, item) => 
    sum + (checklist[item.key as keyof typeof checklist] ? item.score : 0), 0
  );

  const totalPossibleScore = checklistItems.reduce((sum, item) => sum + item.score, 0);

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };


  return (
    <StepLayout
      currentStep={1}
      title="Basic Principle Observed and Reported"
      description="Identify and document fundamental scientific principles underlying your research area."
    >
      <div className="space-y-6">
        {/* Checklist Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Step 1 Checklist</span>
              <span className="text-sm font-normal text-muted-foreground">
                Score: {currentScore}/{totalPossibleScore} ({Math.round((currentScore/totalPossibleScore)*100)}%)
              </span>
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