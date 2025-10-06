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
    // ✅ ฟังก์ชันเมื่อคลิก checkbox
    const handleSameAsHeadChange = (checked: boolean) => {
        handleInputChange("sameAsHead", checked);
        if (checked) {
            // คัดลอกข้อมูลจากหัวหน้าโครงการ
            handleInputChange("coordinatorFirstName", formData.headFirstName || "");
            handleInputChange("coordinatorLastName", formData.headLastName || "");
            handleInputChange("coordinatorPhoneNumber", formData.headPhoneNumber || "");
            handleInputChange("coordinatorEmail", formData.headEmail || "");
        } else {
            // ล้างข้อมูลเมื่อยกเลิก
            handleInputChange("coordinatorFirstName", "");
            handleInputChange("coordinatorLastName", "");
            handleInputChange("coordinatorPhoneNumber", "");
            handleInputChange("coordinatorEmail", "");
        }
    };

    return (
        <div className="space-y-6 text-gray-600">
            {/* ---------- ข้อมูลหัวหน้าโครงการ ---------- */}
            <div className="space-y-4">
                <h3 className="font-semibold text-primary">ข้อมูลหัวหน้าโครงการ</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="col-span-1">
                        <Label htmlFor="headPrefix">คำนำหน้า</Label>
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
                                <SelectItem value="นส.">นส.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-1">
                        <Label htmlFor="headAcademicPosition">ตำแหน่งวิชาการ</Label>
                        <Select
                            onValueChange={(value) =>
                                handleInputChange("headAcademicPosition", value)
                            }
                            value={formData.headAcademicPosition}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="เลือก" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="อ.">อ.</SelectItem>
                                <SelectItem value="ผศ.">ผศ.</SelectItem>
                                <SelectItem value="รศ.">รศ.</SelectItem>
                                <SelectItem value="ศ.">ศ.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-1">
                        <Label htmlFor="headFirstName">Name*</Label>
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

                    <div className="col-span-1">
                        <Label htmlFor="headLastName">Last Name*</Label>
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
                        ภาควิชา / สถาน / หน่วยงาน ของหัวหน้าโครงการ*
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
                    <Label htmlFor="headPhoneNumber">Phone Number*</Label>
                    <Input
                        id="headPhoneNumber"
                        value={formData.headPhoneNumber}
                        onChange={(e) =>
                            handleInputChange("headPhoneNumber", e.target.value)
                        }
                        placeholder="0XXXXXXXXX"
                        required
                        ref={refs?.headPhoneNumber}
                    />
                </div>

                <div>
                    <Label htmlFor="headEmail">Email*</Label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="coordinatorFirstName">Name</Label>
                        <Input
                            id="coordinatorFirstName"
                            value={formData.coordinatorFirstName}
                            onChange={(e) =>
                                handleInputChange("coordinatorFirstName", e.target.value)
                            }
                            placeholder="ชื่อ"
                            required
                            ref={refs?.coordinatorFirstName}
                            disabled={formData.sameAsHead}
                        />
                    </div>
                    <div>
                        <Label htmlFor="coordinatorLastName">Last Name</Label>
                        <Input
                            id="coordinatorLastName"
                            value={formData.coordinatorLastName}
                            onChange={(e) =>
                                handleInputChange("coordinatorLastName", e.target.value)
                            }
                            placeholder="นามสกุล"
                            required
                            ref={refs?.coordinatorLastName}
                            disabled={formData.sameAsHead}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="coordinatorPhoneNumber">Phone Number</Label>
                    <Input
                        id="coordinatorPhoneNumber"
                        value={formData.coordinatorPhoneNumber}
                        onChange={(e) =>
                            handleInputChange("coordinatorPhoneNumber", e.target.value)
                        }
                        placeholder="0XX-XXX-XXXX"
                        required
                        ref={refs?.coordinatorPhoneNumber}
                        disabled={formData.sameAsHead}
                    />
                </div>

                <div>
                    <Label htmlFor="coordinatorEmail">Email</Label>
                    <Input
                        id="coordinatorEmail"
                        value={formData.coordinatorEmail}
                        onChange={(e) =>
                            handleInputChange("coordinatorEmail", e.target.value)
                        }
                        placeholder="example@email.com"
                        required
                        ref={refs?.coordinatorEmail}
                        disabled={formData.sameAsHead}
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