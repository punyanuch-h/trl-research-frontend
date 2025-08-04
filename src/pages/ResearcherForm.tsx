import type { TRLItem } from '../types/trl';
import mockTRL from "../mockData/mockTRL";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowLeft as PrevIcon, CheckSquare } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";


export default function ResearcherForm() {
  const navigate = useNavigate();
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // ดึงข้อมูลตัวอย่างจาก mockTRL ตัวแรก
  const example: TRLItem = mockTRL[0];

  // ตั้งค่า formData เริ่มต้นด้วยข้อมูลจาก mockTRL
  const [formData, setFormData] = useState({
    // Step 1: TRL Type
    researchType: example.researchType || "",

    // Step 2: Research Details
    researchTitle: example.researchTitle || "",
    description: example.description || "",
    stageOfDevelopment: example.stageOfDevelopment || "",
    currentChallenges: example.currentChallenges || "",
    targetUsers: example.targetUsers || "",

    // Step 3: Technical Details
    technologiesUsed: example.technologiesUsed || "",
    marketComparison: example.marketComparison || "",
    ipStatus: example.ipStatus || "",
    marketing: example.marketing || "",
    support: example.support || "",

    // Step 4: Commercial Opportunity
    medicalBenefits: example.medicalBenefits || "",
    commercializationChallenges: example.commercializationChallenges || "",
    devSupportNeeded: example.devSupportNeeded || "",
    marketSupportNeeded: example.marketSupportNeeded || "",
    hasBusinessPartner: example.hasBusinessPartner || "",

    // Step 5: Innovation Showcase
    readyForShowcase: example.readyForShowcase || "",
    consent: example.consent || "",
  });

  const formSteps = [
    { id: 1, title: "TRL Type", fields: ["researchType"] },
    { id: 2, title: "Research Details", fields: ["researchTitle", "description", "stageOfDevelopment", "currentChallenges", "targetUsers"] },
    { id: 3, title: "Technical Details", fields: ["technologiesUsed", "marketComparison", "ipStatus", "marketing", "support"] },
    { id: 4, title: "Commercial Opportunity", fields: ["medicalBenefits", "commercializationChallenges", "devSupportNeeded", "marketSupportNeeded", "hasBusinessPartner"] },
    { id: 5, title: "Innovation Showcase", fields: ["readyForShowcase", "consent"] }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentFormStep < 5) {
      setCurrentFormStep(currentFormStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentFormStep > 1) {
      setCurrentFormStep(currentFormStep - 1);
    }
  };

  const handleSubmit = () => {
    // Navigate to researcher dashboard after form submission
    navigate('/researcher-dashboard');
  };

  const renderFormStep = () => {
    switch (currentFormStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <RadioGroup
                id="researchType"
                value={formData.researchType}
                onValueChange={(value) => handleInputChange("researchType", value)}
                className="space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TRL software" id="software" />
                  <Label htmlFor="software">TRL software</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TRL medical devices" id="medical" />
                  <Label htmlFor="medical">TRL medical devices</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TRL medicines vaccines stem cells" id="medicines" />
                  <Label htmlFor="medicines">TRL medicines vaccines stem cells</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TRL plant/animal breeds" id="plant" />
                  <Label htmlFor="plant">TRL plant/animal breeds</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="researchTitle">Research Title</Label>
              <Input
                id="researchTitle"
                value={formData.researchTitle}
                onChange={(e) => handleInputChange("researchTitle", e.target.value)}
                placeholder="Enter research title"
              />
            </div>
            <div>
              <Label htmlFor="description">Research Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your research project"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="stageOfDevelopment">Research Stage Of Development</Label>
              <Textarea
                id="stageOfDevelopment"
                value={formData.stageOfDevelopment}
                onChange={(e) => handleInputChange("stageOfDevelopment", e.target.value)}
                placeholder="What is the current stage of development?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="currentChallenges">Current Challenges</Label>
              <Textarea
                id="currentChallenges"
                value={formData.currentChallenges}
                onChange={(e) => handleInputChange("currentChallenges", e.target.value)}
                placeholder="What challenges are you currently facing?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="targetUsers">Target Users</Label>
              <Textarea
                id="targetUsers"
                value={formData.targetUsers}
                onChange={(e) => handleInputChange("targetUsers", e.target.value)}
                placeholder="Who are the target users for your research?"
                rows={3}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="technologiesUsed">Technologies Used</Label>
              <Textarea
                id="technologiesUsed"
                value={formData.technologiesUsed}
                onChange={(e) => handleInputChange("technologiesUsed", e.target.value)}
                placeholder="Describe the technologies used in your research"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="marketComparison">Market Comparison</Label>
              <Textarea
                id="marketComparison"
                value={formData.marketComparison}
                onChange={(e) => handleInputChange("marketComparison", e.target.value)}
                placeholder="List technologies and tools"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="ipStatus">IP Status</Label>
              <Input
                id="ipStatus"
                value={formData.ipStatus}
                onChange={(e) => handleInputChange("ipStatus", e.target.value)}
                placeholder="e.g., 12 months"
              />
            </div>
            <div>
              <Label htmlFor="marketing">Marketing</Label>
              <Textarea
                id="marketing"
                value={formData.marketing}
                onChange={(e) => handleInputChange("marketing", e.target.value)}
                placeholder="List marketing strategies"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="support">Support</Label>
              <Textarea
                id="support"
                value={formData.support}
                onChange={(e) => handleInputChange("support", e.target.value)}
                placeholder="What support do you need?"
                rows={3}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="medicalBenefits">Medical Benefits</Label>
              <Textarea
                id="medicalBenefits"
                value={formData.medicalBenefits}
                onChange={(e) => handleInputChange("medicalBenefits", e.target.value)}
                placeholder="Describe the medical benefits"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="commercializationChallenges">Commercialization Challenges</Label>
              <Textarea
                id="commercializationChallenges"
                value={formData.commercializationChallenges}
                onChange={(e) => handleInputChange("commercializationChallenges", e.target.value)}
                placeholder="What challenges do you anticipate?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="devSupportNeeded">Development Support Needed</Label>
              <Textarea
                id="devSupportNeeded"
                value={formData.devSupportNeeded}
                onChange={(e) => handleInputChange("devSupportNeeded", e.target.value)}
                placeholder="Describe the development support needed"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="marketSupportNeeded">Market Support Needed</Label>
              <Textarea
                id="marketSupportNeeded"
                value={formData.marketSupportNeeded}
                onChange={(e) => handleInputChange("marketSupportNeeded", e.target.value)}
                placeholder="Describe the market support needed"
              />
            </div>
            <div>
              <Label htmlFor="hasBusinessPartner">Business Partner</Label>
              <Input
                id="hasBusinessPartner"
                value={formData.hasBusinessPartner}
                onChange={(e) => handleInputChange("hasBusinessPartner", e.target.value)}
                placeholder="Do you have a business partner?"
              />  
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="readyForShowcase">Ready for Showcase</Label>
              <Textarea
                id="readyForShowcase"
                value={formData.readyForShowcase}
                onChange={(e) => handleInputChange("readyForShowcase", e.target.value)}
                placeholder="Highlight key innovations"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="consent">Consent</Label>
              <Textarea
                id="consent"
                value={formData.consent}
                onChange={(e) => handleInputChange("consent", e.target.value)}
                placeholder="Describe consent considerations"
                rows={3}
              />
            </div>
          </div>
        );
      default:
        return null;
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
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Research Submission Form</h1>
            <p className="text-muted-foreground">Step {currentFormStep} of 5: {formSteps[currentFormStep - 1].title}</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {formSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentFormStep
                    ? "bg-primary text-primary-foreground"
                    : step.id < currentFormStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step.id}
                </div>
                <div className="ml-2 text-sm font-medium">
                  Step {step.id}
                </div>
                {index < formSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
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
                <PrevIcon className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex gap-3">
                <AlertDialog>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you finished editing this research? This will save your changes and return you to the researcher dashboard.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          navigate('/researcher-dashboard');
                        }}
                      >
                        Confirm & Return to Dashboard
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {currentFormStep === 5 ? (
                  <Button onClick={() => setShowConfirmDialog(true)}>
                    Submit Research
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

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Your Submission</DialogTitle>
              <DialogDescription>
                Please review the information before submitting your research.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 text-sm text-foreground">
              {/* Research Type */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">Research Type</h3>
                <p>{formData.researchType}</p>
              </div>

              {/* Research Details */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">Research Details</h3>
                <div className="space-y-1">
                  <p><strong>Title:</strong> {formData.researchTitle}</p>
                  <p><strong>Description:</strong> {formData.description}</p>
                  <p><strong>Stage of Development:</strong> {formData.stageOfDevelopment}</p>
                  <p><strong>Current Challenges:</strong> {formData.currentChallenges}</p>
                  <p><strong>Target Users:</strong> {formData.targetUsers}</p>
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">Technical Details</h3>
                <div className="space-y-1">
                  <p><strong>technologiesUsed:</strong> {formData.technologiesUsed}</p>
                  <p><strong>marketComparison:</strong> {formData.marketComparison}</p>
                  <p><strong>IP Status:</strong> {formData.ipStatus}</p>
                  <p><strong>marketing:</strong> {formData.marketing}</p>
                  <p><strong>support:</strong> {formData.support}</p>
                </div>
              </div>

              {/* Commercial Opportunity */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">Commercial Opportunity</h3>
                <div className="space-y-1">
                  <p><strong>Medical Benefits:</strong> {formData.medicalBenefits}</p>
                  <p><strong>Commercialization Challenges:</strong> {formData.commercializationChallenges}</p>
                  <p><strong>Dev Support Needed:</strong> {formData.devSupportNeeded}</p>
                  <p><strong>Market Support Needed:</strong> {formData.marketSupportNeeded}</p>
                  <p><strong>Business Partner:</strong> {formData.hasBusinessPartner}</p>
                </div>
              </div>

              {/* Innovation Showcase */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">Innovation Showcase</h3>
                <div className="space-y-1">
                  <p><strong>Ready For Showcase:</strong> {formData.readyForShowcase}</p>
                  <p><strong>Consent:</strong> {formData.consent}</p>
                </div>
              </div>
            </div>


            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Confirm & Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}