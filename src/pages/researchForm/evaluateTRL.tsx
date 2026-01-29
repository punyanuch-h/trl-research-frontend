import { useState, useEffect } from "react";
import RadioQuestion from "@/components/evaluate/RadioQuestion";
import CheckboxQuestion from "@/components/evaluate/CheckboxQuestion";
import { checkboxQuestionList } from "@/data/checkboxQuestionList";

interface EvaluateTRLProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  setTrlLevel?: (level: number | null) => void;
  setTrlCompleted: (completed: boolean) => void;
  setIsEvaluated: (evaluated: boolean) => void;
}

export default function EvaluateTRL({
  formData,
  handleInputChange,
  setTrlLevel,
  setIsEvaluated,
  setTrlCompleted,
}: EvaluateTRLProps) {
  const radioDecisionMap: {
    [index: number]: {
      yes?: number;
      no?: number;
      yesStartTRL?: number;
      noStartTRL?: number;
    };
  } = {
    0: { yes: 1, no: 6 },
    1: { yes: 2, no: 5 },
    2: { yes: 3, no: 4 },
    3: { yes: 4, noStartTRL: 7 },
    4: { yesStartTRL: 9, noStartTRL: 8 },
    5: { yesStartTRL: 5, noStartTRL: 4 },
    6: { yesStartTRL: 3, noStartTRL: 2 },
  };

  const [radioAnswers, setRadioAnswers] = useState<
    { index: number; value: string }[]
  >([]);
  const [checkboxSteps, setCheckboxSteps] = useState<
    {
      level: number;
      value: number[];
    }[]
  >([]);
  const [radioFiles, setRadioFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const isYes = (value: string) => value === "ใช่";

  const [radioIndex, setRadioIndex] = useState(0);
  const [maxLevel, setMaxLevel] = useState<number | null>(null);
  const [phase, setPhase] = useState<"radio" | "checkbox" | "result">("radio");

  const updateTrlLevel = (level: number | null) => {
    if (!setTrlLevel) return;

    if (level !== null && level >= 1 && level <= 9) {
      setTrlLevel(level);
    } else {
      setTrlLevel(0);
    }
  };
  
  const handleRadioChange = (index: number, value: number) => {
    const answerText = value === 1 ? "ใช่" : "ไม่ใช่";
    const answerBool = value === 1;
    const rqField = `rq${index + 1}_answer`;

    // Store answer in formData
    handleInputChange(rqField, answerBool);

    setRadioAnswers(prev => {
      const updated = prev.slice(0, index);

      updated.push({ index, value: answerText });
      return updated;
    });
    const decision = radioDecisionMap[index];
    const nextRadioIndex = answerBool ? decision?.yes : decision?.no;
    const startTRL = answerBool
      ? decision?.yesStartTRL
      : decision?.noStartTRL;

    if (startTRL) {
      setCheckboxSteps([
        {
          level: startTRL,
          value: [],
        },
      ]);
      setPhase("checkbox");
      setRadioIndex(index);
      updateTrlLevel(0);
      setIsEvaluated(false);
      setTrlCompleted(false);
      return;
    }

    if (typeof nextRadioIndex === "number") {
      setRadioIndex(nextRadioIndex);
      setPhase("radio");
    }

    setIsEvaluated(false);
    setTrlCompleted(false);
  };

  const isChecklistComplete = (level: number, value: number[]) => {
    const questions = checkboxQuestionList[level - 1];
    return questions.every((_, idx) => value[idx] === 1);
  };

  const handleCheckboxChange = (
    stepIndex: number,
    newValue: number[]
  ) => {
    setCheckboxSteps(prev => {
      const updated = [...prev];
      const step = updated[stepIndex];

      step.value.forEach((oldVal, idx) => {
        if (oldVal === 1 && newValue[idx] === 0) {
          const fileKey = `cq${step.level}-${idx + 1}`;
          handleInputChange("assessmentFiles", {
            ...formData.assessmentFiles,
            [fileKey]: null,
          });
        }
      });

      const wasComplete = isChecklistComplete(step.level, step.value);
      const isNowComplete = isChecklistComplete(step.level, newValue);

      updated[stepIndex] = {
        ...step,
        value: newValue,
      };

      const questions = checkboxQuestionList[step.level - 1];
      const selectedLabels = questions
        .map((item, idx) => (newValue[idx] === 1 ? item.label : null))
        .filter((label): label is string => label !== null);
      const cqField = `cq${step.level}_answer`;
      handleInputChange(cqField, selectedLabels);

      if (wasComplete !== isNowComplete) {
        const stepsToRemove = updated.slice(stepIndex + 1);
        stepsToRemove.forEach(removedStep => {
          const removedCqField = `cq${removedStep.level}_answer`;
          handleInputChange(removedCqField, []);
        });
        
        updated.splice(stepIndex + 1);
        setPhase("checkbox");
        setMaxLevel(null);
        updateTrlLevel(0);
      }
      setTrlCompleted(false);
      setIsEvaluated(false);

      return updated;
    });
  };

  
  
  const currentStepIndex = checkboxSteps.length - 1;
  const currentStep = checkboxSteps[currentStepIndex];

  const handleEvaluateCheckbox = () => {
    if (!currentStep) return;

    if (isChecklistComplete(currentStep.level, currentStep.value)) {
      setPhase("result");
      setMaxLevel(currentStep.level);
      updateTrlLevel(currentStep.level);
      setIsEvaluated(true);
      setTrlCompleted(true);
      return;
    }
    setCheckboxSteps(prev => [
      ...prev,
      {
        level: currentStep.level - 1,
        value: [],
      },
    ]);
    updateTrlLevel(0);
    setIsEvaluated(false);
    setTrlCompleted(false);
  };

  const [levelMessage, setLevelMessage] = useState("");


  useEffect(() => {
    handleInputChange("radioAnswers", radioAnswers);
    handleInputChange("checkboxSteps", checkboxSteps);
    handleInputChange("radioFiles", radioFiles);
  }, [radioAnswers, checkboxSteps, radioFiles, handleInputChange]);

  useEffect(() => {
    if (formData.radioAnswers) {
      setRadioAnswers(formData.radioAnswers);
    }

    if (formData.checkboxSteps) {
      setCheckboxSteps(formData.checkboxSteps);
      setPhase("checkbox");
    }

    if (formData.radioFiles) {
      setRadioFiles(formData.radioFiles);
    }

    if (formData.radioAnswers?.length) {
      const last = formData.radioAnswers[formData.radioAnswers.length - 1];
      setRadioIndex(last.index);
      setPhase("radio");
    }
  }, []);


  /* ================= Render ================= */
  return (
    <div>
      {/* ========== Part 1 ========== */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm space-y-4 mb-8">
        <h3 className="font-semibold text-primary text-lg">Part 1</h3>

        {radioAnswers.map((ans) => {
          const fileKey = `radio-${ans.index}`;
          const file = radioFiles[fileKey];

          return (
            <div key={ans.index} className="space-y-2">
              <RadioQuestion
                index={ans.index + 1}
                value={ans.value}
                onChange={(v) => handleRadioChange(ans.index, v)}
              />

              {isYes(ans.value) && (
                <div className="ml-6 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(`file-${fileKey}`)?.click()
                    }
                    className="text-sm px-3 py-1 border rounded
              bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                  >
                    แนบหลักฐาน
                  </button>

                  <input
                    type="file"
                    id={`file-${fileKey}`}
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setRadioFiles(prev => ({
                        ...prev,
                        [fileKey]: f,
                      }));
                      // Store file in formData.assessmentFiles
                      const rqFileKey = `rq${ans.index + 1}`;
                      handleInputChange("assessmentFiles", {
                        ...formData.assessmentFiles,
                        [rqFileKey]: f,
                      });
                    }}
                  />

                  {file && (
                    <span className="text-sm text-green-600">
                      ✓ {file.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}


        {phase === "radio" && (
          <RadioQuestion
            index={radioIndex + 1}
            value={
              radioAnswers.find(a => a.index === radioIndex)?.value ?? ""
            }
            onChange={(v) => handleRadioChange(radioIndex, v)}
          />
        )}

      </div>


      {/* ========== Part 2 ========== */}
      {(phase === "checkbox" || phase === "result") && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm space-y-4 mb-8">
          <h3 className="font-semibold text-primary text-lg">Part 2</h3>
          {checkboxSteps.map((step, stepIndex) => (
            <div key={stepIndex} className="space-y-2">
              <CheckboxQuestion
                index={step.level}
                value={step.value}
                onChange={(value) =>
                  handleCheckboxChange(stepIndex, value)
                }
                assessmentFiles={formData.assessmentFiles}
                onAttachFile={(fieldKey, file) => {
                  handleInputChange("assessmentFiles", {
                    ...formData.assessmentFiles,
                    [fieldKey]: file,
                  });
                }}
              />
            </div>
          ))}
          {/* 🔘 Global Evaluate Button */}
          {phase === "checkbox" && currentStep && (
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleEvaluateCheckbox}
                className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:opacity-90"
              >
                ประเมิน
              </button>
            </div>
          )}
        </div>
      )}

      {levelMessage && (
        <div className="mt-6 text-lg font-semibold">{levelMessage}</div>
      )}
    </div>
  );
}
