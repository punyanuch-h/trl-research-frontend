import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { radioQuestionList } from "@/data/radioQuestionList";

interface RadioQuestionProps {
  index: number;
  value: string;
  onChange: (value: number) => void;
}

const RadioQuestion = ({ index, value, onChange }: RadioQuestionProps) => {
  const selectedQuestion = radioQuestionList[index - 1];

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
