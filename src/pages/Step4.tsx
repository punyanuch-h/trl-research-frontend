import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Eye, Rocket, BarChart } from "lucide-react";

export default function Step4() {
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
      title="Review Phase"
      description="Finalize your project with comprehensive reviews, deployment preparation, and success metrics."
    >
      <div className="space-y-6">
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

        <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">Final Review Checklist</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Complete final validation and prepare for launch. Ensure all quality gates are passed and monitoring is in place.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-primary font-medium">
            <CheckCircle className="w-5 h-5" />
            <span>Process Complete!</span>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            Congratulations on completing all workflow steps.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}