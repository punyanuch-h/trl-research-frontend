import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
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
import { BACKEND_HOST } from "@/constant/constants";

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
  const [trlLevel, setTrlLevel] = useState<number | null>(null);

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
    ipHas: true, // เปลี่ยนเป็น false (ค่าเริ่มต้นควรเป็น false)
    ipProtectionStatus: "",
    ipRequestNumber: "",
    ipTypes: [] as string[],
    
    // Supporter
    supportDevNeeded: [] as string[],
    supportMarketNeeded: [] as string[],
    businessPartner: "",
    readyForShowcase: "",
    consent: "",
    otherSupportMarket: "",
    additionalDocuments: null as File | null,
  });

  // --- Error state for each step ---
  const [stepError, setStepError] = useState<string>("");

  // --- Refs for required fields ---
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
    researchTitle: useRef<HTMLInputElement>(null),
    researchType: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    keywords: useRef<HTMLInputElement>(null),
    // ...add more if needed...
  };

  // --- Load formData from localStorage on mount ---
  useEffect(() => {
    const savedStep = localStorage.getItem("currentFormStep");
    if (savedStep) {
      setCurrentFormStep(Number(savedStep));
    }
    const savedFormData = localStorage.getItem("researcherFormData");
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch {}
    }
  }, []);

  // --- Save formData to localStorage on change ---
  useEffect(() => {
    localStorage.setItem("researcherFormData", JSON.stringify(formData));
  }, [formData]);

  // --- Save currentFormStep to localStorage on change ---
  useEffect(() => {
    localStorage.setItem("currentFormStep", currentFormStep.toString());
  }, [currentFormStep]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Validation for each step, return {valid, firstMissingField} ---
  function validateStepWithField(step: number): { valid: boolean; firstField?: string } {
    if (step === 1) {
      const required = [
        "headPrefix", "headAcademicPosition", "headFirstName", "headLastName",
        "headDepartment", "headPhoneNumber", "headEmail",
        "coordinatorFirstName", "coordinatorLastName", "coordinatorPhoneNumber", "coordinatorEmail"
      ];
      for (const field of required) {
        if (!formData[field]) return { valid: false, firstField: field };
      }
      if (formData.isUrgent && !formData.urgentReason.trim()) {
        return { valid: false, firstField: "urgentReason" };
      }
      return { valid: true };
    }
    if (step === 2) {
      const required = ["researchTitle", "researchType", "description"];
      for (const field of required) {
        if (!formData[field]) return { valid: false, firstField: field };
      }
      return { valid: true };
    }
    if (step === 3) {
      // เงื่อนไข: ต้องมีข้อความ "Research ของคุณอยู่ในระดับ ..." (trlLevel !== null)
      return { valid: trlLevel !== null };
    }
    if (step === 4) {
      // ตรวจสอบทุกใบ (form) ที่เพิ่มเข้ามา
      if (!formData.ipHas) {
        setStepError("");
        return { valid: true };
      }
      // สมมติว่า IntellectualProperty sync ข้อมูลใบล่าสุดไว้ใน formData, แต่เราต้อง validate ทุกใบ
      // ดังนั้นควรให้ IntellectualProperty sync forms ทั้งหมดไว้ใน formData เช่น formData.ipForms
      // ถ้าไม่มี formData.ipForms ให้ fallback เป็น 1 ใบเดิม
      const ipForms = formData.ipForms || [
        {
          ipStatus: formData.ipProtectionStatus,
          ipTypes: formData.ipTypes,
          requestNumbers: formData.ipRequestNumber ? { [formData.ipTypes?.[0] || ""]: formData.ipRequestNumber } : {},
        },
      ];
      for (let i = 0; i < ipForms.length; i++) {
        const form = ipForms[i];
        if (!form.ipStatus) {
          setStepError(`กรุณาเลือกสถานะการคุ้มครองทรัพย์สินทางปัญญา (ใบที่ ${i + 1})`);
          return { valid: false, firstField: "ipProtectionStatus" };
        }
        if (!form.ipTypes || form.ipTypes.length === 0) {
          setStepError(`กรุณาระบุประเภททรัพย์สินทางปัญญา (ใบที่ ${i + 1})`);
          return { valid: false, firstField: "ipTypes" };
        }
        if (form.ipStatus === "ได้เลขที่คำขอแล้ว" && !form.requestNumbers?.[form.ipTypes[0]]) {
          setStepError(`กรุณาระบุเลขที่คำขอ (ใบที่ ${i + 1})`);
          return { valid: false, firstField: "ipRequestNumber" };
        }
      }
      setStepError("");
      return { valid: true };
    }
    if (step === 5) {
      // Supporter
      // ตรวจสอบว่า supportDevNeeded และ supportMarketNeeded เป็น array จริงและมีอย่างน้อย 1 ค่า (ไม่ใช่ string)
      if (
        Array.isArray(formData.supportDevNeeded) && formData.supportDevNeeded.length > 0 &&
        Array.isArray(formData.supportMarketNeeded) && formData.supportMarketNeeded.length > 0
      ) {
        return { valid: true };
      }
      setStepError("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
      return { valid: false, firstField: !Array.isArray(formData.supportDevNeeded) || formData.supportDevNeeded.length === 0 ? "supportDevNeeded" : "supportMarketNeeded" };
    }
    return true;
  }

  // --- Scroll to field if missing ---
  function scrollToField(field?: string) {
    if (field && refs[field] && refs[field].current) {
      refs[field].current.scrollIntoView({ behavior: "smooth", block: "center" });
      refs[field].current.focus();
    }
  }

  // --- Next handler with validation ---
  const handleNext = () => {
    const { valid, firstField } = validateStepWithField(currentFormStep);
    if (!valid) {
      if (currentFormStep === 3) {
        setStepError("กรุณาตอบแบบประเมิน TRL ให้ครบจนปรากฏข้อความระดับ TRL ก่อนดำเนินการต่อ");
      } else {
        setStepError("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
        setTimeout(() => scrollToField(firstField), 100);
      }
      return;
    }
    setStepError("");
    if (currentFormStep < 5) {
      setCurrentFormStep(currentFormStep + 1);
      localStorage.setItem("currentFormStep", (currentFormStep + 1).toString());
    }
  };

  // --- Submit handler with validation ---
  const handleSubmit = async () => {
    const { valid, firstField } = validateStepWithField(currentFormStep);
    if (!valid) {
      setStepError("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
      setTimeout(() => scrollToField(firstField), 100);
      return;
    }
    setStepError("");
    setShowConfirmDialog(true);
  };

  // --- Confirm dialog: ส่งข้อมูลจริงและลบ localStorage ---
  const handleConfirmSubmit = async () => {
    // --- Prepare payload ---
    const payload: any = {
      // researcherDetails
      headPrefix: formData.headPrefix,
      headAcademicPosition: formData.headAcademicPosition,
      headFirstName: formData.headFirstName,
      headLastName: formData.headLastName,
      headDepartment: formData.headDepartment,
      headPhoneNumber: formData.headPhoneNumber,
      headEmail: formData.headEmail,
      coordinatorFirstName: formData.coordinatorFirstName,
      coordinatorLastName: formData.coordinatorLastName,
      coordinatorPhoneNumber: formData.coordinatorPhoneNumber,
      coordinatorEmail: formData.coordinatorEmail,
      isUrgent: formData.isUrgent,
      urgentReason: formData.urgentReason,

      // researchDetails
      researchTitle: formData.researchTitle,
      researchType: formData.researchType,
      description: formData.description,
      keywords: formData.keywords,

      // evaluateTRL
      trlSoftware: formData.trlSoftware,
      trlMedicalDevices: formData.trlMedicalDevices,
      trlMedicinesVaccines: formData.trlMedicinesVaccines,
      trlPlantAnimalBreeds: formData.trlPlantAnimalBreeds,
      stageOfDevelopment: formData.stageOfDevelopment,
      currentChallenges: formData.currentChallenges,
      targetUsers: formData.targetUsers,

      // intellectualProperty
      ipProtectionStatus: formData.ipProtectionStatus,
      ipRequestNumber: formData.ipRequestNumber,
      ipTypes: formData.ipTypes,

      // Supporter
      supportDevNeeded: formData.supportDevNeeded,
      supportMarketNeeded: formData.supportMarketNeeded,
      businessPartner: formData.businessPartner,
      readyForShowcase: formData.readyForShowcase,
      consent: formData.consent,
      otherSupportMarket: formData.otherSupportMarket,
    };

    try {
      let response;
      if (formData.additionalDocuments) {
        const form = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value instanceof Blob) {
            form.append(key, value);
          } else if (typeof value === "object" && value !== null) {
            form.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            form.append(key, String(value));
          }
        });
        form.append("additionalDocuments", formData.additionalDocuments);

        response = await fetch(`${BACKEND_HOST}/api/cases`, {
          method: "POST",
          body: form,
        });
      } else {
        response = await fetch(`${BACKEND_HOST}/api/cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      navigate('/researcher-dashboard');
      localStorage.removeItem("currentFormStep");
      localStorage.removeItem("researcherFormData"); // ลบข้อมูลที่เก็บไว้หลังส่งสำเร็จ
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
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

  // --- ส่ง setTrlLevel ไปยัง EvaluateTRL ---
  const renderFormStep = () => {
    switch (currentFormStep) {
      case 1:
        return <ResearcherDetails formData={formData} handleInputChange={handleInputChange} refs={refs} />;
      case 2:
        return <ResearchDetails formData={formData} handleInputChange={handleInputChange} refs={refs} />;
      case 3:
        return <EvaluateTRL formData={formData} handleInputChange={handleInputChange} setTrlLevel={setTrlLevel} />;
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

  const handlePrev = () => {
    if (currentFormStep > 1) {
      setCurrentFormStep(currentFormStep - 1);
      localStorage.setItem("currentFormStep", (currentFormStep - 1).toString());
    }
  };

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
            {stepError && (
              <div className="text-red-500 font-semibold mt-4">{stepError}</div>
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

                {/* ปรับปุ่ม Submit ที่ step 5 */}
                {currentFormStep === 5 ? (
                  <Button
                    onClick={handleSubmit}
                  >
                    Submit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                  >
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
              <Button onClick={handleConfirmSubmit}>
                Confirm and Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}