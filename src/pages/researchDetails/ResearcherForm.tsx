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
import { BACKEND_HOST } from "@/constant/constants";

// Import components
import ResearcherDetails from '@/pages/researchDetails/researcherDetails';
import ResearchDetails from '@/pages/researchDetails/researchDetails';
import EvaluateTRL from '@/pages/researchDetails/evaluateTRL';
import IntellectualProperty from '@/pages/researchDetails/intellectualProperty';
import Supporter from '@/pages/researchDetails/Supporter';

interface IpForm {
  noIp?: boolean;
  ipTypes: string[];
  ipStatus: string;
  requestNumbers: Record<string, string>;
}

type FormState = {
  // researcher_info
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
  additionalDocuments: File | null;
};

export default function ResearcherForm() {
  const navigate = useNavigate();
  const [currentFormStep, setCurrentFormStep] = useState<number>(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [trlLevel, setTrlLevel] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    // researcher_info
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
    researcherId: "",
    trlScore: "",
    status: false,
    isUrgent: false,
    urgentReason: "",
    urgentFeedback: "",
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
    // Assessment_trl
    trlLevelResult: null,
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
    ipForms: [] as IpForm[],
    // Supporter
    supportDevNeeded: [] as string[],
    supportMarketNeeded: [] as string[],
    businessPartner: "",
    readyForShowcase: "",
    consent: "",
    otherSupportMarket: "",
    additionalDocuments: null,
  });

  const [stepError, setStepError] = useState<string>("");

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

  // Load from localStorage
  useEffect(() => {
    const savedStep = localStorage.getItem("currentFormStep");
    if (savedStep) {
      setCurrentFormStep(Number(savedStep));
    }
    const savedFormData = localStorage.getItem("researcherFormData");
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        // ensure trlLevelResult is number|null (backwards-compat)
        if (parsed && parsed.trlLevelResult !== undefined && parsed.trlLevelResult !== null) {
          parsed.trlLevelResult = typeof parsed.trlLevelResult === "number" ? parsed.trlLevelResult : Number(parsed.trlLevelResult) || null;
        }
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("researcherFormData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("currentFormStep", currentFormStep.toString());
  }, [currentFormStep]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation
  function validateStepWithField(step: number): { valid: boolean; firstField?: string } {
    if (step === 1) {
      const required = [
        "headPrefix", "headAcademicPosition", "headFirstName", "headLastName",
        "headDepartment", "headPhoneNumber", "headEmail",
        "coordinatorFirstName", "coordinatorLastName", "coordinatorPhoneNumber", "coordinatorEmail"
      ];
      for (const field of required) {
        // @ts-ignore dynamic access
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
        // @ts-ignore dynamic access
        if (!formData[field]) return { valid: false, firstField: field };
      }
      return { valid: true };
    }
    if (step === 3) {
      return { valid: formData.trlLevelResult !== null, firstField: formData.trlLevelResult === null ? "trlLevelResult" : undefined };
    }
    if (step === 4) {
      if (!formData.ipHas) {
        setStepError("");
        return { valid: true };
      }
      const ipForms = (formData.ipForms && formData.ipForms.length > 0) ? formData.ipForms : [
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
      if (
        Array.isArray(formData.supportDevNeeded) && formData.supportDevNeeded.length > 0 &&
        Array.isArray(formData.supportMarketNeeded) && formData.supportMarketNeeded.length > 0
      ) {
        return { valid: true };
      }
      setStepError("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
      return { valid: false, firstField: !Array.isArray(formData.supportDevNeeded) || formData.supportDevNeeded.length === 0 ? "supportDevNeeded" : "supportMarketNeeded" };
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
    }
  };

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

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);

    try {
      // 1. Create Case
      console.log("📤 Creating case...");
      const casePayload = {
        // researcher_id: formData.researcherId,
        coordinator_email: formData.coordinatorEmail,
        trl_score: formData.trlScore ?? "",
        is_urgent: formData.isUrgent ?? false,
        urgent_reason: formData.urgentReason ?? "",
        urgent_feedback: formData.urgentFeedback ?? "",
        case_title: formData.researchTitle,
        case_type: formData.researchType,
        case_description: formData.description,
        case_keywords: formData.keywords,
        status: formData.status ?? false,
      };

      const caseResponse = await fetch(`${BACKEND_HOST}/trl/case`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(casePayload),
      });

      if (!caseResponse.ok) {
        const errText = await caseResponse.text();
        throw new Error(`Failed to create case: ${errText}`);
      }

      const caseData = await caseResponse.json();
      const caseId = caseData.case_id;
      console.log("✅ Case created:", caseId);

      // 2. Create Coordinator
      console.log("📤 Creating coordinator...");
      const coordinatorPayload = {
        coordinator_email: formData.coordinatorEmail,
        coordinator_name: `${formData.coordinatorFirstName} ${formData.coordinatorLastName}`,
        coordinator_phone: formData.coordinatorPhoneNumber,
        // coordinator_id: formData.sameAsHead ? formData.researcherId : undefined,
      };

      const coordinatorRes = await fetch(`${BACKEND_HOST}/trl/coordinator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coordinatorPayload),
      });

      if (!coordinatorRes.ok) {
        const errText = await coordinatorRes.text();
        throw new Error(`Failed to create coordinator: ${errText}`);
      }

      const coordinatorData = await coordinatorRes.json();
      console.log("✅ Coordinator created:", coordinatorData.coordinator_id);

      // 3. Create Assessment
      console.log("📤 Creating assessment...");
      const assessmentPayload = {
        // case_id: caseId,
        trl_level_result: formData.trlLevelResult,
        rq1_answer: formData.rq1_answer,
        rq2_answer: formData.rq2_answer,
        rq3_answer: formData.rq3_answer,
        rq4_answer: formData.rq4_answer,
        rq5_answer: formData.rq5_answer,
        rq6_answer: formData.rq6_answer,
        rq7_answer: formData.rq7_answer,
        cq1_answer: formData.cq1_answer || [],
        cq2_answer: formData.cq2_answer || [],
        cq3_answer: formData.cq3_answer || [],
        cq4_answer: formData.cq4_answer || [],
        cq5_answer: formData.cq5_answer || [],
        cq6_answer: formData.cq6_answer || [],
        cq7_answer: formData.cq7_answer || [],
        cq8_answer: formData.cq8_answer || [],
        cq9_answer: formData.cq9_answer || [],
      };

      const assessmentRes = await fetch(`${BACKEND_HOST}/trl/assessment_trl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentPayload),
      });

      if (!assessmentRes.ok) {
        const errText = await assessmentRes.text();
        throw new Error(`Failed to create assessment: ${errText}`);
      }

      const assessmentData = await assessmentRes.json();
      console.log("✅ Assessment created:", assessmentData.assessment_id);

      // 4. Create IP records (if applicable)
      if (formData.ipHas && Array.isArray(formData.ipForms) && formData.ipForms.length > 0) {
        console.log("📤 Creating IP records...");
        for (const ipForm of formData.ipForms) {
          if (ipForm.noIp) continue;

          const ipPayload = {
            // case_id: caseId,
            ip_types: ipForm.ipTypes[0] || "",
            ip_protection_status: ipForm.ipStatus || "",
            ip_request_number: ipForm.requestNumbers?.[ipForm.ipTypes[0]] || "",
          };

          const ipRes = await fetch(`${BACKEND_HOST}/trl/ip`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ipPayload),
          });

          if (!ipRes.ok){
            const errText = await ipRes.text();
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล IP: " + errText);
            return;
          }
        }
      }

      // 5. POST supporter
      const supporterPayload = {
        // case_id: caseId,
        support_research: (formData.supportDevNeeded || []).includes("ฝ่ายวิจัย"),
        support_vdc: (formData.supportDevNeeded || []).includes("ศูนย์ขับเคลื่อนคุณค่าการบริการ (Center for Value Driven Care: VDC)"),
        support_sieic: (formData.supportDevNeeded || []).includes("ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (Siriraj Excellent Innovation Center: SiEIC)"),
        need_protect_intellectual_property: (formData.supportMarketNeeded || []).includes("การคุ้มครองทรัพย์สินทางปัญญา"),
        need_co_developers: (formData.supportMarketNeeded || []).includes("หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม"),
        need_activities: (formData.supportMarketNeeded || []).includes("การจัดกิจกรรมร่วมกับผู้ร่วมพัฒนานวัตกรรม"),
        need_test: (formData.supportMarketNeeded || []).includes("หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม"),
        need_capital: (formData.supportMarketNeeded || []).includes("หาแหล่งทุน"),
        need_partners: (formData.supportMarketNeeded || []).includes("หาคู่ค้าทางธุรกิจ"),
        need_guidelines: (formData.supportMarketNeeded || []).includes("แนะนำแนวทางการเริ่มธุรกิจ"),
        need_certification: (formData.supportMarketNeeded || []).includes("การขอรับรองมาตรฐานหรือคุณภาพ"),
        need_account: (formData.supportMarketNeeded || []).includes("บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม"),
        need: formData.otherSupportMarket || "",
        additional_documents: "", // if you want to upload file, use multipart/form-data
      };

      const supporterRes = await fetch(`${BACKEND_HOST}/trl/supporter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supporterPayload),
      });

      if (!supporterRes.ok) {
        const errText = await supporterRes.text();
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล Supporter: " + errText);
        return;
      }

      // 6. Success - clear and navigate
      alert("บันทึกข้อมูลสำเร็จ!");
      localStorage.removeItem("currentFormStep");
      localStorage.removeItem("researcherFormData");
      navigate('/dashboard');

    } catch (err) {
      console.error("Error submitting form:", err);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล: " + (err as any)?.message);
    } finally {
      setIsSubmitting(false);
    }
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
          />
        );
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
                {currentFormStep === 5 ? (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
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
              <Button onClick={handleConfirmSubmit} disabled={isSubmitting}>
                Confirm and Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
