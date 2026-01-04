import { useState, useEffect } from "react";
import RadioQuestion from "@/components/evaluate/RadioQuestion";
import CheckboxQuestion from "@/components/evaluate/CheckboxQuestion";

interface EvaluateTRLProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  setTrlLevel?: (level: number | null) => void;
  // Expose state and handlers for parent component
  onStateChange?: (state: {
    showPart2: boolean;
    checkboxQueue: number[];
    answersRadio: { [key: string]: number | null };
    answersCheckbox: { [key: string]: number[] };
    levelMessage: string;
    errorMessage: string;
  }) => void;
  onNextToPart2?: () => void;
  onSubmitCheckTRL?: (index: number) => void;
  canProceedToPart2?: boolean;
  currentCheckboxIndex?: number | null;
  // External state from parent
  externalState?: {
    showPart2: boolean;
    checkboxQueue: number[];
    answersRadio: { [key: string]: number | null };
    answersCheckbox: { [key: string]: number[] };
    levelMessage: string;
    errorMessage: string;
  };
}

export default function EvaluateTRL({
  formData,
  handleInputChange,
  setTrlLevel,
  onStateChange,
  onNextToPart2,
  onSubmitCheckTRL,
  canProceedToPart2,
  currentCheckboxIndex,
  externalState,
}: EvaluateTRLProps) {
  /* ---------------- Part 1 ---------------- */
  const [answersRadio, setAnswersRadio] = useState<{ [key: string]: number | null }>({
    rq1: null,
    rq2: null,
    rq3: null,
    rq4: null,
    rq5: null,
    rq6: null,
    rq7: null,
  });

  /* ---------------- Part 2 ---------------- */
  const [showPart2, setShowPart2] = useState(false);
  const [checkboxQueue, setCheckboxQueue] = useState<number[]>([]);

  const [answersCheckbox, setAnswersCheckbox] = useState<{ [key: string]: number[] }>({
    cq1: [0, 0, 0],
    cq2: [0, 0, 0, 0, 0],
    cq3: [0, 0, 0, 0, 0, 0, 0],
    cq4: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    cq5: [0, 0, 0, 0, 0, 0],
    cq6: [0, 0, 0, 0],
    cq7: [0, 0, 0, 0],
    cq8: [0, 0, 0],
    cq9: [0, 0, 0, 0],
  });

  const [levelMessage, setLevelMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Sync with external state if provided
  useEffect(() => {
    if (externalState) {
      setAnswersRadio(externalState.answersRadio);
      setShowPart2(externalState.showPart2);
      setCheckboxQueue(externalState.checkboxQueue);
      setAnswersCheckbox(externalState.answersCheckbox);
      setLevelMessage(externalState.levelMessage);
      setErrorMessage(externalState.errorMessage);
    }
  }, [externalState]);

  /* ---------------- Handlers ---------------- */
  const handleRadioChange = (value: number, questionId: string) => {
    const newAnswers = {
      ...answersRadio,
      [questionId]: value,
    };
    setAnswersRadio(newAnswers);
    handleInputChange(questionId + "Answer", value === 1);
    
    // Notify parent of state change
    if (onStateChange) {
      onStateChange({
        showPart2,
        checkboxQueue,
        answersRadio: newAnswers,
        answersCheckbox,
        levelMessage,
        errorMessage,
      });
    }
  };

  const handleCheckboxChange = (
    value: number[],
    itemId: string,
    selectedLabels: string[]
  ) => {
    const newAnswers = {
      ...answersCheckbox,
      [itemId]: value,
    };
    setAnswersCheckbox(newAnswers);
    handleInputChange(itemId + "Answer", selectedLabels);
    
    // Notify parent of state change
    if (onStateChange) {
      onStateChange({
        showPart2,
        checkboxQueue,
        answersRadio,
        answersCheckbox: newAnswers,
        levelMessage,
        errorMessage,
      });
    }
  };

  /* ---------------- Logic ---------------- */
  const handleNextToPart2Internal = () => {
    const allAnswered = Object.values(answersRadio).every((a) => a !== null);
    if (!allAnswered) {
      setErrorMessage("กรุณาตอบคำถาม Part 1 ให้ครบก่อน");
      if (onStateChange) {
        onStateChange({
          showPart2,
          checkboxQueue,
          answersRadio,
          answersCheckbox,
          levelMessage,
          errorMessage: "กรุณาตอบคำถาม Part 1 ให้ครบก่อน",
        });
      }
      return;
    }

    setErrorMessage("");
    setLevelMessage("");

    let firstIndex = 0;

    if (answersRadio.rq1 === 1) {
      if (answersRadio.rq2 === 1) {
        if (answersRadio.rq3 === 1) {
          if (answersRadio.rq4 === 1) {
            firstIndex = answersRadio.rq5 === 1 ? 9 : 8;
          } else firstIndex = 7;
        } else firstIndex = 6;
      } else firstIndex = answersRadio.rq6 === 1 ? 5 : 4;
    } else {
      firstIndex = answersRadio.rq7 === 1 ? 3 : 2;
    }

    const newQueue = [firstIndex];
    setCheckboxQueue(newQueue);
    setShowPart2(true);
    
    // Notify parent
    if (onStateChange) {
      onStateChange({
        showPart2: true,
        checkboxQueue: newQueue,
        answersRadio,
        answersCheckbox,
        levelMessage: "",
        errorMessage: "",
      });
    }
    
    if (onNextToPart2) {
      onNextToPart2();
    }
  };

  const handleSubmitCheckTRLInternal = (index: number) => {
    const answers = answersCheckbox[`cq${index}`] || [];
    const allChecked = answers.every((v) => v === 1);

    if (!allChecked) {
      if (index === 1) {
        const msg = "Research ของคุณไม่อยู่ในระดับ TRL";
        setLevelMessage(msg);
        setTrlLevel?.(null);
        if (onStateChange) {
          onStateChange({
            showPart2,
            checkboxQueue,
            answersRadio,
            answersCheckbox,
            levelMessage: msg,
            errorMessage,
          });
        }
        return;
      }

      // เพิ่มคำถามใหม่ → ล็อกคำถามเก่าอัตโนมัติ
      const newQueue = [...checkboxQueue, index - 1];
      setCheckboxQueue(newQueue);
      if (onStateChange) {
        onStateChange({
          showPart2,
          checkboxQueue: newQueue,
          answersRadio,
          answersCheckbox,
          levelMessage,
          errorMessage,
        });
      }
      return;
    }

    const msg = `Research ของคุณอยู่ในระดับ TRL ${index}`;
    setLevelMessage(msg);
    setTrlLevel?.(index);
    if (onStateChange) {
      onStateChange({
        showPart2,
        checkboxQueue,
        answersRadio,
        answersCheckbox,
        levelMessage: msg,
        errorMessage,
      });
    }
    
    if (onSubmitCheckTRL) {
      onSubmitCheckTRL(index);
    }
  };

  // Use external handlers if provided, otherwise use internal
  const handleNextToPart2 = onNextToPart2 ? () => {
    const allAnswered = Object.values(answersRadio).every((a) => a !== null);
    if (!allAnswered) {
      setErrorMessage("กรุณาตอบคำถาม Part 1 ให้ครบก่อน");
      return;
    }
    handleNextToPart2Internal();
  } : handleNextToPart2Internal;

  const handleSubmitCheckTRL = onSubmitCheckTRL ? (index: number) => {
    handleSubmitCheckTRLInternal(index);
  } : handleSubmitCheckTRLInternal;

  /* ---------------- Render ---------------- */
  return (
    <div>
      {/* ========== Part 1 ========== */}
      <h3 className="font-semibold text-primary text-lg">Part 1</h3>

      {Object.keys(answersRadio).map((key, index) => (
        <div key={key} className="mt-4">
          <RadioQuestion
            index={index + 1}
            value={
              answersRadio[key] === 1
                ? "ใช่"
                : answersRadio[key] === 0
                ? "ไม่ใช่"
                : ""
            }
            onChange={(value) => handleRadioChange(value, key)}
          />
        </div>
      ))}

      {/* ========== Part 2 ========== */}
      {showPart2 && (
        <>
          <h3 className="mt-12 font-semibold text-primary text-lg">Part 2</h3>

          {checkboxQueue.map((index, idx) => {
            const isLocked = idx !== checkboxQueue.length - 1;
            const isCurrent = currentCheckboxIndex === index || (currentCheckboxIndex === null && idx === checkboxQueue.length - 1);

            return (
              <div key={index} className="mt-6 opacity-100">
                <CheckboxQuestion
                  index={index}
                  value={answersCheckbox[`cq${index}`] || []}
                  disabled={isLocked}
                  onChange={(value, itemId, selectedLabels) =>
                    !isLocked &&
                    handleCheckboxChange(value, itemId, selectedLabels)
                  }
                />
              </div>
            );
          })}

          {levelMessage && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">{levelMessage}</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}
