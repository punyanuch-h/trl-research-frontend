import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface StepLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  title: string;
  description: string;
}

const steps = [
  { id: 1, title: "Basic Principle", path: "/" },
  { id: 2, title: "Technology Concept", path: "/step-2" },
  { id: 3, title: "Concepts Demonstrated", path: "/step-3" },
  { id: 4, title: "Laboratory Environment", path: "/step-4" },
  { id: 5, title: "Simulated Environment", path: "/step-5" },
  { id: 6, title: "Relevant Environment", path: "/step-6" },
  { id: 7, title: "Operational Environment", path: "/step-7" },
  { id: 8, title: "Test & Demonstration", path: "/step-8" },
  { id: 9, title: "Operational Use", path: "/step-9" }
];

export default function StepLayout({ children, currentStep, title, description }: StepLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isStepCompleted = (stepId: number) => stepId < currentStep;
  const isCurrentStep = (stepId: number) => stepId === currentStep;

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Research Development Process</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => navigate(step.path)}
                  className="flex items-center space-x-2 group"
                >
                  {isStepCompleted(step.id) ? (
                    <CheckCircle className="w-6 h-6 text-primary" />
                  ) : isCurrentStep(step.id) ? (
                    <Circle className="w-6 h-6 text-primary fill-primary/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                  <span className={`text-sm font-medium ${
                    isCurrentStep(step.id) 
                      ? "text-primary" 
                      : isStepCompleted(step.id)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-3 ${
                    isStepCompleted(step.id + 1) ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-8 shadow-sm">
          {children}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep > 1) {
                navigate(steps[currentStep - 2].path);
              }
            }}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <Button
            onClick={() => {
              if (currentStep < steps.length) {
                navigate(steps[currentStep].path);
              }
            }}
            disabled={currentStep === steps.length}
          >
            {currentStep === steps.length ? "Complete" : "Next Step"}
          </Button>
        </div>
      </div>
    </div>
  );
}