import { useState, useEffect } from "react";
import RadioQuestion from "@/components/evaluate/RadioQuestion";
import CheckboxQuestion from "@/components/evaluate/CheckboxQuestion";

interface EvaluateTRLProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  setTrlLevel?: (level: number | null) => void;
  onStateChange?: (state: {
    showPart2: boolean;
    checkboxQueue: number[];
    answersRadio: { [key: string]: number | null };
    answersCheckbox: { [key: string]: number[] };
    levelMessage: string;
    errorMessage: string;
  }) => void;
  externalState?: {
    showPart2: boolean;
    checkboxQueue: number[];
    answersRadio: { [key: string]: number | null };
    answersCheckbox: { [key: string]: number[] };
    levelMessage: string;
    errorMessage: string;
  };
  currentCheckboxIndex?: number | null;
}

export default function EvaluateTRL({
  formData,
  handleInputChange,
  setTrlLevel,
  onStateChange,
  externalState,
  currentCheckboxIndex,
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

  // Use external state if provided, otherwise use internal state
  const currentShowPart2 = externalState?.showPart2 ?? showPart2;
  const currentCheckboxQueue = externalState?.checkboxQueue ?? checkboxQueue;
  const currentAnswersRadio = externalState?.answersRadio ?? answersRadio;
  const currentAnswersCheckbox = externalState?.answersCheckbox ?? answersCheckbox;
  const currentLevelMessage = externalState?.levelMessage ?? levelMessage;
  const currentErrorMessage = externalState?.errorMessage ?? errorMessage;

  // Sync internal state with external state
  useEffect(() => {
    if (externalState) {
      setShowPart2(externalState.showPart2);
      setCheckboxQueue(externalState.checkboxQueue);
      setAnswersRadio(externalState.answersRadio);
      setAnswersCheckbox(externalState.answersCheckbox);
      setLevelMessage(externalState.levelMessage);
      setErrorMessage(externalState.errorMessage);
    }
  }, [externalState]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && !externalState) {
      onStateChange({
        showPart2,
        checkboxQueue,
        answersRadio,
        answersCheckbox,
        levelMessage,
        errorMessage,
      });
    }
  }, [showPart2, checkboxQueue, answersRadio, answersCheckbox, levelMessage, errorMessage, onStateChange, externalState]);

  /* ---------------- Handlers ---------------- */
  const handleRadioChange = (value: number, questionId: string) => {
    const newAnswersRadio = {
      ...currentAnswersRadio,
      [questionId]: value,
    };
    
    if (externalState && onStateChange) {
      // Update parent state directly
      onStateChange({
        ...externalState,
        answersRadio: newAnswersRadio,
      });
    } else {
      // Update internal state
      setAnswersRadio(newAnswersRadio);
    }
    
    handleInputChange(questionId + "Answer", value === 1);
  };

  const handleCheckboxChange = (
    value: number[],
    itemId: string,
    selectedLabels: string[]
  ) => {
    const newAnswersCheckbox = {
      ...currentAnswersCheckbox,
      [itemId]: value,
    };
    
    if (externalState && onStateChange) {
      // Update parent state directly
      onStateChange({
        ...externalState,
        answersCheckbox: newAnswersCheckbox,
      });
    } else {
      // Update internal state
      setAnswersCheckbox(newAnswersCheckbox);
    }
    
    handleInputChange(itemId + "Answer", selectedLabels);
  };

  /* ---------------- Render ---------------- */
  return (
    <div>
      {/* ========== Part 1 ========== */}
      <h3 className="font-semibold text-primary text-lg">Part 1</h3>

      {Object.keys(currentAnswersRadio).map((key, index) => (
        <div key={key} className="mt-4">
          <RadioQuestion
            index={index + 1}
            value={
              currentAnswersRadio[key] === 1
                ? "ใช่"
                : currentAnswersRadio[key] === 0
                ? "ไม่ใช่"
                : ""
            }
            onChange={(value) => handleRadioChange(value, key)}
          />
          <div className="mt-2 ml-4">
            <button
              type="button"
              onClick={() => document.getElementById(`file-${key}`)?.click()}
              className="text-sm px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              แนบหลักฐาน
            </button>
            <input
              type="file"
              id={`file-${key}`}
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleInputChange("assessmentFiles", {
                  ...formData.assessmentFiles,
                  [key]: file
                });
              }}
              className="hidden"
            />
            {formData.assessmentFiles?.[key as keyof typeof formData.assessmentFiles] && (
              <span className="text-sm text-green-600 ml-2">
                ✓ {formData.assessmentFiles[key as keyof typeof formData.assessmentFiles]?.name}
              </span>
            )}
          </div>
        </div>
      ))}

      {currentErrorMessage && (
        <div className="mt-6 text-sm text-red-500 font-semibold">
          {currentErrorMessage}
        </div>
      )}

      {/* ========== Part 2 ========== */}
      {currentShowPart2 && (
        <>
          <h3 className="mt-12 font-semibold text-primary text-lg">Part 2</h3>

          {currentCheckboxQueue.map((index, idx) => {
            const isLocked = idx !== currentCheckboxQueue.length - 1;

            return (
              <div key={index} className="mt-6 opacity-100">
                <CheckboxQuestion
                  index={index}
                  value={currentAnswersCheckbox[`cq${index}`] || []}
                  disabled={isLocked}
                  onChange={(value, itemId, selectedLabels) =>
                    !isLocked &&
                    handleCheckboxChange(value, itemId, selectedLabels)
                  }
                />

               
                {/* File Upload for Part 2 */}
                <div className="mt-2 ml-4">
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => document.getElementById(`file-cq${index}`)?.click()}
                    className={`text-sm px-3 py-1 border rounded transition-colors ${isLocked
                      ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 transition-all font-medium"
                      }`}
                  >
                    แนบหลักฐาน
                  </button>
                  <input
                    type="file"
                    id={`file-cq${index}`}
                    accept=".pdf"
                    disabled={isLocked}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleInputChange("assessmentFiles", {
                        ...formData.assessmentFiles,
                        [`cq${index}`]: file
                      });
                    }}
                    className="hidden"
                  />
                  {formData.assessmentFiles?.[`cq${index}` as keyof typeof formData.assessmentFiles] && (
                    <span className="text-sm text-green-600 ml-2">
                      ✓ {formData.assessmentFiles[`cq${index}` as keyof typeof formData.assessmentFiles]?.name}
                    </span>
                  )}
                </div>

              </div>
            );
          })}

          {currentLevelMessage && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">{currentLevelMessage}</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}

