import { useState } from "react";
import RadioQuestion from "@/components/evaluate/RadioQuestion";
import CheckboxQuestion from "@/components/evaluate/CheckboxQuestion";

interface EvaluateTRLProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  setTrlLevel?: (level: number | null) => void; // เพิ่ม prop นี้
}

export default function EvaluateTRL({ formData, handleInputChange, setTrlLevel }: EvaluateTRLProps) {
  const [currentCheckboxIndex, setCurrentCheckboxIndex] = useState<number | null>(null);
  const [answersRadio, setAnswersRadio] = useState<{ [key: string]: number }>({
    rq1: null,
    rq2: null,
    rq3: null,
    rq4: null,
    rq5: null,
    rq6: null,
    rq7: null,
  });
  const [answersCheckbox, setAnswersCheckbox] = useState<{ [key: string]: number[] }>({
    cq1: [0, 0, 0],
    cq2: [0, 0, 0, 0, 0],
    cq3: [0, 0, 0, 0, 0, 0, 0],
    cq4: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    cq5: [0, 0, 0, 0, 0, 0],
    cq6: [0, 0, 0, 0],
    cq7: [0, 0, 0, 0],
    cq8: [0, 0, 0],
    cq9: [0, 0, 0, 0]
  });

  const [answersCheckboxx, setAnswersCheckboxx] = useState<{ [key: string]: string[] }>({
    cq1: [],
    cq2: [],
    cq3: [],
    cq4: [],
    cq5: [],
    cq6: [],
    cq7: [],
    cq8: [],
    cq9: []
  });
  // console.log(answersCheckboxx)

  // ปรับ setAnswerTRL ให้ sync ไปยัง parent
  const [answerTRL, setAnswerTRL] = useState<number | null>(null);

  const [levelMessage, setLevelMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showNextCheckboxButton, setShowNextCheckboxButton] = useState<boolean>(false);

  const handleRadioChange = (value: number, questionId: string) => {
    setAnswersRadio((prevAnswers) => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: value,
      };

      // ✅ Sync ไป parent
      if (handleInputChange) {
        handleInputChange(questionId + "Answer", value === 1); // แปลงเป็น boolean
      }

      return newAnswers;
    });
  };



  const handleCheckboxChange = (
    value: number[],
    itemId: string,
    selectedLabels: string[]
  ) => {
    setAnswersCheckbox((prevAnswers) => ({
      ...prevAnswers,
      [itemId]: value,
    }));

    setAnswersCheckboxx((prevLabels) => {
      const newLabels = {
        ...prevLabels,
        [itemId]: selectedLabels,
      };
      // ✅ Sync ไป parent
      if (handleInputChange) {
        handleInputChange(itemId + "Answer", selectedLabels);
      }
      return newLabels;
    });
  };


  const handleNextToCheckbox = () => {
    const allAnswered = Object.values(answersRadio).every((answer) => answer !== null);
    if (!allAnswered) {
      setErrorMessage("กรุณาตอบคำถาม Part 1 ให้ครบก่อน");
      setLevelMessage("");
      return;
    }
    setLevelMessage("");
    setErrorMessage("");
    let nextIndex = 0;
    if (answersRadio['rq1'] === 1) {
      if (answersRadio['rq2'] === 1) {
        if (answersRadio['rq3'] === 1) {
          if (answersRadio['rq4'] === 1) {
            if (answersRadio['rq5'] === 1) {
              nextIndex = 9;
            } else {
              nextIndex = 8;
            }
          } else {
            nextIndex = 7;
          }
        } else {
          nextIndex = 6;
        }
      } else {
        if (answersRadio['rq6'] === 1) {
          nextIndex = 5;
        } else {
          nextIndex = 4;
        }
      }
    } else {
      if (answersRadio['rq7'] === 1) {
        nextIndex = 3;
      } else {
        nextIndex = 2;
      }
    }
    setCurrentCheckboxIndex(nextIndex);
  }

  const handleNextToCheckTRL = () => {
    const currentAnswers = answersCheckbox[`cq${currentCheckboxIndex}`] || [];
    const allTicked = currentAnswers.every(value => value === 1);

    setLevelMessage("");
    setShowNextCheckboxButton(false);

    if (!allTicked) {
      if (currentCheckboxIndex === 1) {
        setLevelMessage("Research ของคุณไม่อยู่ในระดับ TRL");
        setAnswerTRL(null);
        if (setTrlLevel) setTrlLevel(null);
        setShowNextCheckboxButton(false);
        return;
      }
      setShowNextCheckboxButton(true);
      return;
    }

    setLevelMessage(`Research ของคุณอยู่ในระดับ TRL ${currentCheckboxIndex}`);
    setAnswerTRL(currentCheckboxIndex);
    if (setTrlLevel) setTrlLevel(currentCheckboxIndex); // sync ไป parent
  };

  const handleProceedToNextCheckbox = () => {
    setCurrentCheckboxIndex(currentCheckboxIndex - 1);
    setShowNextCheckboxButton(false);
  };

  return (
    <div>
      <h3 className="font-semibold text-primary text-lg">Part 1</h3>
      {Object.keys(answersRadio).map((key, index) => (
        <div key={key} className="mt-4">
          <RadioQuestion
            key={key}
            index={index + 1}
            value={answersRadio[key] === 1 ? "ใช่" : answersRadio[key] === 0 ? "ไม่ใช่" : ""}
            onChange={(value) => handleRadioChange(value, key)}
          />
        </div>
      ))}
      <div className="mt-4">
        <button
          onClick={handleNextToCheckbox}
          className="bg-[#00c1d6] text-white text-sm font-medium py-2 px-3 rounded"
        >
          Next to Part 2
        </button>
        {errorMessage && (
          <div className="mt-4 text-sm text-red-500 font-semibold">{errorMessage}</div>
        )}
      </div>

      <h3 className="mt-12 font-semibold text-primary text-lg">Part 2</h3>
      <div className="mt-4">
        {currentCheckboxIndex && (
          <div>
            <CheckboxQuestion
              index={currentCheckboxIndex}
              value={answersCheckbox[`cq${currentCheckboxIndex}`] || []}
              onChange={(value, itemId, selectedLabels) => handleCheckboxChange(value, itemId, selectedLabels)}
            />
            <div className="mt-4">
              <button
                onClick={handleNextToCheckTRL}
                className="bg-[#00c1d6] text-white text-sm font-medium py-2 px-3 rounded"
              >
                Submit and Check TRL Level
              </button>
            </div>
          </div>
        )}
        {showNextCheckboxButton && (
          <div className="mt-4">
            <button
              onClick={handleProceedToNextCheckbox}
              className="mt-2 bg-gray-300 text-gray-800 text-sm font-medium py-2 px-3 rounded"
            >
              Answer More Questions
            </button>
          </div>
        )}
      </div>

      {levelMessage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">{levelMessage}</h3>
        </div>
      )}
    </div>
  );
}