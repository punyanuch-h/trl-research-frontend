import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

// Import components with new names
import ResearcherDetails from '@/pages/researchDetails/researcherDetails';
import ResearchDetails from '@/pages/researchDetails/researchDetails';
import EvaluateTRL from '@/pages/researchDetails/evaluateTRL';
import IntellectualProperty from '@/pages/researchDetails/intellectualProperty';
import Supporter from '@/pages/researchDetails/Supporter';


export default function ResearcherForm() {
  const navigate = useNavigate();
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [formData, setFormData] = useState({
    // researcherDetails
    headPrefix: "",
    headAcademicPosition: "",
    headFirstName: "",
    headLastName: "",
    headDepartment: "",
    headPhoneNumber: "",
    headEmail: "",
    coordinatorFirstName: "",
    coordinatorLastName: "",
    coordinatorPhoneNumber: "",
    coordinatorEmail: "",
    isUrgent: false,
    urgentReason: "",

    // researchDetails
    researchTitle: "",
    researchType: "",
    description: "",
    keywords: "",
    
    // evaluateTRL
    trlSoftware: "",
    trlMedicalDevices: "",
    trlMedicinesVaccines: "",
    trlPlantAnimalBreeds: "",
    stageOfDevelopment: "",
    currentChallenges: "",
    targetUsers: "",
    
    // intellectualProperty
    ipProtectionStatus: "",
    ipRequestNumber: "",
    ipTypes: [] as string[],
    
    // Supporter
    supportDevNeeded: [] as string[],
    supportMarketNeeded: [] as string[],
    businessPartner: "",
    readyForShowcase: "",
    consent: "",
    otherSupportMarket: "", // Add this
    additionalDocuments: null as File | null, // Add this
  });

  useEffect(() => {
    const savedStep = localStorage.getItem("currentFormStep");
    if (savedStep) {
      setCurrentFormStep(Number(savedStep));
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentFormStep < 5) {
      setCurrentFormStep(currentFormStep + 1);
      localStorage.setItem("currentFormStep", (currentFormStep + 1).toString());
    }
  };

  const handlePrev = () => {
    if (currentFormStep > 1) {
      setCurrentFormStep(currentFormStep - 1);
      localStorage.setItem("currentFormStep", (currentFormStep - 1).toString());
    }
  };

  const handleSubmit = () => {
    if (formData.isUrgent && !formData.urgentReason.trim()) {
      alert("กรุณาระบุเหตุผลความเร่งด่วน (Urgent Reason)");
      return;
    }
    // Logic for form submission
    console.log("Form Data Submitted:", formData);
    navigate('/researcher-dashboard');
    localStorage.removeItem("currentFormStep");
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, additionalDocuments: file }));
  };

  const renderFormStep = () => {
    switch (currentFormStep) {
      case 1:
        return <ResearcherDetails formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <ResearchDetails formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <EvaluateTRL formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <IntellectualProperty formData={formData} handleInputChange={handleInputChange} />;
      case 5:
        return <Supporter 
          formData={formData} 
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
          handleFileChange={handleFileChange}
        />;
      default:
        return null;
    }
  };

  const formSteps = [
    { id: 1, title: "Researcher Details" },
    { id: 2, title: "Research Details" },
    { id: 3, title: "Research Assessment TRL" },
    { id: 4, title: "Intellectual Property" },
    { id: 5, title: "Supportment" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ย้อนกลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Research Form</h1>
            <p className="text-muted-foreground">Step {currentFormStep} of 5: {formSteps[currentFormStep - 1].title}</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {formSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="text-sm font-medium mr-2">
                  Step
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentFormStep
                    ? "bg-primary text-primary-foreground"
                    : step.id < currentFormStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step.id}
                </div>
                {index < formSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step.id < currentFormStep ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step {currentFormStep}: {formSteps[currentFormStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderFormStep()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentFormStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex gap-3">
                <AlertDialog>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Edit</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to save the changes and return to the dashboard?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Edit</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          navigate('/researcher-dashboard');
                        }}
                      >
                        Confirm and Return to Dashboard
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {currentFormStep === 5 ? (
                  <Button onClick={() => setShowConfirmDialog(true)}>
                    Submit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This is a simple confirmation dialog. In a real app, you might show a summary of all data. */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Submission</DialogTitle>
              <DialogDescription>
                Once you confirm, the data will be submitted to the system for review.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Confirm and Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}