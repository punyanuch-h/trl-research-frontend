import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, SkipForward, CheckSquare } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface StepLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  title: string;
  description: string;
}

const steps = [
  { id: 1, title: "Basic Principle", path: "/trl-1" },
  { id: 2, title: "Technology Concept", path: "/trl-2" },
  { id: 3, title: "Concepts Demonstrated", path: "/trl-3" },
  { id: 4, title: "Laboratory Environment", path: "/trl-4" },
  { id: 5, title: "Simulated Environment", path: "/trl-5" },
  { id: 6, title: "Relevant Environment", path: "/trl-6" },
  { id: 7, title: "Operational Environment", path: "/trl-7" },
  { id: 8, title: "Test & Demonstration", path: "/trl-8" },
  { id: 9, title: "Operational Use", path: "/trl-9" }
];

export default function StepLayout({ children, currentStep, title, description }: StepLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const researchName = searchParams.get('research') || 'Research Project';
  const researchType = searchParams.get('type') || 'TRL Assessment';
  const userRole = searchParams.get('role') || 'researcher'; // 'professor' or 'researcher'

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
                  onClick={() => navigate(`${step.path}?research=${encodeURIComponent(researchName)}&type=${encodeURIComponent(researchType)}&role=${userRole}`)}
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
                    TRL{step.id}
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

      {/* Research Info */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-foreground">{researchName}</h3>
              <p className="text-sm text-muted-foreground">{researchType}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              TRL Assessment Progress
            </div>
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
                navigate(`${steps[currentStep - 2].path}?research=${encodeURIComponent(researchName)}&type=${encodeURIComponent(researchType)}&role=${userRole}`);
              }
            }}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            {/* Role-specific buttons */}
            {userRole === 'professor' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip to Results
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Skip to Results?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to skip the remaining steps and go directly to the results page? 
                      You can always come back to complete the other steps later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        navigate(`/complete?research=${encodeURIComponent(researchName)}&type=${encodeURIComponent(researchType)}&role=${userRole}`);
                      }}
                    >
                      Skip to Results
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            {userRole === 'researcher' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Confirm Changes
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you finished editing this research? This will save your changes and return you to the dashboard.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        navigate(`/researcher-dashboard?research=${encodeURIComponent(researchName)}&type=${encodeURIComponent(researchType)}&role=${userRole}`);
                      }}
                    >
                      Confirm & Return to Dashboard
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            <Button
              onClick={() => {
                if (currentStep < steps.length) {
                  navigate(`${steps[currentStep].path}?research=${encodeURIComponent(researchName)}&type=${encodeURIComponent(researchType)}&role=${userRole}`);
                } else {
                  navigate(`/complete?research=${encodeURIComponent(researchName)}&type=${encodeURIComponent(researchType)}&role=${userRole}`);
                }
              }}
            >
              {currentStep === steps.length ? "Complete Assessment" : "Next Step"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}