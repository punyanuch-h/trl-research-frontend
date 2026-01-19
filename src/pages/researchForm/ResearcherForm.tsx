import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSubmitResearcherForm } from "@/hooks/case/post/useSubmitResearcherForm";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";

// Import components
import ResearcherDetails from '@/pages/researchForm/researcherDetails';
import ResearchDetails from '@/pages/researchForm/researchDetails';
import EvaluateTRL from '@/pages/researchForm/evaluateTRL';
import IntellectualProperty from '@/pages/researchForm/intellectualProperty';
import Supporter from '@/pages/researchForm/Supporter';

interface IpForm {
  noIp?: boolean;
  ipTypes: string[];
  ipStatus: string;
  requestNumbers: Record<string, string>;
  file?: File | null;
}

type FormState = {
  // researcher_info
  id: string;
  headPrefix: string;
  headAcademicPosition: string;
  headFirstName: string;
  headLastName: string;
  headDepartment: string;
  headPhoneNumber: string;
  headEmail: string;
  // coordinator_info
  sameAsHead: boolean;
  coordinatorFirstName: string;
  coordinatorLastName: string;
  coordinatorPhoneNumber: string;
  coordinatorEmail: string;
  // caseDetails
  researcherId: string;
  trlScore: string;
  status: boolean;
  isUrgent: boolean;
  urgentReason: string;
  urgentFeedback: string;
  researchTitle: string;
  researchType: string;
  description: string;
  keywords: string;
  researchDetailsFiles: File[];
  // evaluateTRL
  trlSoftware: string;
  trlMedicalDevices: string;
  trlMedicinesVaccines: string;
  trlPlantAnimalBreeds: string;
  stageOfDevelopment: string;
  currentChallenges: string;
  targetUsers: string;

  // Assessment_trl
  trlLevelResult: number | null;
  assessmentFiles: {
    rq1?: File | null;
    rq2?: File | null;
    rq3?: File | null;
    rq4?: File | null;
    rq5?: File | null;
    rq6?: File | null;
    rq7?: File | null;
    cq1?: File | null;
    cq2?: File | null;
    cq3?: File | null;
    cq4?: File | null;
    cq5?: File | null;
    cq6?: File | null;
    cq7?: File | null;
    cq8?: File | null;
    cq9?: File | null;
  };
  // Research Questions (RQ)
  rq1_answer: boolean;
  rq2_answer: boolean;
  rq3_answer: boolean;
  rq4_answer: boolean;
  rq5_answer: boolean;
  rq6_answer: boolean;
  rq7_answer: boolean;
  // Commercialization Questions (CQ)
  cq1_answer: string[];
  cq2_answer: string[];
  cq3_answer: string[];
  cq4_answer: string[];
  cq5_answer: string[];
  cq6_answer: string[];
  cq7_answer: string[];
  cq8_answer: string[];
  cq9_answer: string[];
  // intellectualProperty
  ipHas: boolean;
  ipProtectionStatus: string;
  ipRequestNumber: string;
  ipTypes: string[];
  ipForms: IpForm[];
  // Supporter
  supportDevNeeded: string[];
  supportMarketNeeded: string[];
  businessPartner: string;
  readyForShowcase: string;
  consent: string;
  otherSupportMarket: string;
};

