import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { PhoneInput } from "@/components/format/PhoneInput";

interface ResearcherFormData {
    headPrefix: string;
    headAcademicPosition: string;
    headAcademicPositionOther?: string;
    headFirstName: string;
    headLastName: string;
    headDepartment: string;
    headPhoneNumber: string;
    headEmail: string;

    coordinatorPrefix: string;
    coordinatorAcademicPosition: string;
    coordinatorAcademicPositionOther?: string;
    coordinatorFirstName: string;
    coordinatorLastName: string;
    coordinatorDepartment: string;
    coordinatorPhoneNumber: string;
    coordinatorEmail: string;

    sameAsHead?: boolean;
    isUrgent?: boolean;
    urgentReason?: string;
}

interface ResearcherDetailsProps {
    formData: ResearcherFormData;
    handleInputChange: (field: keyof ResearcherFormData, value: string | boolean) => void;
    refs?: {
        headFirstName?: React.RefObject<HTMLInputElement>;
        headLastName?: React.RefObject<HTMLInputElement>;
        headDepartment?: React.RefObject<HTMLInputElement>;
        headPhoneNumber?: React.RefObject<HTMLInputElement>;
        headEmail?: React.RefObject<HTMLInputElement>;
        coordinatorFirstName?: React.RefObject<HTMLInputElement>;
        coordinatorLastName?: React.RefObject<HTMLInputElement>;
        coordinatorDepartment?: React.RefObject<HTMLInputElement>;
        coordinatorPhoneNumber?: React.RefObject<HTMLInputElement>;
        coordinatorEmail?: React.RefObject<HTMLInputElement>;
        urgentReason?: React.RefObject<HTMLTextAreaElement>;
    };
}

const ACADEMIC_POSITION_OPTIONS = ["none", "อ.", "ผศ.", "รศ.", "ศ."] as const;
type AcademicPosition = typeof ACADEMIC_POSITION_OPTIONS[number] | "other";

function normalizeAcademicPosition(
    value?: string
): { position: AcademicPosition; other?: string } {
    if (!value) {
        return { position: "none" };
    }

    if (ACADEMIC_POSITION_OPTIONS.includes(value as typeof ACADEMIC_POSITION_OPTIONS[number])) {
        return { position: value as AcademicPosition };
    }

    return {
        position: "other",
        other: value,
    };
}

