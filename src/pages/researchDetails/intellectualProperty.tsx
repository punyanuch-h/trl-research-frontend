import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Plus } from "lucide-react";

interface IntellectualPropertyProps {
    formData: {
        ipProtectionStatus: string;
    };
    handleInputChange: (field: string, value: any) => void;
}

interface IpFormState {
    ipTypes: string[];
    requestNumbers: { [key: string]: string };
}

const ipTypesList = [
    { id: "patent", label: "สิทธิบัตร" },
    { id: "pettyPatent", label: "อนุสิทธิบัตร" },
    { id: "designPatent", label: "สิทธิบัตรออกแบบผลิตภัณฑ์" },
    { id: "copyright", label: "ลิขสิทธิ์" },
    { id: "trademark", label: "เครื่องหมายการค้า" },
    { id: "tradeSecret", label: "ความลับทางการค้า" },
];

export default function IntellectualProperty({ formData, handleInputChange }: IntellectualPropertyProps) {
    const [forms, setForms] = useState<IpFormState[]>([{ ipTypes: [], requestNumbers: {} }]);

    useEffect(() => {
        // Reset forms when switching to 'ไม่มี'
        if (formData.ipProtectionStatus === "ไม่มี") {
            setForms([{ ipTypes: [], requestNumbers: {} }]);
        }
    }, [formData.ipProtectionStatus]);

    const handleFormTypeChange = (formIndex: number, newIpType: string) => {
        setForms(currentForms => {
            const updatedForms = [...currentForms];
            updatedForms[formIndex].ipTypes = [newIpType]; 

            // clear request type
            updatedForms[formIndex].requestNumbers = {};
            
            return updatedForms;
        });
    };

    const handleFormRequestNumberChange = (formIndex: number, ipType: string, value: string) => {
        setForms(currentForms => {
            const updatedForms = [...currentForms];
            updatedForms[formIndex].requestNumbers[ipType] = value;
            return updatedForms;
        });
    };

    const handleAddForm = () => {
        setForms(currentForms => [...currentForms, { ipTypes: [], requestNumbers: {} }]);
    };
    
    const handleRemoveForm = (formIndex: number) => {
        // Only allow removing if there is more than one form
        if (forms.length > 1) {
            setForms(currentForms => currentForms.filter((_, i) => i !== formIndex));
        }
    };

    // Determine if the form content should be shown
    const showFormContent = formData.ipProtectionStatus === "ได้เลขที่คำขอแล้ว" || formData.ipProtectionStatus === "กำลังดำเนินการ";

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-primary">สถานะการคุ้มครองทรัพย์สินทางปัญญา*</h3>
                <RadioGroup
                    id="ipProtectionStatus"
                    value={formData.ipProtectionStatus}
                    onValueChange={(value) => handleInputChange("ipProtectionStatus", value)}
                    className="space-y-2 mt-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ได้เลขที่คำขอแล้ว" id="hasNumber" />
                        <Label htmlFor="hasNumber">ได้เลขที่คำขอแล้ว</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="กำลังดำเนินการ" id="inProgress" />
                        <Label htmlFor="inProgress">กำลังดำเนินการ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ไม่มี" id="none" />
                        <Label htmlFor="none">ไม่มี</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Conditional Rendering based on ipProtectionStatus */}
            {showFormContent && (
                <div className="space-y-6">
                    {forms.map((form, formIndex) => (
                        <div key={formIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-lg text-primary-80">ใบที่ {formIndex + 1}</h4>
                                {forms.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveForm(formIndex)}
                                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                                        aria-label={`Remove form ${formIndex + 1}`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-primary">ระบุประเภท*</h3>
                                <RadioGroup
                                    id={`ipTypes-group-${formIndex}`}
                                    // ใช้ form.ipTypes[0] เพื่อให้เป็นค่าที่ถูกเลือกใน RadioGroup
                                    value={form.ipTypes[0] || ""} 
                                    onValueChange={(value) => handleFormTypeChange(formIndex, value)}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2"
                                >
                                    {ipTypesList.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={item.id}
                                                id={`${item.id}-${formIndex}`}
                                            />
                                            <Label htmlFor={`${item.id}-${formIndex}`}>{item.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            
                            {/* Conditionally render request number inputs */}
                            {formData.ipProtectionStatus === "ได้เลขที่คำขอแล้ว" && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-primary">ระบุเลขที่คำขอ*</h3>
                                        <div className="space-y-1">
                                            <Input
                                                type="text"
                                                id={`${form.ipTypes[0]}-number-${formIndex}`}
                                                value={form.requestNumbers[form.ipTypes[0]] || ""}
                                                onChange={(e) => handleFormRequestNumberChange(formIndex, form.ipTypes[0], e.target.value)}
                                                placeholder="เช่น 123456789"
                                                className="mt-1"
                                            />
                                        </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button
                            onClick={handleAddForm}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        >
                            <Plus className="w-4 h-4" /> add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}