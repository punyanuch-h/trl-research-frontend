import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Eye, Rocket, BarChart } from "lucide-react";
import { useState } from "react";

export default function Step4() {
  const [checklist, setChecklist] = useState({
    labEnvironmentSetup: false,
    keyElementsDemo: false,
    functionalityValidated: false,
    performanceTested: false,
    safetyVerified: false
  });

  const checklistItems = [
    { key: 'labEnvironmentSetup', label: 'Laboratory environment properly established', score: 20 },
    { key: 'keyElementsDemo', label: 'Key elements successfully demonstrated', score: 20 },
    { key: 'functionalityValidated', label: 'Core functionality validated', score: 20 },
    { key: 'performanceTested', label: 'Performance benchmarks tested', score: 20 },
    { key: 'safetyVerified', label: 'Safety protocols verified', score: 20 }
  ];

  const currentScore = checklistItems.reduce((sum, item) => 
    sum + (checklist[item.key as keyof typeof checklist] ? item.score : 0), 0
  );
  const totalPossibleScore = checklistItems.reduce((sum, item) => sum + item.score, 0);
  const cumulativeScore = 300 + currentScore; // Previous 3 steps max score + current

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const reviewItems = [
    {
      icon: <Eye className="w-5 h-5 text-primary" />,
      title: "Quality Review",
      description: "Conduct thorough code reviews, performance testing, and security audits."
    },
    {
      icon: <Rocket className="w-5 h-5 text-primary" />,
      title: "Deployment Preparation",
      description: "Prepare for production deployment with final configurations and rollback plans."
    },
    {
      icon: <BarChart className="w-5 h-5 text-primary" />,
      title: "Success Metrics",
      description: "Define and implement monitoring, analytics, and success measurement criteria."
    }
  ];

  return (
    <StepLayout
      currentStep={4}
      title="Key Elements Demonstrated in Laboratory Environment"
      description="Demonstrate critical system components and functionality in controlled laboratory conditions."
    >
      <div className="space-y-6">
        {/* Checklist Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Step 4 Checklist</span>
              <div className="text-sm font-normal text-muted-foreground space-y-1">
                <div>Step Score: {currentScore}/{totalPossibleScore} ({Math.round((currentScore/totalPossibleScore)*100)}%)</div>
                <div>Cumulative: {cumulativeScore}/400 ({Math.round((cumulativeScore/400)*100)}%)</div>
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
          {reviewItems.map((item, index) => (
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