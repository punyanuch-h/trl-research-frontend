import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ResearchDetailsProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    refs?: any;
}

export default function ResearchDetails({ formData, handleInputChange, refs }: ResearchDetailsProps) {
    return (
        <div className="space-y-4 flex flex-col gap-2 text-gray-600">
            <div>
                <h3 className="font-semibold text-primary">ชื่อผลงานนวัตกรรม*</h3>
                <Input
                    id="researchTitle"
                    value={formData.researchTitle}
                    onChange={(e) => handleInputChange("researchTitle", e.target.value)}
                    placeholder="ใส่ชื่อผลงานนวัตกรรม"
                    ref={refs?.researchTitle}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">TRL Type*</h3>
                <RadioGroup
                    id="researchType"
                    value={formData.researchType}
                    onValueChange={(value) => handleInputChange("researchType", value)}
                    className="space-y-2 mt-2"
                    ref={refs?.researchType}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TRL software" id="software" />
                        <Label htmlFor="software">Software</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TRL medical devices" id="medical" />
                        <Label htmlFor="medical">Medical Devices</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TRL medicines vaccines stem cells" id="medicines" />
                        <Label htmlFor="medicines">Medicines Vaccines Stem Cells</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TRL plant/animal breeds" id="plant" />
                        <Label htmlFor="plant">Plant/Animal Breeds</Label>
                    </div>
                </RadioGroup>
            </div>
            <div>
                <p className="text-base font-semibold">คำอธิบายโดยย่อของนวัตกรรม* (ไม่เกิน 350 คำ)</p>
                <p className="text-xs text-muted-foreground mb-1">
                    โดยอาจมีหัวข้อดังนี้: 1) Technology Overview, 2) Features & Specifications, 3) Potential Applications, 4) Unique Selling Point
                </p>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="อธิบายสรุปเกี่ยวกับผลงานนวัตกรรมของคุณ"
                    rows={6}
                    ref={refs?.description}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">Keywords</h3>
                <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange("keywords", e.target.value)}
                    placeholder="เช่น AI, Healthcare, Medical devices"
                    ref={refs?.keywords}
                />
            </div>
        </div>
    );
}