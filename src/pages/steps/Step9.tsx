import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Play, BarChart, Cog } from "lucide-react";
import { useState } from "react";

export default function Step9() {
  const [checklist, setChecklist] = useState({
    operationalDeployment: false,
    userTrainingComplete: false,
    performanceMonitoring: false,
    maintenanceProtocols: false,
    successMetrics: false
  });

  const checklistItems = [
    { key: 'operationalDeployment', label: 'Deliverable successfully deployed operationally', score: 20 },
    { key: 'userTrainingComplete', label: 'User training and onboarding completed', score: 20 },
    { key: 'performanceMonitoring', label: 'Performance monitoring systems active', score: 20 },
    { key: 'maintenanceProtocols', label: 'Maintenance protocols established', score: 20 },
    { key: 'successMetrics', label: 'Success metrics being tracked and met', score: 20 }
  ];

  const currentScore = checklistItems.reduce((sum, item) => 
    sum + (checklist[item.key as keyof typeof checklist] ? item.score : 0), 0
  );
  const totalPossibleScore = checklistItems.reduce((sum, item) => sum + item.score, 0);
  const cumulativeScore = 800 + currentScore; // Previous 8 steps max score + current

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const operationalItems = [
    {
      icon: <Play className="w-5 h-5 text-primary" />,
      title: "Operational Deployment",
      description: "Successfully deploy and integrate the deliverable into full operational use."
    },
    {
      icon: <BarChart className="w-5 h-5 text-primary" />,
      title: "Performance Monitoring",
      description: "Implement continuous monitoring systems to track operational performance and success metrics."
    },
    {
      icon: <Cog className="w-5 h-5 text-primary" />,
      title: "Ongoing Support",
      description: "Establish maintenance protocols and ongoing support systems for sustained operational success."
    }
  ];

  return (
    <StepLayout
      currentStep={9}
      title="Operational Use of Deliverable"
      description="Achieve full operational deployment with ongoing monitoring and support systems in place."
    >
      <div className="space-y-6">
        {/* Checklist Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Step 9 Checklist</span>
              <div className="text-sm font-normal text-muted-foreground space-y-1">
                <div>Step Score: {currentScore}/{totalPossibleScore} ({Math.round((currentScore/totalPossibleScore)*100)}%)</div>
                <div>Total Project: {cumulativeScore}/900 ({Math.round((cumulativeScore/900)*100)}%)</div>
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


        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-primary font-medium">
            <CheckCircle className="w-5 h-5" />
            <span>Research Development Complete!</span>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            Congratulations on achieving operational deployment of your research deliverable.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}