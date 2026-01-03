import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { checkboxQuestionList } from "@/data/checkboxQuestionList";

interface CheckboxQuestionProps {
  index: number;
  value: number[];
  disabled?: boolean;
  onChange: (value: number[], itemId: string, selectedLabels: string[]) => void;
}

const CheckboxQuestion = ({ index, value = [], onChange }: CheckboxQuestionProps) => {

  const selectedQuestions = checkboxQuestionList[index - 1];

  const itemId = `cq${index}`;

  const handleCheckboxChange = (checked: boolean, id: string) => {
    const index = Number(id) - 1;
    const updatedValue = [...value];

    updatedValue[index] = checked ? 1 : 0;

    const selectedLabels = selectedQuestions
        .filter((_, idx) => updatedValue[idx] === 1)
        .map(item => item.label);

    onChange(updatedValue, itemId, selectedLabels);
  };

  return (
    <div>
      <h3 className="font-semibold text-primary">Research ของคุณตรงตามข้อใดบ้าง</h3>
      <div className="grid grid-cols-1 md:grid-cols gap-2 mt-2">
        {selectedQuestions.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={item.id}
              checked={value[Number(item.id) - 1] === 1}
              onCheckedChange={(checked: boolean) => handleCheckboxChange(checked, item.id)}
            />
            <Label htmlFor={item.id}>{item.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxQuestion;
