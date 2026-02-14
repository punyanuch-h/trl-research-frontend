import { useTranslation } from "react-i18next";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioQuestionProps {
  index: number;
  value: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const YES_VALUE = "ใช่";
const NO_VALUE = "ไม่ใช่";

const RadioQuestion = ({ index, value, onChange, disabled }: RadioQuestionProps) => {
  const { t } = useTranslation();
  const questionKey = `evaluate.radioQuestions.q${index}`;

  return (
    <div className={disabled ? "opacity-60 pointer-events-none" : ""}>
      <h3 className="font-semibold text-primary">{t(questionKey)}</h3>
      <RadioGroup
        value={value}
        onValueChange={(newValue) => onChange(newValue === YES_VALUE ? 1 : 0)}
        className="space-y-2 mt-2"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={YES_VALUE} id={`rq${index}-yes`} disabled={disabled} />
          <Label htmlFor={`rq${index}-yes`} className={disabled ? "cursor-not-allowed" : ""}>
            {t("common.yes")}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={NO_VALUE} id={`rq${index}-no`} disabled={disabled} />
          <Label htmlFor={`rq${index}-no`} className={disabled ? "cursor-not-allowed" : ""}>
            {t("common.no")}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadioQuestion;
