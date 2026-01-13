// supporter.tsx

import React from 'react';

interface FormData {
  supportDevNeeded: string[]; // Change to string[] to support multiple selections
  supportMarketNeeded: string[]; // Change to string[]
  businessPartner: string;
  readyForShowcase: string;
  consent: string;
  otherSupportMarket: string; // Add a field for the "other" text input
}

interface SupporterProps {
  formData: FormData;
  handleInputChange: (field: string, value: any) => void;
  handleCheckboxChange: (field: string, value: string, checked: boolean) => void;
}

const Supporter: React.FC<SupporterProps> = ({
  formData,
  handleInputChange,
  handleCheckboxChange,
}) => {
  const innovationSupportOptions = [
    { value: 'ฝ่ายวิจัย', label: 'ฝ่ายวิจัย' },
    { value: 'ศูนย์ขับเคลื่อนคุณค่าการบริการ (Center for Value Driven Care: VDC)', label: 'ศูนย์ขับเคลื่อนคุณค่าการบริการ (Center for Value Driven Care: VDC)' },
    { value: 'ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (Siriraj Excellent Innovation Center: SiEIC)', label: 'ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (Siriraj Excellent Innovation Center: SiEIC)' },
    { value: 'ไม่มี', label: 'ไม่มี' },
  ];

  const assistanceOptions = [
    { value: 'การคุ้มครองทรัพย์สินทางปัญญา', label: 'การคุ้มครองทรัพย์สินทางปัญญา เช่น จดสิทธิบัตร อนุสิทธิบัตร หรือลิขสิทธิ์' },
    { value: 'หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม', label: 'หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม' },
    { value: 'การจัดกิจกรรมร่วมกับผู้ร่วมพัฒนานวัตกรรม', label: 'การจัดกิจกรรมร่วมกับผู้ร่วมพัฒนานวัตกรรม เช่น design thinking, prototype testing' },
    { value: 'หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม', label: 'หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม' },
    { value: 'หาแหล่งทุน', label: 'หาแหล่งทุน' },
    { value: 'หาคู่ค้าทางธุรกิจ', label: 'หาคู่ค้าทางธุรกิจ' },
    { value: 'แนะนำแนวทางการเริ่มธุรกิจ', label: 'แนะนำแนวทางการเริ่มธุรกิจ' },
    { value: 'การขอรับรองมาตรฐานหรือคุณภาพ', label: 'การขอรับรองมาตรฐานหรือคุณภาพ' },
    { value: 'บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม', label: 'บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม' },
    { value: 'อื่น ๆ', label: 'อื่น ๆ โปรดระบุ' },
    { value: 'ไม่มี', label: 'ไม่มี' },
  ];

  const handleSupportDevChange = (value: string, checked: boolean) => {
    if (value === 'ไม่มี' && checked) {
      // ถ้าเลือก "ไม่มี" ให้ล้างตัวเลือกอื่นทั้งหมด
      handleInputChange('supportDevNeeded', ['ไม่มี']);
    } else if (value === 'ไม่มี' && !checked) {
      // ถ้าไม่เลือก "ไม่มี" ให้ล้างตัวเลือกทั้งหมด
      handleInputChange('supportDevNeeded', []);
    } else if (checked) {
      // ถ้าเลือกตัวเลือกอื่น ให้ลบ "ไม่มี" ออก
      const newValues = formData.supportDevNeeded.filter(v => v !== 'ไม่มี');
      handleInputChange('supportDevNeeded', [...newValues, value]);
    } else {
      // ถ้าไม่เลือกตัวเลือกอื่น
      const newValues = formData.supportDevNeeded.filter(v => v !== value);
      handleInputChange('supportDevNeeded', newValues);
    }
  };

  const handleSupportMarketChange = (value: string, checked: boolean) => {
    if (value === 'ไม่มี' && checked) {
      // ถ้าเลือก "ไม่มี" ให้ล้างตัวเลือกอื่นทั้งหมด
      handleInputChange('supportMarketNeeded', ['ไม่มี']);
    } else if (value === 'ไม่มี' && !checked) {
      // ถ้าไม่เลือก "ไม่มี" ให้ล้างตัวเลือกทั้งหมด
      handleInputChange('supportMarketNeeded', []);
    } else if (checked) {
      // ถ้าเลือกตัวเลือกอื่น ให้ลบ "ไม่มี" ออก
      const newValues = formData.supportMarketNeeded.filter(v => v !== 'ไม่มี');
      handleInputChange('supportMarketNeeded', [...newValues, value]);
    } else {
      // ถ้าไม่เลือกตัวเลือกอื่น
      const newValues = formData.supportMarketNeeded.filter(v => v !== value);
      handleInputChange('supportMarketNeeded', newValues);
    }
  };

  return (
    <div className="supporter-form-container flex flex-col gap-4">
      <div className="form-group">
        <label className="form-label">
          <h3 className="font-semibold text-primary">หน่วยงานสนับสนุนนวัตกรรมที่มีอยู่เดิม<span className="text-red-500">*</span> (เลือกได้มากกว่า 1 หน่วยงาน)</h3>
        </label>
        <div className="checkbox-options flex flex-col gap-2">
          {innovationSupportOptions.map((option) => (
            <label key={option.value} className="checkbox-label">
              <input
                type="checkbox"
                name="supportDevNeeded"
                value={option.value}
                onChange={(e) => handleSupportDevChange(e.target.value, e.target.checked)}
                checked={formData.supportDevNeeded.includes(option.value)}
                className="mr-2"
                required={formData.supportDevNeeded.length === 0}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <h3 className="font-semibold text-primary">ความช่วยเหลือที่ต้องการ<span className="text-red-500">*</span> (เลือกได้มากกว่า 1 ข้อ)</h3>
        </label>
        <div className="checkbox-options flex flex-col gap-2">
          {assistanceOptions.map((option) => (
            <React.Fragment key={option.value}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="supportMarketNeeded"
                  value={option.value}
                  onChange={(e) => handleSupportMarketChange(e.target.value, e.target.checked)}
                  checked={formData.supportMarketNeeded.includes(option.value)}
                  className="mr-2"
                />
                {option.label}
              </label>
              {option.value === 'อื่น ๆ' && (
                <div className="pl-6">
                  <input
                    type="text"
                    name="otherSupportMarket"
                    className="other-input pl-6 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 w-full"
                    value={formData.otherSupportMarket}
                    onChange={(e) => handleInputChange('otherSupportMarket', e.target.value)}
                    disabled={!formData.supportMarketNeeded.includes('อื่น ๆ')}
                    placeholder="ระบุความช่วยเหลืออื่น ๆ"
                    required={formData.supportMarketNeeded.includes('อื่น ๆ')}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Supporter;