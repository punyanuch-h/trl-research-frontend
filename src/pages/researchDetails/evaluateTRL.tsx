import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EvaluateTRLProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
}

export default function EvaluateTRL({ formData, handleInputChange }: EvaluateTRLProps) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-primary">ขั้นตอนการพัฒนา (Stage of Development)</h3>
                <Textarea
                    id="stageOfDevelopment"
                    value={formData.stageOfDevelopment}
                    onChange={(e) => handleInputChange("stageOfDevelopment", e.target.value)}
                    placeholder="นวัตกรรมอยู่ในขั้นตอนใดของการพัฒนา เช่น งานวิจัยในห้องปฏิบัติการ, ต้นแบบ, พร้อมใช้งานเชิงพาณิชย์"
                    rows={3}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">ความท้าทายในปัจจุบัน (Current Challenges)</h3>
                <Textarea
                    id="currentChallenges"
                    value={formData.currentChallenges}
                    onChange={(e) => handleInputChange("currentChallenges", e.target.value)}
                    placeholder="อธิบายความท้าทายที่คุณกำลังเผชิญอยู่ในปัจจุบัน"
                    rows={3}
                />
            </div>
            <div>
                <h3 className="font-semibold text-primary">กลุ่มผู้ใช้งานเป้าหมาย (Target Users)</h3>
                <Textarea
                    id="targetUsers"
                    value={formData.targetUsers}
                    onChange={(e) => handleInputChange("targetUsers", e.target.value)}
                    placeholder="ระบุกลุ่มผู้ใช้งานหลักของนวัตกรรมนี้"
                    rows={3}
                />
            </div>
        </div>
    );
}