import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Header from "../../components/Header";

const trlChecklist = [
  { level: 1, description: "Basic principles observed and reported." },
  { level: 2, description: "Technology concept and/or application formulated." },
  { level: 3, description: "Analytical and experimentally critical function and/or characteristic proof of concept." },
  { level: 4, description: "Component and/or breadboard validation in laboratory environment." },
  { level: 5, description: "Component and/or breadboard validation in relevant environments." },
  { level: 6, description: "System/subsystem model or prototype demonstration in a relevant environment." },
  { level: 7, description: "System prototype demonstration in an operational environment." },
  { level: 8, description: "Actual system completed and qualified through test and demonstration." },
  { level: 9, description: "Actual system proven through successful mission operations." },
];

export default function TrlScore() {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;

  const [loading, setLoading] = useState(false);
  const [estimatedLevel, setEstimatedLevel] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState<string>("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (project) {
      handleAIAnalysis(project);
    }
  }, [project]);

  const handleAIAnalysis = async (project: any) => {
    setLoading(true);

    // 🚀 Mock AI วิเคราะห์ (จริงๆ ตรงนี้จะไปเรียก API)
    const aiResult = 5;
    const aiReason =
      "จากข้อมูลพบว่ามีการสร้างต้นแบบและทดสอบในสภาพแวดล้อมที่ใกล้เคียงของจริง " +
      "ซึ่งสอดคล้องกับ TRL 5 (Component/breadboard validation in relevant environments) " +
      "แต่ยังไม่พบหลักฐานการสาธิตใน operational environment ที่จะทำให้เป็น TRL 7.";

    setTimeout(() => {
      setEstimatedLevel(aiResult);
      setReasoning(aiReason);
      setLoading(false);
    }, 1200);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleConfirmClick = () => {
    setConfirmOpen(true);
  };

  const handleFinalConfirm = () => {
    setConfirmOpen(false);
    // TODO: ส่งค่าไปบันทึกที่ backend
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">TRl Score</h1>
              <p className="text-muted-foreground">
                การประเมิน TRL (Technology Readiness Level) เป็นเครื่องมือที่ช่วยในการประเมินความพร้อมของเทคโนโลยี
              </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>AI TRL Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                    <p>AI กำลังวิเคราะห์ข้อมูล...</p>
                    ) : estimatedLevel ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">
                        Estimated TRL Level:{" "}
                        <Badge variant="outline">TRL {estimatedLevel}</Badge>
                        </h2>

                        <div className="space-y-2 mb-6">
                        {trlChecklist.map(item => (
                            <div
                            key={item.level}
                            className={`p-2 rounded border ${
                                item.level <= estimatedLevel
                                ? "bg-green-50 border-green-300 text-green-800"
                                : "bg-gray-50 border-gray-200 text-gray-500"
                            }`}
                            >
                            <span className="font-semibold">TRL {item.level}:</span>{" "}
                            {item.description}{" "}
                            {item.level <= estimatedLevel ? "✔️" : "❌"}
                            </div>
                        ))}
                        </div>

                        {/* 🔎 กล่องเหตุผล */}
                        <div className="p-4 border rounded bg-yellow-50 border-yellow-300 text-yellow-900">
                        <h3 className="font-semibold mb-2">เหตุผลประกอบ:</h3>
                        <p>{reasoning}</p>
                        </div>
                        {/* 🚀 ปุ่ม 3 ปุ่ม */}
                        <div className="flex gap-4 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => handleAIAnalysis(project)}
                        >
                            วิเคราะห์ใหม่
                        </Button>
                        <Button variant="ghost" onClick={handleCancel}>
                            ยกเลิก
                        </Button>
                        <Button variant="default" onClick={handleConfirmClick}>
                            ยืนยัน
                        </Button>
                        </div>

                        {/* Dialog ยืนยัน */}
                        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>ยืนยันการบันทึก TRL</DialogTitle>
                            </DialogHeader>
                            <p>
                            คุณแน่ใจหรือไม่ที่จะยืนยัน TRL {estimatedLevel} สำหรับโปรเจกต์ "{project.researchTitle}"?
                            </p>
                            <DialogFooter>
                            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                                ยกเลิก
                            </Button>
                            <Button variant="default" onClick={handleFinalConfirm}>
                                ยืนยัน
                            </Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>

                    </>
                    ) : (
                    <p>ยังไม่มีข้อมูลวิเคราะห์</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
