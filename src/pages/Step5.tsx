import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Monitor, Settings, TestTube2 } from "lucide-react";
import { useState } from "react";

export default function Step5() {
  const [checklist, setChecklist] = useState({
    simulationEnvironment: false,
    realWorldConditions: false,
    performanceMetrics: false,
    scalabilityTesting: false,
    integrationTesting: false
  });

  const checklistItems = [
    { key: 'simulationEnvironment', label: 'Simulation environment established', score: 20 },
    { key: 'realWorldConditions', label: 'Real-world conditions accurately modeled', score: 20 },
    { key: 'performanceMetrics', label: 'Performance metrics defined and measured', score: 20 },
    { key: 'scalabilityTesting', label: 'Scalability testing completed', score: 20 },
    { key: 'integrationTesting', label: 'System integration validated', score: 20 }
  ];

  const currentScore = checklistItems.reduce((sum, item) => 
    sum + (checklist[item.key as keyof typeof checklist] ? item.score : 0), 0
  );
  const totalPossibleScore = checklistItems.reduce((sum, item) => sum + item.score, 0);
  const cumulativeScore = 400 + currentScore; // Previous 4 steps max score + current

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const simulationItems = [
    {
      icon: <Monitor className="w-5 h-5 text-primary" />,
      title: "Simulated Environment Setup",
      description: "Create controlled simulation environment that mimics real-world operational conditions."
    },
    {
      icon: <Settings className="w-5 h-5 text-primary" />,
      title: "Parameter Validation",
      description: "Validate key performance parameters under simulated operational scenarios."
    },
    {
      icon: <TestTube2 className="w-5 h-5 text-primary" />,
      title: "System Integration",
      description: "Test integration capabilities within the simulated environment framework."
    }
  ];

  return (
    <StepLayout
      currentStep={5}
      title="Key Elements Demonstrated in Simulated Environment"
      description="Validate system performance and integration capabilities in controlled simulation conditions."
    >
      <div className="space-y-6">
        {/* Checklist Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Step 5 Checklist</span>
              <div className="text-sm font-normal text-muted-foreground space-y-1">
                <div>Step Score: {currentScore}/{totalPossibleScore} ({Math.round((currentScore/totalPossibleScore)*100)}%)</div>
                <div>Cumulative: {cumulativeScore}/500 ({Math.round((cumulativeScore/500)*100)}%)</div>
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