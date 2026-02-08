import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface ResearchFormData {
    researchTitle: string;
    researchType: string;
    description: string;
    keywords: string;
    researchDetailsFiles: File[];
}

type ResearchFormRefs = {
    researchTitle?: React.RefObject<HTMLInputElement>;
    researchType?: React.RefObject<HTMLDivElement>;
    description?: React.RefObject<HTMLTextAreaElement>;
    keywords?: React.RefObject<HTMLInputElement>;
};

interface ResearchDetailsProps {
    formData: ResearchFormData;
    handleInputChange: (field: keyof ResearchFormData, value: string | File[]) => void;
    refs?: ResearchFormRefs;
}

export default function ResearchDetails({ formData, handleInputChange, refs }: ResearchDetailsProps) {
    return (
        <div className="space-y-4 flex flex-col gap-2 text-gray-600">
            <div>
                <h3 className="font-semibold text-primary">ชื่อผลงานนวัตกรรม<span className="text-red-500">*</span></h3>
                <Input
                    id="researchTitle"
                    value={formData.researchTitle}
                    onChange={(e) => handleInputChange("researchTitle", e.target.value)}
                    placeholder="ใส่ชื่อผลงานนวัตกรรม"
                    required
                    ref={refs?.researchTitle}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">ประเภทงานวิจัย<span className="text-red-500">*</span></h3>
                <RadioGroup
                    id="researchType"
                    value={formData.researchType}
                    onValueChange={(value) => handleInputChange("researchType", value)}
                    className="space-y-2 mt-2"
                    ref={refs?.researchType}
                    required
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
                <p className="text-base font-semibold">คำอธิบายโดยย่อของนวัตกรรม<span className="text-red-500">*</span> (ไม่เกิน 350 คำ)</p>
                <p className="text-xs text-muted-foreground mb-1">
                    โดยอาจมีหัวข้อดังนี้: 1) Technology Overview, 2) Features & Specifications, 3) Potential Applications, 4) Unique Selling Point
                </p>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="อธิบายสรุปเกี่ยวกับผลงานนวัตกรรมของคุณ"
                    rows={6}
                    required
                    ref={refs?.description}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">คำสำคัญ (Keywords)<span className="text-red-500">*</span></h3>
                <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange("keywords", e.target.value)}
                    placeholder="เช่น AI, Healthcare, Medical devices"
                    required
                    ref={refs?.keywords}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">เอกสารเพิ่มเติม (แนบไฟล์ - เลือกได้หลายไฟล์)</h3>
                <div className="flex gap-2 items-center mt-2">
                    <button
                        type="button"
                        onClick={() => document.getElementById('researchDetailsFiles')?.click()}
                        className="w-30 sm:w-auto px-2 py-1 bg-gray-100/50 border border-gray-200 text-gray-400 rounded-lg hover:bg-primary hover:border-primary hover:text-white transition-colors duration-300 focus:outline-none focus:bg-primary focus:text-white"
                    >
                        เลือกไฟล์
                    </button>
                    <input
                        type="file"
                        id="researchDetailsFiles"
                        name="researchDetailsFiles"
                        accept=".pdf"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            handleInputChange("researchDetailsFiles", files);
                        }}
                        className="hidden"
                    />
                    {formData.researchDetailsFiles && formData.researchDetailsFiles.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <h4 className="text-sm text-gray-600">
                                <span>ไฟล์ที่เลือก ({formData.researchDetailsFiles.length} ไฟล์):</span>
                            </h4>
                            {formData.researchDetailsFiles.map((file: File, index: number) => (
                                <span key={index} className="text-sm text-primary ml-2">
                                    {index + 1}. {file.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}