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
  const [formData, setFormData] = useState({
    // Step 1: TRL Type
    researchType: "",
    
    // Step 2: Research Details
    researchTitle: "",
    description: "",
    objectives: "",
    
    // Step 3: Technical Details
    methodology: "",
    technologies: "",
    timeline: "",
    resources: "",
    
    // Step 4: Commercial Opportunity
    marketPotential: "",
    competitiveAdvantage: "",
    businessModel: "",
    funding: "",
    
    // Step 5: Innovation Showcase
    innovation: "",
    impact: "",
    publications: "",
    patents: ""
  });

  const formSteps = [
    { id: 1, title: "TRL Type", fields: ["researchType"] },
    // { id: 1, title: "Researcher Information", fields: ["name", "email", "institution", "position"] },
    { id: 2, title: "Research Details", fields: ["researchTitle", "researchType", "description", "objectives"] },
    { id: 3, title: "Technical Details", fields: ["methodology", "technologies", "timeline", "resources"] },
    { id: 4, title: "Commercial Opportunity", fields: ["marketPotential", "competitiveAdvantage", "businessModel", "funding"] },
    { id: 5, title: "Innovation Showcase", fields: ["innovation", "impact", "publications", "patents"] }
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
              <Label htmlFor="objectives">Research Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange("objectives", e.target.value)}
                placeholder="What are your research objectives?"
                rows={3}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="methodology">Methodology</Label>
              <Textarea
                id="methodology"
                value={formData.methodology}
                onChange={(e) => handleInputChange("methodology", e.target.value)}
                placeholder="Describe your research methodology"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="technologies">Technologies Used</Label>
              <Textarea
                id="technologies"
                value={formData.technologies}
                onChange={(e) => handleInputChange("technologies", e.target.value)}
                placeholder="List technologies and tools"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="timeline">Project Timeline</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) => handleInputChange("timeline", e.target.value)}
                placeholder="e.g., 12 months"
              />
            </div>
            <div>
              <Label htmlFor="resources">Required Resources</Label>
              <Textarea
                id="resources"
                value={formData.resources}
                onChange={(e) => handleInputChange("resources", e.target.value)}
                placeholder="List required resources"
                rows={3}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="marketPotential">Market Potential</Label>
              <Textarea
                id="marketPotential"
                value={formData.marketPotential}
                onChange={(e) => handleInputChange("marketPotential", e.target.value)}
                placeholder="Describe the market potential"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
              <Textarea
                id="competitiveAdvantage"
                value={formData.competitiveAdvantage}
                onChange={(e) => handleInputChange("competitiveAdvantage", e.target.value)}
                placeholder="What makes your research unique?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="businessModel">Business Model</Label>
              <Textarea
                id="businessModel"
                value={formData.businessModel}
                onChange={(e) => handleInputChange("businessModel", e.target.value)}
                placeholder="Describe potential business model"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="funding">Funding Requirements</Label>
              <Input
                id="funding"
                value={formData.funding}
                onChange={(e) => handleInputChange("funding", e.target.value)}
                placeholder="Estimated funding needed"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="innovation">Innovation Highlights</Label>
              <Textarea
                id="innovation"
                value={formData.innovation}
                onChange={(e) => handleInputChange("innovation", e.target.value)}
                placeholder="Highlight key innovations"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="impact">Expected Impact</Label>
              <Textarea
                id="impact"
                value={formData.impact}
                onChange={(e) => handleInputChange("impact", e.target.value)}
                placeholder="Describe expected societal impact"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="publications">Publications</Label>
              <Textarea
                id="publications"
                value={formData.publications}
                onChange={(e) => handleInputChange("publications", e.target.value)}
                placeholder="List relevant publications"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="patents">Patents/IP</Label>
              <Textarea
                id="patents"
                value={formData.patents}
                onChange={(e) => handleInputChange("patents", e.target.value)}
                placeholder="List patents or intellectual property"
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
                  <p><strong>Objectives:</strong> {formData.objectives}</p>
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">Technical Details</h3>
                <div className="space-y-1">
                  <p><strong>Methodology:</strong> {formData.methodology}</p>
                  <p><strong>Technologies:</strong> {formData.technologies}</p>
                  <p><strong>Timeline:</strong> {formData.timeline}</p>
                  <p><strong>Resources:</strong> {formData.resources}</p>
                </div>
              </div>

              {/* Commercial Opportunity */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">Commercial Opportunity</h3>
                <div className="space-y-1">
                  <p><strong>Market Potential:</strong> {formData.marketPotential}</p>
                  <p><strong>Competitive Advantage:</strong> {formData.competitiveAdvantage}</p>
                  <p><strong>Business Model:</strong> {formData.businessModel}</p>
                  <p><strong>Funding:</strong> {formData.funding}</p>
                </div>
              </div>

              {/* Innovation Showcase */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">Innovation Showcase</h3>
                <div className="space-y-1">
                  <p><strong>Innovation:</strong> {formData.innovation}</p>
                  <p><strong>Impact:</strong> {formData.impact}</p>
                  <p><strong>Publications:</strong> {formData.publications}</p>
                  <p><strong>Patents:</strong> {formData.patents}</p>
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