export default function ResearcherForm() {
  const navigate = useNavigate();
  const [currentFormStep, setCurrentFormStep] = useState<number>(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [trlLevel, setTrlLevel] = useState<number | null>(null);
  const submitFormMutation = useSubmitResearcherForm();
  const { data: userProfile } = useGetUserProfile();
  
  // TRL step state
  const [trlState, setTrlState] = useState<{
    showPart2: boolean;
    checkboxQueue: number[];
    answersRadio: { [key: string]: number | null };
    answersCheckbox: { [key: string]: number[] };
    levelMessage: string;
    errorMessage: string;
  }>({
    showPart2: false,
    checkboxQueue: [],
    answersRadio: {
      rq1: null,
      rq2: null,
      rq3: null,
      rq4: null,
      rq5: null,
      rq6: null,
      rq7: null,
    },
    answersCheckbox: {},
    levelMessage: "",
    errorMessage: "",
  });

  const [formData, setFormData] = useState<FormState>({
    // researcher_info
    id: userProfile?.id ?? "",
    headPrefix: "",
    headAcademicPosition: "",
    headFirstName: "",
    headLastName: "",
    headDepartment: "",
    headPhoneNumber: "",
    headEmail: "",
    // coordinator_info
    sameAsHead: false,
    coordinatorFirstName: "",
    coordinatorLastName: "",
    coordinatorPhoneNumber: "",
    coordinatorEmail: "",
    // caseDetails
    researcherId: userProfile?.id ?? "",
    trlScore: "",
    status: false,
    isUrgent: false,
    urgentReason: "",
    urgentFeedback: "",
    researchTitle: "",
    researchType: "",
    description: "",
    keywords: "",
    researchDetailsFiles: [],
    // evaluateTRL
    trlSoftware: "",
    trlMedicalDevices: "",
    trlMedicinesVaccines: "",
    trlPlantAnimalBreeds: "",
    stageOfDevelopment: "",
    currentChallenges: "",
    targetUsers: "",
    // Assessment_trl
    trlLevelResult: null,
    assessmentFiles: {},
    // RQ
    rq1_answer: false,
    rq2_answer: false,
    rq3_answer: false,
    rq4_answer: false,
    rq5_answer: false,
    rq6_answer: false,
    rq7_answer: false,
    // CQ
    cq1_answer: [] as string[],
    cq2_answer: [] as string[],
    cq3_answer: [] as string[],
    cq4_answer: [] as string[],
    cq5_answer: [] as string[],
    cq6_answer: [] as string[],
    cq7_answer: [] as string[],
    cq8_answer: [] as string[],
    cq9_answer: [] as string[],
    // IP
    ipHas: true,
    ipProtectionStatus: "",
    ipRequestNumber: "",
    ipTypes: [] as string[],
    ipForms: [{ ipStatus: "", ipTypes: [], requestNumbers: {}, noIp: false, file: null }] as IpForm[],
    // Supporter
    supportDevNeeded: [] as string[],
    supportMarketNeeded: [] as string[],
    businessPartner: "",
    readyForShowcase: "",
    consent: "",
    otherSupportMarket: "",
  });

  const [stepError, setStepError] = useState<string>("");

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentFormStep]);

  const refs = {
    headPrefix: useRef<HTMLInputElement>(null),
    headAcademicPosition: useRef<HTMLInputElement>(null),
    headFirstName: useRef<HTMLInputElement>(null),
    headLastName: useRef<HTMLInputElement>(null),
    headDepartment: useRef<HTMLInputElement>(null),
    headPhoneNumber: useRef<HTMLInputElement>(null),
    headEmail: useRef<HTMLInputElement>(null),
    coordinatorFirstName: useRef<HTMLInputElement>(null),
    coordinatorLastName: useRef<HTMLInputElement>(null),
    coordinatorPhoneNumber: useRef<HTMLInputElement>(null),
    coordinatorEmail: useRef<HTMLInputElement>(null),
    urgentReason: useRef<HTMLTextAreaElement>(null),
    urgentFeedback: useRef<HTMLTextAreaElement>(null),
    researchTitle: useRef<HTMLInputElement>(null),
    researchType: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    keywords: useRef<HTMLInputElement>(null),
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (stepError) {
      setStepError("");
    }
  };

  // Validation - pure function that doesn't call setStepError
  function validateStepWithField(step: number): { valid: boolean; firstField?: string; errorMessage?: string } {
    if (step === 1) {
      const required = [
        "headPrefix", "headAcademicPosition", "headFirstName", "headLastName",
        "headDepartment", "headPhoneNumber", "headEmail",
        "coordinatorFirstName", "coordinatorLastName", "coordinatorPhoneNumber", "coordinatorEmail"
      ];
      for (const field of required) {
        // @ts-ignore dynamic access
        const value = formData[field];
        if (!value || (typeof value === "string" && !value.trim())) {
          return { valid: false, firstField: field, errorMessage: "กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน" };
        }
      }
      if (formData.isUrgent && !formData.urgentReason.trim()) {
        return { valid: false, firstField: "urgentReason", errorMessage: "กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน" };
      }
      return { valid: true };
    }
    if (step === 2) {
      const required = ["researchTitle", "researchType", "description"];
      for (const field of required) {
        // @ts-ignore dynamic access
        const value = formData[field];
        if (!value || (typeof value === "string" && !value.trim())) {
          return { valid: false, firstField: field, errorMessage: "กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน" };
        }
      }
      return { valid: true };
    }
    if (step === 3) {
      return { 
        valid: formData.trlLevelResult !== null, 
        firstField: formData.trlLevelResult === null ? "trlLevelResult" : undefined,
        errorMessage: formData.trlLevelResult === null ? "กรุณาตอบแบบประเมิน TRL ให้ครบจนปรากฏข้อความระดับ TRL ก่อนดำเนินการต่อ" : undefined
      };
    }
    if (step === 4) {
      // Check if user selected "ไม่มี" (no IP) for all forms
      const ipForms = (formData.ipForms && formData.ipForms.length > 0) ? formData.ipForms : [
        {
          ipStatus: formData.ipProtectionStatus,
          ipTypes: formData.ipTypes,
          requestNumbers: formData.ipRequestNumber ? { [formData.ipTypes?.[0] || ""]: formData.ipRequestNumber } : {},
          noIp: !formData.ipHas,
        },
      ];
      
      // If all forms have noIp = true, it's valid
      const allNoIp = ipForms.every(form => form.noIp === true);
      if (allNoIp) {
        return { valid: true };
      }
      
      // Otherwise, validate each form that has IP
      for (let i = 0; i < ipForms.length; i++) {
        const form = ipForms[i];
        if (form.noIp) continue; // Skip forms with no IP
        
        if (!form.ipStatus || !form.ipStatus.trim()) {
          return { 
            valid: false, 
            firstField: "ipProtectionStatus",
            errorMessage: `กรุณาเลือกสถานะการคุ้มครองทรัพย์สินทางปัญญา (ใบที่ ${i + 1})`
          };
        }
        if (!form.ipTypes || form.ipTypes.length === 0) {
          return { 
            valid: false, 
            firstField: "ipTypes",
            errorMessage: `กรุณาระบุประเภททรัพย์สินทางปัญญา (ใบที่ ${i + 1})`
          };
        }
        if (form.ipStatus === "ได้เลขที่คำขอแล้ว") {
          const requestNumber = form.requestNumbers?.[form.ipTypes[0]];
          if (!requestNumber || !requestNumber.trim()) {
            return { 
              valid: false, 
              firstField: "ipRequestNumber",
              errorMessage: `กรุณาระบุเลขที่คำขอ (ใบที่ ${i + 1})`
            };
          }
        }
      }
      return { valid: true };
    }
    if (step === 5) {
      if (
        Array.isArray(formData.supportDevNeeded) && formData.supportDevNeeded.length > 0 &&
        Array.isArray(formData.supportMarketNeeded) && formData.supportMarketNeeded.length > 0
      ) {
        // Check if "อื่น ๆ" is selected but otherSupportMarket is empty
        if (formData.supportMarketNeeded.includes("อื่น ๆ") && (!formData.otherSupportMarket || !formData.otherSupportMarket.trim())) {
          return { 
            valid: false, 
            firstField: "otherSupportMarket",
            errorMessage: "กรุณาระบุความช่วยเหลืออื่น ๆ"
          };
        }
        return { valid: true };
      }
      return { 
        valid: false, 
        firstField: !Array.isArray(formData.supportDevNeeded) || formData.supportDevNeeded.length === 0 ? "supportDevNeeded" : "supportMarketNeeded",
        errorMessage: "กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน"
      };
    }
    return { valid: true };
  }

  function scrollToField(field?: string) {
    if (!field) return;
    const ref = (refs as any)[field];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      if (typeof ref.current.focus === "function") ref.current.focus();
    }
  }

  const handleNext = () => {
    // Special handling for TRL step (step 3)
    if (currentFormStep === 3) {
      // If Part 2 is not shown yet, proceed to Part 2
      if (!trlState.showPart2) {
        const allAnswered = Object.values(trlState.answersRadio).every((a) => a !== null);
        if (!allAnswered) {
          setStepError("กรุณาตอบคำถาม Part 1 ให้ครบก่อน");
          return;
        }
        
        // Calculate first checkbox index
        let firstIndex = 0;
        if (trlState.answersRadio.rq1 === 1) {
          if (trlState.answersRadio.rq2 === 1) {
            if (trlState.answersRadio.rq3 === 1) {
              if (trlState.answersRadio.rq4 === 1) {
                firstIndex = trlState.answersRadio.rq5 === 1 ? 9 : 8;
              } else firstIndex = 7;
            } else firstIndex = 6;
          } else firstIndex = trlState.answersRadio.rq6 === 1 ? 5 : 4;
        } else {
          firstIndex = trlState.answersRadio.rq7 === 1 ? 3 : 2;
        }
        
        setTrlState(prev => ({
          ...prev,
          showPart2: true,
          checkboxQueue: [firstIndex],
          errorMessage: "",
        }));
        setStepError("");
        return;
      }
      
      // If Part 2 is shown, check current checkbox
      const currentIndex = trlState.checkboxQueue[trlState.checkboxQueue.length - 1];
      if (currentIndex) {
        const answers = trlState.answersCheckbox[`cq${currentIndex}`] || [];
        const allChecked = answers.length > 0 && answers.every((v) => v === 1);
        
        if (!allChecked) {
          if (answers.length === 0) {
            setStepError("กรุณาตอบคำถาม Part 2 ให้ครบก่อน");
            return;
          }
          
          if (currentIndex === 1) {
            setStepError("Research ของคุณไม่อยู่ในระดับ TRL");
            setTrlState(prev => ({
              ...prev,
              levelMessage: "Research ของคุณไม่อยู่ในระดับ TRL",
              errorMessage: "",
            }));
            setFormData(prev => ({ ...prev, trlLevelResult: null }));
            return;
          }
          
          // Add next question
          setTrlState(prev => ({
            ...prev,
            checkboxQueue: [...prev.checkboxQueue, currentIndex - 1],
            errorMessage: "",
          }));
          setStepError("");
          return;
        }
        
        // All checked, set TRL level
        setStepError("");
        setTrlState(prev => ({
          ...prev,
          // levelMessage: `Research ของคุณอยู่ในระดับ TRL ${currentIndex}`,
          errorMessage: "",
        }));
        setFormData(prev => ({ ...prev, trlLevelResult: currentIndex }));
        // Proceed to next step
        setCurrentFormStep(4);
        return;
      }
    }
    
    // Normal validation for other steps
    const { valid, firstField, errorMessage } = validateStepWithField(currentFormStep);
    if (!valid) {
      if (errorMessage) {
        setStepError(errorMessage);
      } else {
        setStepError("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
      }
      if (firstField) {
        setTimeout(() => scrollToField(firstField), 100);
      }
      return;
    }
    setStepError("");
    if (currentFormStep < 5) {
      setCurrentFormStep(currentFormStep + 1);
    }
  };

  // Check if current step is valid for button disabling
  const isStepValid = () => {
    if (currentFormStep === 3) {
      // For TRL step, check if Part 1 is complete
      if (!trlState.showPart2) {
        const allAnswered = Object.values(trlState.answersRadio).every((a) => a !== null);
        return allAnswered;
      }
      // If Part 2 is shown, check if current checkbox has at least one answer
      const currentIndex = trlState.checkboxQueue[trlState.checkboxQueue.length - 1];
      if (currentIndex) {
        const answers = trlState.answersCheckbox[`cq${currentIndex}`] || [];
        // Allow button to be enabled if there's at least one answer
        // The actual validation (all checked) will happen in handleNext
        return answers.length > 0;
      }
      return false;
    }
    const { valid } = validateStepWithField(currentFormStep);
    return valid;
  };
  
  // Get button text for TRL step
  const getTRLButtonText = () => {
    if (!trlState.showPart2) {
      return "Next to Part 2";
    }
    return "Submit";
  };

  const handleSubmit = async () => {
    const { valid, firstField, errorMessage } = validateStepWithField(currentFormStep);
    if (!valid) {
      if (errorMessage) {
        setStepError(errorMessage);
      } else {
        setStepError("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
      }
      if (firstField) {
        setTimeout(() => scrollToField(firstField), 100);
      }
      return;
    }
    setStepError("");
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    submitFormMutation.mutate(formData);
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = ((prev as any)[field] as string[]) || [];
      if (checked) {
        return { ...(prev as any), [field]: [...currentValues, value] } as FormState;
      } else {
        return { ...(prev as any), [field]: currentValues.filter(item => item !== value) } as FormState;
      }
    });
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, additionalDocuments: file }));
  };

  const renderFormStep = () => {
    switch (currentFormStep) {
      case 1:
        return <ResearcherDetails formData={formData} handleInputChange={handleInputChange} refs={refs} />;
      case 2:
        return <ResearchDetails formData={formData} handleInputChange={handleInputChange} refs={refs} />;
      case 3:
        return (
          <EvaluateTRL
            formData={formData}
            handleInputChange={(field, value) =>
              setFormData((prev) => ({ ...prev, [field]: value }))
            }
            setTrlLevel={(level: number | null) => {
              setFormData((prev) => ({ ...prev, trlLevelResult: level }));
              setTrlLevel(level);
            }}
            onStateChange={(state) => setTrlState(state)}
            currentCheckboxIndex={trlState.checkboxQueue[trlState.checkboxQueue.length - 1] || null}
            externalState={trlState}
          />
        );
      case 4:
        return <IntellectualProperty formData={formData} handleInputChange={handleInputChange} />;
      case 5:
        return <Supporter
          formData={formData}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
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

  const handlePrev = () => {
    if (currentFormStep > 1) {
      setCurrentFormStep(currentFormStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/researcher-homepage')}
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${step.id === currentFormStep
                  ? "bg-primary text-primary-foreground"
                  : step.id < currentFormStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                  }`}>
                  {step.id}
                </div>
                {index < formSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${step.id < currentFormStep ? "bg-primary" : "bg-muted"
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
            {(stepError || (currentFormStep === 3 && trlState.errorMessage)) && (
              <div className="text-red-500 font-semibold mt-4">
                {currentFormStep === 3 && trlState.errorMessage ? trlState.errorMessage : stepError}
              </div>
            )}
            {currentFormStep === 3 && trlState.levelMessage && (
              <div className="text-lg font-semibold mt-4 text-primary">
                {trlState.levelMessage}
              </div>
            )}
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
                {currentFormStep === 5 ? (
                  <Button onClick={handleSubmit} disabled={submitFormMutation.isPending || !isStepValid()}>
                    Submit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : currentFormStep === 3 ? (
                  <Button onClick={handleNext} disabled={!isStepValid()}>
                    {getTRLButtonText()}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} disabled={!isStepValid()}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirm dialog */}
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
              <Button onClick={handleConfirmSubmit} disabled={submitFormMutation.isPending}>
                Confirm and Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
