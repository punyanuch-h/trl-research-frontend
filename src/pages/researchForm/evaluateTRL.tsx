import { useState } from "react";
import RadioQuestion from "@/components/evaluate/RadioQuestion";
import CheckboxQuestion from "@/components/evaluate/CheckboxQuestion";

interface EvaluateTRLProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  setTrlLevel?: (level: number | null) => void;
}

export default function EvaluateTRL({
  formData,
  handleInputChange,
  setTrlLevel,
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

  /* ---------------- Handlers ---------------- */
  const handleRadioChange = (value: number, questionId: string) => {
    setAnswersRadio((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    handleInputChange(questionId + "Answer", value === 1);
  };

  const handleCheckboxChange = (
    value: number[],
    itemId: string,
    selectedLabels: string[]
  ) => {
    setAnswersCheckbox((prev) => ({
      ...prev,
      [itemId]: value,
    }));
    handleInputChange(itemId + "Answer", selectedLabels);
  };

  /* ---------------- Logic ---------------- */
  const handleNextToPart2 = () => {
    const allAnswered = Object.values(answersRadio).every((a) => a !== null);
    if (!allAnswered) {
      setErrorMessage("กรุณาตอบคำถาม Part 1 ให้ครบก่อน");
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

    setCheckboxQueue([firstIndex]);
    setShowPart2(true);
  };

  const handleSubmitCheckTRL = (index: number) => {
    const answers = answersCheckbox[`cq${index}`] || [];
    console.log("Checking TRL for index:", index, "with answers:", answers);
    const allChecked = answers.every((v) => v === 1);

    if (!allChecked) {
      if (index === 1) {
        setLevelMessage("Research ของคุณไม่อยู่ในระดับ TRL");
        setTrlLevel?.(null);
        return;
      }

      // เพิ่มคำถามใหม่ → ล็อกคำถามเก่าอัตโนมัติ
      setCheckboxQueue((prev) => [...prev, index - 1]);
      return;
    }

    setLevelMessage(`Research ของคุณอยู่ในระดับ TRL ${index}`);
    setTrlLevel?.(index);
  };

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
          {answersRadio[key] === 1 && (
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
                    [key]: file,
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
          )}
        </div>
      ))}

      <div className="mt-6">
        <button
          onClick={handleNextToPart2}
          className="bg-[#00c1d6] text-white text-sm font-medium py-2 px-3 rounded"
        >
          Next to Part 2
        </button>

        {errorMessage && (
          <div className="mt-3 text-sm text-red-500 font-semibold">
            {errorMessage}
          </div>
        )}
      </div>

      {/* ========== Part 2 ========== */}
      {showPart2 && (
        <>
          <h3 className="mt-12 font-semibold text-primary text-lg">Part 2</h3>

          {checkboxQueue.map((index, idx) => {
            const isLocked = idx !== checkboxQueue.length - 1;
            const checkboxValues = answersCheckbox[`cq${index}`] || [];

            return (
              <div key={index} className="mt-6 opacity-100">
                <CheckboxQuestion
                  index={index}
                  value={checkboxValues}
                  disabled={isLocked}
                  onChange={(value, itemId, selectedLabels) =>
                    !isLocked &&
                    handleCheckboxChange(value, itemId, selectedLabels)
                  }
                  assessmentFiles={formData.assessmentFiles}
                  onAttachFile={(fieldKey, file) =>
                    handleInputChange("assessmentFiles", {
                      ...formData.assessmentFiles,
                      [fieldKey]: file,
                    })
                  }
                />

                <button
                  disabled={isLocked}
                  onClick={() => handleSubmitCheckTRL(index)}
                  className={`mt-4 text-sm font-medium py-2 px-3 rounded
                    ${
                      isLocked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#00c1d6] text-white"
                    }`}
                >
                  Submit and Check TRL Level
                </button>
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

