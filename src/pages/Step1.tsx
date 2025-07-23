import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, Calendar, Users } from "lucide-react";

export default function Step1() {
  const planningItems = [
    {
      icon: <Target className="w-5 h-5 text-primary" />,
      title: "Define Objectives",
      description: "Clearly outline the goals and expected outcomes of your project."
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Identify Stakeholders",
      description: "List all team members and stakeholders involved in the process."
    },
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: "Set Timeline",
      description: "Establish realistic deadlines and milestones for each phase."
    }
  ];

  return (
    <StepLayout
      currentStep={1}
      title="Planning Phase"
      description="Establish the foundation for your project by defining objectives, stakeholders, and timelines."
    >
      <div className="space-y-6">
        <div className="grid gap-4">
          {planningItems.map((item, index) => (
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
              <h4 className="font-semibold text-foreground">Planning Checklist</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Complete all planning items before proceeding to the setup phase. This ensures a solid foundation for your project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}