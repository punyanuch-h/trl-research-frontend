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
  // ใช้ค่าเริ่มต้นจาก formData.ipForms ถ้ามี (สำหรับกรณี user กลับมาจาก step 5)
  const [forms, setForms] = useState<IpFormState[]>(
    formData.ipForms && Array.isArray(formData.ipForms) && formData.ipForms.length > 0
      ? formData.ipForms
      : [{ ipStatus: "", ipTypes: [], requestNumbers: {}, noIp: false }]
  );

  // เมื่อ formData.ipForms เปลี่ยน (เช่น กรณี user กลับมาจาก step 5) ให้ sync state forms ด้วย
  useEffect(() => {
    if (formData.ipForms && Array.isArray(formData.ipForms)) {
      setForms(formData.ipForms);
    }
    // eslint-disable-next-line
  }, [formData.ipForms]);

  // Sync forms to parent (formData) on every change
  useEffect(() => {
    handleInputChange("ipForms", forms);
    // eslint-disable-next-line
  }, [forms]);

  // เมื่อเลือก "มี"/"ไม่มี"
  const handleNoIpToggle = (formIndex: number, checked: boolean) => {
    setForms((currentForms) => {
      const updated = [...currentForms];
      updated[formIndex].noIp = checked;
      if (checked) {
        updated[formIndex].ipStatus = "";
        updated[formIndex].ipTypes = [];
        updated[formIndex].requestNumbers = {};
      }
      // sync กลับไป parent
      handleInputChange("ipHas", !checked);
      handleInputChange("ipProtectionStatus", "");
      handleInputChange("ipTypes", []);
      handleInputChange("ipRequestNumber", "");
      return updated;
    });
  };

  // เมื่อเลือกสถานะ
  const handleFormStatusChange = (formIndex: number, value: string) => {
    setForms((currentForms) => {
      const updatedForms = [...currentForms];
      updatedForms[formIndex].ipStatus = value;
      if (value !== "ได้เลขที่คำขอแล้ว") {
        updatedForms[formIndex].requestNumbers = {};
      }
      // sync กลับไป parent
      handleInputChange("ipProtectionStatus", value);
      if (value !== "ได้เลขที่คำขอแล้ว") {
        handleInputChange("ipRequestNumber", "");
      }
      return updatedForms;
    });
  };

  // เมื่อเลือกประเภท
  const handleFormTypeChange = (formIndex: number, newIpType: string) => {
    setForms((currentForms) => {
      const updatedForms = [...currentForms];
      updatedForms[formIndex].ipTypes = [newIpType];
      updatedForms[formIndex].requestNumbers = {};
      // sync กลับไป parent
      handleInputChange("ipTypes", [newIpType]);
      handleInputChange("ipRequestNumber", "");
      return updatedForms;
    });
  };

  // เมื่อกรอกเลขที่คำขอ
  const handleFormRequestNumberChange = (
    formIndex: number,
    ipType: string,
    value: string
  ) => {
    setForms((currentForms) => {
      const updatedForms = [...currentForms];
      updatedForms[formIndex].requestNumbers[ipType] = value;
      // sync กลับไป parent
      handleInputChange("ipRequestNumber", value);
      return updatedForms;
    });
  };

  const handleAddForm = () => {
    setForms((currentForms) => [
      ...currentForms,
      { ipStatus: "", ipTypes: [], requestNumbers: {}, noIp: false },
    ]);
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

          {/* <div className="flex items-center space-x-2">
            <RadioGroupItem
              id={`noIp-${formIndex}`}
              checked={form.noIp}
              onValueChange={(value) =>
                handleNoIpToggle(formIndex, value as boolean)
              }
            />
            <Label htmlFor={`noIp-${formIndex}`}>ไม่มี</Label>
          </div> */}

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

          {/* If "ไม่มี" checked → hide everything */}
          {!form.noIp && (
            <>
              {/* Radio inside each card */}
              <div>
                <h3 className="font-semibold text-primary">
                  สถานะการคุ้มครองทรัพย์สินทางปัญญา*
                </h3>
                <RadioGroup
                  value={form.ipStatus}
                  onValueChange={(value) =>
                    handleFormStatusChange(formIndex, value)
                  }
                  className="m-4 flex items-center space-x-2"
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
                  <h3 className="font-semibold text-primary">ระบุประเภท*</h3>
                  <RadioGroup
                    value={form.ipTypes[0] || ""}
                    onValueChange={(value) =>
                      handleFormTypeChange(formIndex, value)
                    }
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2"
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
                  <h3 className="font-semibold text-primary">ระบุเลขที่คำขอ*</h3>
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
                  />
                </div>
              )}
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