import React from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    return (
        <div className="space-y-4 flex flex-col gap-2 text-gray-600">
            <div>
                <h3 className="font-semibold text-primary">{t("form.innovationNameLabel")}<span className="text-red-500">*</span></h3>
                <Input
                    id="researchTitle"
                    value={formData.researchTitle}
                    onChange={(e) => handleInputChange("researchTitle", e.target.value)}
                    placeholder={t("form.innovationNamePlaceholder")}
                    required
                    ref={refs?.researchTitle}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">{t("form.researchType")}<span className="text-red-500">*</span></h3>
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
                        <Label htmlFor="software">{t("form.researchTypeSoftware")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TRL medical devices" id="medical" />
                        <Label htmlFor="medical">{t("form.researchTypeMedical")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TRL medicines vaccines stem cells" id="medicines" />
                        <Label htmlFor="medicines">{t("form.researchTypeMedicines")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="TRL plant/animal breeds" id="plant" />
                        <Label htmlFor="plant">{t("form.researchTypePlant")}</Label>
                    </div>
                </RadioGroup>
            </div>
            <div>
                <p className="text-base font-semibold">{t("form.descriptionLabel")}<span className="text-red-500">*</span></p>
                <p className="text-xs text-muted-foreground mb-1">
                    {t("form.descriptionHint")}
                </p>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder={t("form.innovationDescPlaceholder")}
                    rows={6}
                    required
                    ref={refs?.description}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">{t("form.keywordsLabel")}<span className="text-red-500">*</span></h3>
                <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange("keywords", e.target.value)}
                    placeholder={t("form.keywordsPlaceholder")}
                    required
                    ref={refs?.keywords}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">{t("form.additionalDocsLabel")}</h3>
                <div className="flex gap-2 items-center mt-2">
                    <button
                        type="button"
                        onClick={() => document.getElementById('researchDetailsFiles')?.click()}
                        className="w-30 sm:w-auto px-2 py-1 bg-gray-100/50 border border-gray-200 text-gray-400 rounded-lg hover:bg-primary hover:border-primary hover:text-white transition-colors duration-300 focus:outline-none focus:bg-primary focus:text-white"
                    >
                        {t("form.selectFile")}
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
                                <span>{t("form.filesSelectedCount", { count: formData.researchDetailsFiles.length })}</span>
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