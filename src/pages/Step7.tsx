import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Rocket, Monitor, Zap } from "lucide-react";
import { useState } from "react";

export default function Step7() {
  const [checklist, setChecklist] = useState({
    operationalVersion: false,
    fullFunctionality: false,
    performanceOptimized: false,
    operationalTesting: false,
    deploymentReady: false
  });

  const checklistItems = [
    { key: 'operationalVersion', label: 'Final operational version completed', score: 20 },
    { key: 'fullFunctionality', label: 'All intended functionality implemented', score: 20 },
    { key: 'performanceOptimized', label: 'Performance optimized for operational use', score: 20 },
    { key: 'operationalTesting', label: 'Comprehensive operational testing completed', score: 20 },
    { key: 'deploymentReady', label: 'System ready for operational deployment', score: 20 }
  ];

  const currentScore = checklistItems.reduce((sum, item) => 
    sum + (checklist[item.key as keyof typeof checklist] ? item.score : 0), 0
  );
  const totalPossibleScore = checklistItems.reduce((sum, item) => sum + item.score, 0);
  const cumulativeScore = 600 + currentScore; // Previous 6 steps max score + current

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const developmentItems = [
    {
      icon: <Rocket className="w-5 h-5 text-primary" />,
      title: "Final Development Version",
      description: "Complete final development version with all operational requirements implemented."
    },
    {
      icon: <Monitor className="w-5 h-5 text-primary" />,
      title: "Operational Testing",
      description: "Conduct comprehensive testing in full operational environment conditions."
    },
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      title: "Performance Optimization",
      description: "Optimize system performance for maximum operational efficiency and reliability."
    }
  ];

  return (
    <StepLayout
      currentStep={7}
      title="Final Development Version Demonstrated in Operational Environment"
      description="Present the completed deliverable operating effectively in full operational environment."
    >
      <div className="space-y-6">
        {/* Checklist Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Step 7 Checklist</span>
              <div className="text-sm font-normal text-muted-foreground space-y-1">
                <div>Step Score: {currentScore}/{totalPossibleScore} ({Math.round((currentScore/totalPossibleScore)*100)}%)</div>
                <div>Cumulative: {cumulativeScore}/700 ({Math.round((cumulativeScore/700)*100)}%)</div>
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
          {developmentItems.map((item, index) => (
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