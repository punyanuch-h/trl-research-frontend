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
      <div className="grid grid-cols-1 md:grid-cols gap-2 mt-2">
        {selectedQuestions.map((item) => {
          const isChecked = value[Number(item.id) - 1] === 1;
          const fieldKey = `${itemId}-${item.id}`;
          const attachedFile = assessmentFiles?.[fieldKey];

          return (
            <div key={item.id} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={fieldKey}
                  checked={isChecked}
                  disabled={disabled}
                  onCheckedChange={(checked: boolean) =>
                    !disabled && handleCheckboxChange(checked, item.id)
                  }
                />
                <Label htmlFor={fieldKey}>{item.label}</Label>
              </div>

              {/* File upload per checked item */}
              {isChecked && onAttachFile && (
                <div className={`ml-6 flex items-center space-x-2 ${disabled ? "opacity-60" : ""}`}>
                  <button
                    type="button"
                    disabled={disabled}
                    className={`text-xs px-2 py-1 border rounded transition-colors ${
                      disabled
                        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                    }`}
                    onClick={() => !disabled && document.getElementById(`file-${fieldKey}`)?.click()}
                  >
                    แนบหลักฐาน
                  </button>
                  <input
                    type="file"
                    id={`file-${fieldKey}`}
                    accept=".pdf"
                    disabled={disabled}
                    className="hidden"
                    onChange={(e) => {
                      if (!disabled) {
                        const file = e.target.files?.[0] || null;
                        onAttachFile(fieldKey, file);
                      }
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
