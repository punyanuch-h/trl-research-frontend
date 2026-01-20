import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { checkboxQuestionList } from "@/data/checkboxQuestionList";

interface CheckboxQuestionProps {
  index: number;
  value: number[];
  disabled?: boolean;
  onChange: (value: number[], itemId: string, selectedLabels: string[]) => void;
  assessmentFiles?: { [key: string]: File | null };
  onAttachFile?: (fieldKey: string, file: File | null) => void;
}

const CheckboxQuestion = ({
  index,
  value = [],
  disabled,
  onChange,
  assessmentFiles,
  onAttachFile,
}: CheckboxQuestionProps) => {

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
        {selectedQuestions.map((item) => {
          const isChecked = value[Number(item.id) - 1] === 1;
          const fieldKey = `${itemId}-${item.id}`;
          const attachedFile = assessmentFiles?.[fieldKey];

          return (
            <div key={item.id} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={isChecked}
                  disabled={disabled}
                  onCheckedChange={(checked: boolean) =>
                    !disabled && handleCheckboxChange(checked, item.id)
                  }
                />
                <Label htmlFor={item.id}>{item.label}</Label>
              </div>

              {/* File upload per checked item */}
              {isChecked && onAttachFile && (
                <div className="ml-6 flex items-center space-x-2">
                  <button
                    type="button"
                    className="text-xs px-2 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    onClick={() => document.getElementById(`file-${fieldKey}`)?.click()}
                  >
                    แนบหลักฐาน
                  </button>
                  <input
                    type="file"
                    id={`file-${fieldKey}`}
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      onAttachFile(fieldKey, file);
                    }}
                  />
                  {attachedFile && (
                    <span className="text-xs text-green-600">
                      ✓ {attachedFile.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxQuestion;
