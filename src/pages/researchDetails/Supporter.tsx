// supporter.tsx

import React from 'react';

interface FormData {
  supportDevNeeded: string[]; // Change to string[] to support multiple selections
  supportMarketNeeded: string[]; // Change to string[]
  businessPartner: string;
  readyForShowcase: string;
  consent: string;
  otherSupportMarket: string; // Add a field for the "other" text input
  additionalDocuments: File | null;
}

interface SupporterProps {
  formData: FormData;
  handleInputChange: (field: string, value: any) => void;
  handleCheckboxChange: (field: string, value: string, checked: boolean) => void;
  handleFileChange: (file: File | null) => void;
}

const Supporter: React.FC<SupporterProps> = ({
  formData,
  handleInputChange,
  handleCheckboxChange,
  handleFileChange,
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
    { value: 'แนะน าแนวทางการเริ่มธุรกิจ', label: 'แนะน าแนวทางการเริ่มธุรกิจ' },
    { value: 'การขอรับรองมาตรฐานหรือคุณภาพ', label: 'การขอรับรองมาตรฐานหรือคุณภาพ' },
    { value: 'บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม', label: 'บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม' },
    { value: 'อื่น ๆ', label: 'อื่น ๆ โปรดระบุ' },
    { value: 'ไม่มี', label: 'ไม่มี' },
  ];

  const handleFileButtonClick = () => {
    document.getElementById('additionalDocuments')?.click();
  };

  return (
    <div className="supporter-form-container flex flex-col gap-4">
      <div className="form-group">
        <label className="form-label">
          <h3 className="font-semibold text-primary">หน่วยงานสนับสนุนนวัตกรรมที่มีอยู่เดิม* (เลือกได้มากกว่า 1 หน่วยงาน)</h3>
        </label>
        <div className="checkbox-options flex flex-col gap-2">
          {innovationSupportOptions.map((option) => (
            <label key={option.value} className="checkbox-label">
              <input
                type="checkbox"
                name="supportDevNeeded"
                value={option.value}
                onChange={(e) => handleCheckboxChange('supportDevNeeded', e.target.value, e.target.checked)}
                checked={formData.supportDevNeeded.includes(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <h3 className="font-semibold text-primary">ความช่วยเหลือที่ต้องการ* (เลือกได้มากกว่า 1 ข้อ)</h3>
        </label>
        <div className="checkbox-options flex flex-col gap-2">
          {assistanceOptions.map((option) => (
            <React.Fragment key={option.value}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="supportMarketNeeded"
                  value={option.value}
                  onChange={(e) => handleCheckboxChange('supportMarketNeeded', e.target.value, e.target.checked)}
                  checked={formData.supportMarketNeeded.includes(option.value)}
                />
                {option.label}
              </label>
              {option.value === 'อื่น ๆ' && (
                <input
                  type="text"
                  name="otherSupportMarket"
                  className="other-input pl-6 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                  value={formData.otherSupportMarket}
                  onChange={(e) => handleInputChange('otherSupportMarket', e.target.value)}
                  disabled={!formData.supportMarketNeeded.includes('อื่น ๆ')}
                  placeholder="ระบุความช่วยเหลืออื่น ๆ"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="additionalDocuments" className="form-label">
          <h3 className="font-semibold text-primary">เอกสารเพิ่มเติม (แนบ file)</h3>
        </label>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={handleFileButtonClick}
            className="w-30 sm:w-auto px-2 py-1 bg-gray-100/50 border border-gray-200 text-gray-400 rounded-lg hover:bg-primary hover:border-primary hover:text-white transition-colors duration-300 focus:outline-none focus:bg-primary focus:text-white"
          >
            Choose File
          </button>
          <input
            type="file"
            id="additionalDocuments"
            name="additionalDocuments"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden" // Hide the default input
          />
          {formData.additionalDocuments && (
            <h4 className="text-sm text-gray-600 mt-1">
              <span>ไฟล์ที่เลือก:</span> 
              <span className="text-primary ml-1">{formData.additionalDocuments.name}</span>
            </h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default Supporter;