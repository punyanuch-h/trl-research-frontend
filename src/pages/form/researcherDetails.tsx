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
import React from "react";
import {useGetUserProfile} from "@/hooks/user/get/useGetUserProfile";
import { PhoneInput } from "@/components/format/PhoneInput";

interface ResearcherDetailsProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    refs?: any;
}

export default function ResearcherDetails({
    formData,
    handleInputChange,
    refs,
}: ResearcherDetailsProps) {
    const { data: userProfile } = useGetUserProfile(); // ดึงข้อมูลผู้ใช้จาก hook

    const applyAutoFill = () => {
        if (userProfile) {
            handleInputChange("headPrefix", userProfile.prefix || "");
            handleInputChange("headAcademicPosition", userProfile.academic_position || "");
            handleInputChange("headFirstName", userProfile.first_name || "");
            handleInputChange("headLastName", userProfile.last_name || "");
            handleInputChange("headDepartment", userProfile.department || "");
            handleInputChange("headPhoneNumber", userProfile.phone_number || "");
            handleInputChange("headEmail", userProfile.email || "");
        }
    };

    const clearFields = () => {
        ["headPrefix", "headAcademicPosition", "headFirstName", "headLastName", "headDepartment", "headPhoneNumber", "headEmail"].forEach((field) =>
            handleInputChange(field, "")
        );
    };

    // ✅ ฟังก์ชันเมื่อคลิก checkbox
    const handleSameAsHeadChange = (checked: boolean) => {
        handleInputChange("sameAsHead", checked);
        if (checked) {
            // คัดลอกข้อมูลจากหัวหน้าโครงการ
            handleInputChange("coordinatorPrefix", formData.headPrefix || "");
            handleInputChange("coordinatorAcademicPosition", formData.headAcademicPosition || "");
            handleInputChange("coordinatorFirstName", formData.headFirstName || "");
            handleInputChange("coordinatorLastName", formData.headLastName || "");
            handleInputChange("coordinatorDepartment", formData.headDepartment || "");
            handleInputChange("coordinatorPhoneNumber", formData.headPhoneNumber || "");
            handleInputChange("coordinatorEmail", formData.headEmail || "");
        } else {
            // ล้างข้อมูลเมื่อยกเลิก
            handleInputChange("coordinatorPrefix", "");
            handleInputChange("coordinatorAcademicPosition", "");
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
                        ข้อมูลหัวหน้าโครงการ
                    </h3>

                    <div className="flex justify-end gap-2">
                        <button
                        type="button"
                        onClick={applyAutoFill}
                        className="px-3 py-1 rounded bg-primary text-white text-sm"
                        >
                        Auto fill
                        </button>
                        <button
                        type="button"
                        onClick={clearFields}
                        className="px-3 py-1 rounded border text-sm"
                        >
                        Clear
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center">
                    <div className="col-span-1">
                        <Label htmlFor="headPrefix">คำนำหน้า<span className="text-red-500">*</span></Label>
                        <Select
                            onValueChange={(value) =>
                                handleInputChange("headPrefix", value)
                            }
                            value={formData.headPrefix}
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
                                <SelectItem value="นาย">นาย</SelectItem>
                                <SelectItem value="นาง">นาง</SelectItem>
                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="headAcademicPosition">ตำแหน่งวิชาการ
                            {formData.headAcademicPosition === "other" && (
                            <span className="text-red-500">*</span>
                        )}</Label>
                        <div
                            className={`grid gap-2 ${
                            formData.headAcademicPosition === "other"
                                ? "grid-cols-2"
                                : "grid-cols-1"
                            }`}
                        >
                            <Select
                            onValueChange={(value) =>
                                handleInputChange("headAcademicPosition", value)
                            }
                            value={formData.headAcademicPosition}
                            required
                            >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="เลือก" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">ไม่มี</SelectItem>
                                <SelectItem value="อ.">อ.</SelectItem>
                                <SelectItem value="ผศ.">ผศ.</SelectItem>
                                <SelectItem value="รศ.">รศ.</SelectItem>
                                <SelectItem value="ศ.">ศ.</SelectItem>
                                <SelectItem value="other">อื่นๆ</SelectItem>
                            </SelectContent>
                            </Select>

                            {/* Custom input for "other" */}
                            {formData.headAcademicPosition === "other" && (
                            <input
                                type="text"
                                placeholder="ตำแหน่ง"
                                className="w-full border rounded px-3 py-2 text-sm"
                                onChange={(e) =>
                                    handleInputChange("headAcademicPositionOther", e.target.value)
                                }
                                value={formData.headAcademicPositionOther || ""}
                                required
                            />
                            )}
                        </div>
                    </div>

                    <div className="col-span-3">
                        <Label htmlFor="headFirstName">ชื่อ<span className="text-red-500">*</span></Label>
                        <Input
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
                        <Label htmlFor="headLastName">นามสกุล<span className="text-red-500">*</span></Label>
                        <Input
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
                        ภาควิชา / สถาน / หน่วยงาน ของหัวหน้าโครงการ<span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mb-1">
                        (รวมหน่วยงานที่เทียบเท่าภาควิชา)
                    </p>
                    <Input
                        id="headDepartment"
                        value={formData.headDepartment}
                        onChange={(e) =>
                            handleInputChange("headDepartment", e.target.value)
                        }
                        placeholder="เช่น ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์"
                        required
                        ref={refs?.headDepartment}
                    />
                </div>

                <div>
                    <Label htmlFor="headPhoneNumber">เบอร์โทรศัพท์<span className="text-red-500">*</span></Label>
                    <PhoneInput
                        value={formData.headPhoneNumber}
                        onChange={(value) => handleInputChange("headPhoneNumber", value)}
                        ref={refs?.headPhoneNumber}
                    />
                </div>

                <div>
                    <Label htmlFor="headEmail">อีเมล์<span className="text-red-500">*</span></Label>
                    <Input
                        id="headEmail"
                        value={formData.headEmail}
                        onChange={(e) =>
                            handleInputChange("headEmail", e.target.value)
                        }
                        placeholder="example@email.com"
                        required
                        ref={refs?.headEmail}
                    />
                </div>
            </div>

            <hr className="my-6 border-primary" />

            {/* ---------- ข้อมูลผู้ประสานงานโครงการ ---------- */}
            <div className="space-y-4">
                <h3 className="font-semibold text-primary">ข้อมูลผู้ประสานงานโครงการ</h3>

                {/* ✅ Checkbox ข้อมูลเดียวกับหัวหน้าโครงการ */}
                <div className="flex items-center space-x-2 mb-2">
                    <input
                        type="checkbox"
                        id="sameAsHead"
                        checked={formData.sameAsHead || false}
                        onChange={(e) => handleSameAsHeadChange(e.target.checked)}
                    />
                    <Label htmlFor="sameAsHead">ข้อมูลเดียวกับหัวหน้าโครงการ</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center">
                    <div className="col-span-1">
                        <Label htmlFor="coordinatorPrefix">คำนำหน้า<span className="text-red-500">*</span></Label>
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
                                <SelectItem value="นาย">นาย</SelectItem>
                                <SelectItem value="นาง">นาง</SelectItem>
                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="coordinatorAcademicPosition">ตำแหน่งวิชาการ
                            {formData.coordinatorAcademicPosition === "other" && (
                            <span className="text-red-500">*</span>
                        )}</Label>
                        <div
                            className={`grid gap-2 ${
                            formData.coordinatorAcademicPosition === "other"
                                ? "grid-cols-2"
                                : "grid-cols-1"
                            }`}
                        >
                            <Select
                            onValueChange={(value) =>
                                handleInputChange("coordinatorAcademicPosition", value)
                            }
                            value={formData.coordinatorAcademicPosition}
                            required
                            >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="เลือก" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">ไม่มี</SelectItem>
                                <SelectItem value="อ.">อ.</SelectItem>
                                <SelectItem value="ผศ.">ผศ.</SelectItem>
                                <SelectItem value="รศ.">รศ.</SelectItem>
                                <SelectItem value="ศ.">ศ.</SelectItem>
                                <SelectItem value="other">อื่นๆ</SelectItem>
                            </SelectContent>
                            </Select>

                            {/* Custom input for "other" */}
                            {formData.coordinatorAcademicPosition === "other" && (
                            <input
                                type="text"
                                placeholder="ตำแหน่ง"
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
                        <Label htmlFor="coordinatorFirstName">ชื่อ<span className="text-red-500">*</span></Label>
                        <Input
                            id="coordinatorFirstName"
                            value={formData.coordinatorFirstName}
                            onChange={(e) =>
                                handleInputChange("coordinatorFirstName", e.target.value)
                            }
                            placeholder="ชื่อ"
                            required
                            ref={refs?.coordinatorFirstName}
                        />
                    </div>

                    <div className="col-span-3">
                        <Label htmlFor="coordinatorLastName">นามสกุล<span className="text-red-500">*</span></Label>
                        <Input
                            id="coordinatorLastName"
                            value={formData.coordinatorLastName}
                            onChange={(e) =>
                                handleInputChange("coordinatorLastName", e.target.value)
                            }
                            placeholder="นามสกุล"
                            required
                            ref={refs?.coordinatorLastName}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="coordinatorDepartment">
                        ภาควิชา / สถาน / หน่วยงาน ของหัวหน้าโครงการ<span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mb-1">
                        (รวมหน่วยงานที่เทียบเท่าภาควิชา)
                    </p>
                    <Input
                        id="coordinatorDepartment"
                        value={formData.coordinatorDepartment}
                        onChange={(e) =>
                            handleInputChange("coordinatorDepartment", e.target.value)
                        }
                        placeholder="เช่น ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์"
                        required
                        ref={refs?.coordinatorDepartment}
                    />
                </div>

                <div>
                    <Label htmlFor="coordinatorPhoneNumber">เบอร์โทรศัพท์<span className="text-red-500">*</span></Label>
                    <PhoneInput
                        value={formData.coordinatorPhoneNumber}
                        onChange={(value) => handleInputChange("coordinatorPhoneNumber", value)}
                        ref={refs?.coordinatorPhoneNumber}
                    />
                </div>

                <div>
                    <Label htmlFor="coordinatorEmail">อีเมล์<span className="text-red-500">*</span></Label>
                    <Input
                        id="coordinatorEmail"
                        value={formData.coordinatorEmail}
                        onChange={(e) =>
                            handleInputChange("coordinatorEmail", e.target.value)
                        }
                        placeholder="example@email.com"
                        required
                        ref={refs?.coordinatorEmail}
                    />
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
                    <Label htmlFor="isUrgent">Mark as Urgent</Label>
                </div>

                {formData.isUrgent && (
                    <div>
                        <Label htmlFor="urgentReason">
                            เหตุผลความเร่งด่วน{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="urgentReason"
                            value={formData.urgentReason}
                            onChange={(e) =>
                                handleInputChange("urgentReason", e.target.value)
                            }
                            placeholder="โปรดระบุเหตุผลความเร่งด่วน"
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