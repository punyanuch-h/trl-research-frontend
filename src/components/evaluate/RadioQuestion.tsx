import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioQuestionProps {
  index: number;
  value: string;
  onChange: (value: number) => void;
}

const RadioQuestion = ({ index, value, onChange }: RadioQuestionProps) => {
  const questionList = [
    "มีการทำ prototype/pilot model เสร็จแล้วหรือไม่?",
    "Prototype ของคุณได้รับการทดสอบแล้วหรือยัง?",
    "Prototype ถูกทดสอบในสภาวะใช้งานจริงหรือยัง?",
    "Prototype มีการตรวจสอบคุณภาพตามมาตราฐานมั้ย?",
    "ระบบถูกใช้งานจริงต่อเนื่อง/ได้รับการยอมรับในวงกว้างแล้วหรือยัง?",
    "Prototype ทำงานในสภาวะจริงได้มั้ย?",
    "สมมุติฐานของคุณมีการทดลองในห้อง lab แล้วหรือยัง?",
  ];

  const selectedQuestion = questionList[index - 1];

  return (
    <div>
      <h3 className="font-semibold text-primary">{selectedQuestion}</h3>
      <RadioGroup
        value={value}
        onValueChange={(newValue) => onChange(newValue === "ใช่" ? 1 : 0)}
        className="space-y-2 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ใช่" id={`rq${index}-yes`} />
          <Label htmlFor={`rq${index}-yes`}>ใช่</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ไม่ใช่" id={`rq${index}-no`} />
          <Label htmlFor={`rq${index}-no`}>ไม่ใช่</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadioQuestion;
