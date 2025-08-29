import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface IntellectualPropertyProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
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
    const handleIpTypeChange = (ipType: string, checked: boolean) => {
        let newIpTypes = [...formData.ipTypes];
        if (checked) {
            newIpTypes.push(ipType);
        } else {
            newIpTypes = newIpTypes.filter((type) => type !== ipType);
        }
        handleInputChange("ipTypes", newIpTypes);
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-primary">การคุ้มครองทรัพย์สินทางปัญญา*</h3>
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
                    {formData.ipProtectionStatus === "ได้เลขที่คำขอแล้ว" && (
                        <div className="pl-6">
                            <Label htmlFor="ipRequestNumber" className="text-muted-foreground">ระบุเลขที่คำขอ:</Label>
                            <Input
                                id="ipRequestNumber"
                                value={formData.ipRequestNumber}
                                onChange={(e) => handleInputChange("ipRequestNumber", e.target.value)}
                                placeholder="เช่น 123456789"
                                className="mt-1"
                            />
                        </div>
                    )}
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

            <div>
                <h3 className="font-semibold text-primary">ระบุประเภท</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {ipTypesList.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={item.id}
                                checked={formData.ipTypes.includes(item.id)}
                                onCheckedChange={(checked) => handleIpTypeChange(item.id, !!checked)}
                            />
                            <Label htmlFor={item.id}>{item.label}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}