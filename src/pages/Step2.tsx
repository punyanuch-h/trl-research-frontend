import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Settings, Database, Shield } from "lucide-react";

export default function Step2() {
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
      title="Setup Phase"
      description="Configure your development environment and establish the technical infrastructure needed for implementation."
    >
      <div className="space-y-6">
        <div className="grid gap-4">
          {setupItems.map((item, index) => (
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
              <h4 className="font-semibold text-foreground">Setup Checklist</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ensure all technical components are properly configured before moving to implementation. Verify connections and test access permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}