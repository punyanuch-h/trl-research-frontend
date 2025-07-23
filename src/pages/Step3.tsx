import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Code, TestTube, GitBranch } from "lucide-react";

export default function Step3() {
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
      title="Implementation Phase"
      description="Execute the development plan by building features, implementing tests, and maintaining code quality."
    >
      <div className="space-y-6">
        <div className="grid gap-4">
          {implementationItems.map((item, index) => (
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

        <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">Implementation Checklist</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Focus on building robust, testable code. Regular commits and continuous testing help maintain project momentum and quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}