export default function ResearcherDetails({
    formData,
    handleInputChange,
    refs,
}: ResearcherDetailsProps) {
    const { t } = useTranslation();
    const { data: userProfile } = useGetUserProfile();
    const [errors, setErrors] = useState({
        headPhoneNumber: "",
        headEmail: "",
        coordinatorPhoneNumber: "",
        coordinatorEmail: "",
    });

    const validateField = (field: string, value: string) => {
        let errorMessage = "";
        if (field === "headPhoneNumber" || field === "coordinatorPhoneNumber") {
            const phoneRegex = /^[0-9]{10}$/;
            const normalized = value.replace(/\D/g, "");
            if (!phoneRegex.test(normalized)) {
                errorMessage = t("form.phoneInvalid10");
            }
        } else if (field === "headEmail" || field === "coordinatorEmail") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = t("auth.emailInvalid");
            }
        }
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    };

    const hasAutoFilled = React.useRef(false);
    useEffect(() => {
        if (userProfile && !hasAutoFilled.current) {
            hasAutoFilled.current = true;

            const normalizedHead = normalizeAcademicPosition(
                userProfile.academic_position
            );

            handleInputChange("headPrefix", userProfile.prefix || "");
            handleInputChange("headAcademicPosition", normalizedHead.position);
            handleInputChange(
                "headAcademicPositionOther",
                normalizedHead.other || ""
            );

            handleInputChange("headFirstName", userProfile.first_name || "");
            handleInputChange("headLastName", userProfile.last_name || "");
            handleInputChange("headDepartment", userProfile.department || "");
            handleInputChange("headPhoneNumber", userProfile.phone_number || "");
            handleInputChange("headEmail", userProfile.email || "");
        }
    }, [userProfile, handleInputChange]);


    // ✅ ฟังก์ชันเมื่อคลิก checkbox
    const handleSameAsHeadChange = (checked: boolean) => {
        handleInputChange("sameAsHead", checked);
        if (checked) {
            const normalized = normalizeAcademicPosition(
                formData.headAcademicPositionOther ||
                formData.headAcademicPosition
            );

            handleInputChange("coordinatorPrefix", formData.headPrefix || "");
            handleInputChange(
                "coordinatorAcademicPosition",
                normalized.position
            );
            handleInputChange(
                "coordinatorAcademicPositionOther",
                normalized.other || ""
            );

            handleInputChange("coordinatorFirstName", formData.headFirstName || "");
            handleInputChange("coordinatorLastName", formData.headLastName || "");
            handleInputChange("coordinatorDepartment", formData.headDepartment || "");
            handleInputChange("coordinatorPhoneNumber", formData.headPhoneNumber || "");
            handleInputChange("coordinatorEmail", formData.headEmail || "");
        } else {
            handleInputChange("coordinatorPrefix", "");
            handleInputChange("coordinatorAcademicPosition", "");
            handleInputChange("coordinatorAcademicPositionOther", "");
            handleInputChange("coordinatorFirstName", "");
            handleInputChange("coordinatorLastName", "");
            handleInputChange("coordinatorDepartment", "");
            handleInputChange("coordinatorPhoneNumber", "");
            handleInputChange("coordinatorEmail", "");
        }
    };


    return (
        <div className="space-y-6 text-gray-600">
            {/* ---------- ข้อมูลหัวหน้าโครงการ ---------- */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary">
                        {t("form.projectHeadInfo")}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center">
                    <div className="col-span-1">
                        <Label htmlFor="headPrefix">{t("auth.prefix")}<span className="text-red-500">*</span></Label>
                        <Input
                            disabled
                            id="headPrefix"
                            value={formData.headPrefix}
                            onChange={(e) =>
                                handleInputChange("headPrefix", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="headAcademicPosition">{t("auth.academicPosition")}</Label>

                        <div
                            className={`grid gap-2 ${formData.headAcademicPosition === "other"
                                    ? "grid-cols-2"
                                    : "grid-cols-1"
                                }`}
                        >
                            <Input
                                disabled
                                value={
                                    formData.headAcademicPosition === "none"
                                        ? t("form.none")
                                        : formData.headAcademicPosition === "other"
                                            ? t("common.other")
                                            : formData.headAcademicPosition
                                }
                            />
                            {formData.headAcademicPosition === "other" && (
                                <Input
                                    disabled
                                    value={formData.headAcademicPositionOther || ""}
                                    placeholder="ตำแหน่ง"
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-span-3">
                        <Label htmlFor="headFirstName">{t("auth.firstName")}<span className="text-red-500">*</span></Label>
                        <Input
                            disabled
                            id="headFirstName"
                            value={formData.headFirstName}
                            onChange={(e) =>
                                handleInputChange("headFirstName", e.target.value)
                            }
                            placeholder="ชื่อ"
                            required
                            ref={refs?.headFirstName}
                        />
                    </div>

                    <div className="col-span-3">
                        <Label htmlFor="headLastName">{t("auth.lastName")}<span className="text-red-500">*</span></Label>
                        <Input
                            disabled
                            id="headLastName"
                            value={formData.headLastName}
                            onChange={(e) =>
                                handleInputChange("headLastName", e.target.value)
                            }
                            placeholder="นามสกุล"
                            required
                            ref={refs?.headLastName}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="headDepartment">
                        {t("form.departmentOfHead")}<span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mb-1">
                        {t("form.departmentNote")}
                    </p>
                    <Input
                        disabled
                        id="headDepartment"
                        value={formData.headDepartment}
                        onChange={(e) =>
                            handleInputChange("headDepartment", e.target.value)
                        }
                        placeholder={t("auth.departmentPlaceholder")}
                        required
                        ref={refs?.headDepartment}
                    />
                </div>

                <div>
                        <Label htmlFor="headPhoneNumber">{t("auth.phone")}<span className="text-red-500">*</span></Label>
                    <PhoneInput
                        disabled
                        value={formData.headPhoneNumber}
                        onChange={(value) => {
                            handleInputChange("headPhoneNumber", value);
                            validateField("headPhoneNumber", value);
                        }}
                        ref={refs?.headPhoneNumber}
                    />
                    {errors.headPhoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.headPhoneNumber}</p>
                    )}
                </div>

                <div>
                        <Label htmlFor="headEmail">{t("auth.email")}<span className="text-red-500">*</span></Label>
                    <Input
                        disabled
                        id="headEmail"
                        value={formData.headEmail}
                        onChange={(e) => {
                            handleInputChange("headEmail", e.target.value);
                            validateField("headEmail", e.target.value);
                        }}
                        placeholder="example@email.com"
                        required
                        ref={refs?.headEmail}
                    />
                    {errors.headEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.headEmail}</p>
                    )}
                </div>
            </div>

            <hr className="my-6 border-primary" />

            {/* ---------- ข้อมูลผู้ประสานงานโครงการ ---------- */}
            <div className="space-y-4">
                <h3 className="font-semibold text-primary">{t("form.coordinatorInfo")}</h3>

                {/* ✅ Checkbox ข้อมูลเดียวกับหัวหน้าโครงการ */}
                <div className="flex items-center space-x-2 mb-2">
                    <input
                        type="checkbox"
                        id="sameAsHead"
                        checked={formData.sameAsHead || false}
                        onChange={(e) => handleSameAsHeadChange(e.target.checked)}
                    />
                    <Label htmlFor="sameAsHead">{t("form.sameAsHead")}</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center">
                    <div className="col-span-1">
                        <Label htmlFor="coordinatorPrefix">{t("auth.prefix")}<span className="text-red-500">*</span></Label>
                        <Select
                            onValueChange={(value) =>
                                handleInputChange("coordinatorPrefix", value)
                            }
                            value={formData.coordinatorPrefix}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="เลือก" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="นพ.">นพ.</SelectItem>
                                <SelectItem value="พญ.">พญ.</SelectItem>
                                <SelectItem value="ภญ.">ภญ.</SelectItem>
                                <SelectItem value="ทพญ.">ทพญ.</SelectItem>
                                <SelectItem value="นาย">{t("form.prefixMr")}</SelectItem>
                                <SelectItem value="นาง">{t("form.prefixMrs")}</SelectItem>
                                <SelectItem value="นางสาว">{t("form.prefixMs")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="coordinatorAcademicPosition">{t("auth.academicPosition")}
                            {formData.coordinatorAcademicPosition === "other" && (
                                <span className="text-red-500">*</span>
                            )}</Label>
                        <div
                            className={`grid gap-2 ${formData.coordinatorAcademicPosition === "other"
                                    ? "grid-cols-2"
                                    : "grid-cols-1"
                                }`}
                        >
                            <Select
                                onValueChange={(value) => {
                                    handleInputChange("coordinatorAcademicPosition", value);
                                    if (value !== "other") {
                                        handleInputChange("coordinatorAcademicPositionOther", "");
                                    }
                                }}
                                value={formData.coordinatorAcademicPosition}
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t("common.select")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t("form.none")}</SelectItem>
                                    <SelectItem value="อ.">อ.</SelectItem>
                                    <SelectItem value="ผศ.">ผศ.</SelectItem>
                                    <SelectItem value="รศ.">รศ.</SelectItem>
                                    <SelectItem value="ศ.">ศ.</SelectItem>
                                    <SelectItem value="other">{t("common.other")}</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Custom input for "other" */}
                            {formData.coordinatorAcademicPosition === "other" && (
                                <input
                                    type="text"
                                    placeholder={t("form.positionPlaceholder")}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    onChange={(e) =>
                                        handleInputChange("coordinatorAcademicPositionOther", e.target.value)
                                    }
                                    value={formData.coordinatorAcademicPositionOther || ""}
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-span-3">
                        <Label htmlFor="coordinatorFirstName">{t("auth.firstName")}<span className="text-red-500">*</span></Label>
                        <Input
                            id="coordinatorFirstName"
                            value={formData.coordinatorFirstName}
                            onChange={(e) =>
                                handleInputChange("coordinatorFirstName", e.target.value)
                            }
                            placeholder={t("form.namePlaceholder")}
                            required
                            ref={refs?.coordinatorFirstName}
                        />
                    </div>

                    <div className="col-span-3">
                        <Label htmlFor="coordinatorLastName">{t("auth.lastName")}<span className="text-red-500">*</span></Label>
                        <Input
                            id="coordinatorLastName"
                            value={formData.coordinatorLastName}
                            onChange={(e) =>
                                handleInputChange("coordinatorLastName", e.target.value)
                            }
                            placeholder={t("form.lastNamePlaceholder")}
                            required
                            ref={refs?.coordinatorLastName}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="coordinatorDepartment">
                        {t("form.departmentOfCoordinator")}<span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mb-1">
                        {t("form.departmentNote")}
                    </p>
                    <Input
                        id="coordinatorDepartment"
                        value={formData.coordinatorDepartment}
                        onChange={(e) =>
                            handleInputChange("coordinatorDepartment", e.target.value)
                        }
                        placeholder={t("auth.departmentPlaceholder")}
                        required
                        ref={refs?.coordinatorDepartment}
                    />
                </div>

                <div>
                        <Label htmlFor="coordinatorPhoneNumber">{t("auth.phone")}<span className="text-red-500">*</span></Label>
                    <PhoneInput
                        value={formData.coordinatorPhoneNumber}
                        onChange={(value) => {
                            handleInputChange("coordinatorPhoneNumber", value);
                            validateField("coordinatorPhoneNumber", value);
                        }}
                        ref={refs?.coordinatorPhoneNumber}
                    />
                    {errors.coordinatorPhoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.coordinatorPhoneNumber}</p>
                    )}
                </div>

                <div>
                        <Label htmlFor="coordinatorEmail">{t("auth.email")}<span className="text-red-500">*</span></Label>
                    <Input
                        id="coordinatorEmail"
                        value={formData.coordinatorEmail}
                        onChange={(e) => {
                            handleInputChange("coordinatorEmail", e.target.value);
                            validateField("coordinatorEmail", e.target.value);
                        }}
                        placeholder="example@email.com"
                        required
                        ref={refs?.coordinatorEmail}
                    />
                    {errors.coordinatorEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.coordinatorEmail}</p>
                    )}
                </div>

                {/* เดิม: ช่อง mark urgent */}
                <div className="flex items-center space-x-2 mt-4">
                    <input
                        type="checkbox"
                        id="isUrgent"
                        checked={formData.isUrgent}
                        onChange={(e) =>
                            handleInputChange("isUrgent", e.target.checked)
                        }
                    />
                    <Label htmlFor="isUrgent">{t("home.urgent")}</Label>
                </div>

                {formData.isUrgent && (
                    <div>
                        <Label htmlFor="urgentReason">
                            {t("form.urgencyReason")}{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="urgentReason"
                            value={formData.urgentReason}
                            onChange={(e) =>
                                handleInputChange("urgentReason", e.target.value)
                            }
                            placeholder={t("form.urgencyReasonPlaceholder")}
                            rows={2}
                            required={formData.isUrgent}
                            ref={refs?.urgentReason}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}