import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";

interface IpFormState {
  ipStatus: string;
  ipTypes: string[];
  requestNumbers: { [key: string]: string };
  noIp: boolean;
  file?: File | null;
  error?: string;
}

interface IntellectualPropertyProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

const ipTypesList = [
  { id: "patent", label: "สิทธิบัตร" },
  { id: "pettyPatent", label: "อนุสิทธิบัตร" },
  { id: "designPatent", label: "สิทธิบัตรออกแบบผลิตภัณฑ์" },
  { id: "copyright", label: "ลิขสิทธิ์" },
  { id: "trademark", label: "เครื่องหมายการค้า" },
  { id: "tradeSecret", label: "ความลับทางการค้า" },
];

export default function IntellectualProperty({
  formData,
  handleInputChange,
}: IntellectualPropertyProps) {
  const [forms, setForms] = useState<IpFormState[]>(() => {
    if (formData.ipForms && Array.isArray(formData.ipForms) && formData.ipForms.length > 0) {
      return formData.ipForms;
    }
    return [{ ipStatus: "", ipTypes: [], requestNumbers: {}, noIp: false, file: null }];
  });

  useEffect(() => {
    if (formData.ipForms && Array.isArray(formData.ipForms) && formData.ipForms.length > 0) {
      setForms(formData.ipForms);
    }
  }, [formData.ipForms]);

  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (isInitialized) {
      handleInputChange("ipForms", forms);
    } else {
      setIsInitialized(true);
    }
  }, [forms]);

  const handleNoIpToggle = (formIndex: number, checked: boolean) => {
    setForms((currentForms) => {
      const updated = [...currentForms];
      updated[formIndex].noIp = checked;
      if (checked) {
        updated[formIndex].ipStatus = "";
        updated[formIndex].ipTypes = [];
        updated[formIndex].requestNumbers = {};
      }
      return updated;
    });

    handleInputChange("ipHas", !checked);
    if (checked) {
      handleInputChange("ipProtectionStatus", "");
      handleInputChange("ipTypes", []);
      handleInputChange("ipRequestNumber", "");
    }
  };

  const handleFormStatusChange = (formIndex: number, value: string) => {
    setForms((currentForms) => {
      const updatedForms = [...currentForms];
      updatedForms[formIndex].ipStatus = value;
      if (value !== "ได้เลขที่คำขอแล้ว") {
        updatedForms[formIndex].requestNumbers = {};
      }
      return updatedForms;
    });

    handleInputChange("ipProtectionStatus", value);
    if (value !== "ได้เลขที่คำขอแล้ว") {
      handleInputChange("ipRequestNumber", "");
    }
  };

  const handleFormTypeChange = (formIndex: number, newIpType: string) => {
    setForms((currentForms) => {
      const updatedForms = [...currentForms];
      updatedForms[formIndex].ipTypes = [newIpType];
      updatedForms[formIndex].requestNumbers = {};
      return updatedForms;
    });

    handleInputChange("ipTypes", [newIpType]);
    handleInputChange("ipRequestNumber", "");
  };

  const handleFormRequestNumberChange = (
    formIndex: number,
    ipType: string,
    value: string
  ) => {
    const regexMap: { [key: string]: RegExp } = {
    patent: /^\d{7}$/,
    pettyPatent: /^2\d{6}$/,
    designPatent: /^[Dd]\d{6}$/,
    copyright: /^[A-Za-z0-9\-\/]{5,30}$/,
    trademark: /^\d{7,8}$/,
    tradeSecret: /^.{1,100}$/,
  };

  const regex = regexMap[ipType];
  const errorMessage = regex && !regex.test(value)
    ? `หมายเลขคำขอสำหรับ ${ipTypesList.find((item) => item.id === ipType)?.label} ไม่ถูกต้อง`
    : "";

  setForms((currentForms) => {
    const updatedForms = [...currentForms];
    updatedForms[formIndex].requestNumbers[ipType] = value;
    updatedForms[formIndex].error = errorMessage; // Add error message to the form
    return updatedForms;
  });

  handleInputChange("ipRequestNumber", value);
  };

  const handleAddForm = () => {
    setForms((currentForms) => [
      ...currentForms,
      { ipStatus: "", ipTypes: [], requestNumbers: {}, noIp: false, file: null },
    ]);
  };

  const handleFormFileChange = (formIndex: number, file: File | null) => {
    setForms((currentForms) => {
      const updatedForms = [...currentForms];
      updatedForms[formIndex].file = file;
      return updatedForms;
    });
  };

  const handleRemoveForm = (formIndex: number) => {
    if (forms.length > 1) {
      setForms((currentForms) =>
        currentForms.filter((_, i) => i !== formIndex)
      );
    }
  };

  return (
    <div className="space-y-6">
      {forms.map((form, formIndex) => (
        <div
          key={formIndex}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-lg text-primary-80">
              ใบที่ {formIndex + 1}
            </h4>
            {forms.length > 1 && (
              <button
                onClick={() => handleRemoveForm(formIndex)}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <RadioGroup
            value={form.noIp ? "ไม่มี" : "มี"}
            onValueChange={(value) =>
              handleNoIpToggle(formIndex, value === "ไม่มี")
            }
            className="flex items-center space-x-2"
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem id={`noIp-no-${formIndex}`} value="ไม่มี" />
              <Label htmlFor={`noIp-no-${formIndex}`}>ไม่มี</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id={`noIp-yes-${formIndex}`} value="มี" />
              <Label htmlFor={`noIp-yes-${formIndex}`}>มี</Label>
            </div>
          </RadioGroup>

          {!form.noIp && (
            <>
              {/* Radio inside each card */}
              <div>
                <h3 className="font-semibold text-primary">
                  สถานะการคุ้มครองทรัพย์สินทางปัญญา<span className="text-red-500">*</span>
                </h3>
                <RadioGroup
                  value={form.ipStatus}
                  onValueChange={(value) =>
                    handleFormStatusChange(formIndex, value)
                  }
                  className="m-4 flex items-center space-x-2"
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="ได้เลขที่คำขอแล้ว"
                      id={`hasNumber-${formIndex}`}
                    />
                    <Label htmlFor={`hasNumber-${formIndex}`}>
                      ได้เลขที่คำขอแล้ว
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="กำลังดำเนินการ"
                      id={`inProgress-${formIndex}`}
                    />
                    <Label htmlFor={`inProgress-${formIndex}`}>
                      กำลังดำเนินการ
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Choose type */}
              {form.ipStatus && (
                <div>
                  <h3 className="font-semibold text-primary">ระบุประเภท<span className="text-red-500">*</span></h3>
                  <RadioGroup
                    value={form.ipTypes[0] || ""}
                    onValueChange={(value) =>
                      handleFormTypeChange(formIndex, value)
                    }
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2"
                    required
                  >
                    {ipTypesList.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={item.id}
                          id={`${item.id}-${formIndex}`}
                        />
                        <Label htmlFor={`${item.id}-${formIndex}`}>
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Number input */}
              {form.ipStatus === "ได้เลขที่คำขอแล้ว" && form.ipTypes[0] && (
                <div>
                  <h3 className="font-semibold text-primary">ระบุเลขที่คำขอ<span className="text-red-500">*</span></h3>
                  <Input
                    type="text"
                    value={form.requestNumbers[form.ipTypes[0]] || ""}
                    onChange={(e) =>
                      handleFormRequestNumberChange(
                        formIndex,
                        form.ipTypes[0],
                        e.target.value
                      )
                    }
                    placeholder="เช่น 123456789"
                    className="mt-1"
                    required
                  />
                </div>
              )}
              {form.ipStatus === "ได้เลขที่คำขอแล้ว" && form.error && (
                <p className="text-red-500 text-sm mt-1">{form.error}</p>
              )}
              {/* File upload */}
              <div>
                <h3 className="font-semibold text-primary">เอกสารเพิ่มเติม (แนบ file)</h3>
                <div className="flex gap-2 items-center mt-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById(`ipFile-${formIndex}`)?.click()}
                    className="w-30 sm:w-auto px-2 py-1 bg-gray-100/50 border border-gray-200 text-gray-400 rounded-lg hover:bg-primary hover:border-primary hover:text-white transition-colors duration-300 focus:outline-none focus:bg-primary focus:text-white"
                  >
                    Choose File
                  </button>
                  <input
                    type="file"
                    id={`ipFile-${formIndex}`}
                    name={`ipFile-${formIndex}`}
                    accept=".pdf"
                    onChange={(e) => handleFormFileChange(formIndex, e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {form.file && (
                    <h4 className="text-sm text-gray-600 mt-1">
                      <span>ไฟล์ที่เลือก:</span>
                      <span className="text-primary ml-1">{form.file.name}</span>
                    </h4>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="flex justify-center">
        <button
          onClick={handleAddForm}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        >
          <Plus className="w-4 h-4" /> add
        </button>
      </div>
    </div>
  );
}