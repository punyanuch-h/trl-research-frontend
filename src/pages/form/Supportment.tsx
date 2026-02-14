import React from 'react';
import { useTranslation } from "react-i18next";

interface FormData {
  supportDevNeeded: string[];
  supportMarketNeeded: string[];
  businessPartner: string;
  readyForShowcase: string;
  consent: string;
  otherSupportMarket: string;
}

type SupportFormKeys = keyof FormData;

interface SupporterProps {
  formData: FormData;

  handleInputChange: (
    field: SupportFormKeys,
    value: FormData[SupportFormKeys]
  ) => void;

  handleCheckboxChange: (
    field: SupportFormKeys,
    value: string,
    checked: boolean
  ) => void;
}

const Supporter: React.FC<SupporterProps> = ({
  formData,
  handleInputChange,
  handleCheckboxChange,
}) => {
  const { t } = useTranslation();

  const innovationSupportOptions = [
    { value: 'ฝ่ายวิจัย', labelKey: 'form.innovationSupport1' },
    { value: 'ศูนย์ขับเคลื่อนคุณค่าการบริการ (Center for Value Driven Care: VDC)', labelKey: 'form.innovationSupport2' },
    { value: 'ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (Siriraj Excellent Innovation Center: SiEIC)', labelKey: 'form.innovationSupport3' },
    { value: 'ไม่มี', labelKey: 'form.assistance11' },
  ];

  const assistanceOptions = [
    { value: 'การคุ้มครองทรัพย์สินทางปัญญา', labelKey: 'form.assistance1' },
    { value: 'หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม', labelKey: 'form.assistance2' },
    { value: 'การจัดกิจกรรมร่วมกับผู้ร่วมพัฒนานวัตกรรม', labelKey: 'form.assistance3' },
    { value: 'หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม', labelKey: 'form.assistance4' },
    { value: 'หาแหล่งทุน', labelKey: 'form.assistance5' },
    { value: 'หาคู่ค้าทางธุรกิจ', labelKey: 'form.assistance6' },
    { value: 'แนะนำแนวทางการเริ่มธุรกิจ', labelKey: 'form.assistance7' },
    { value: 'การขอรับรองมาตรฐานหรือคุณภาพ', labelKey: 'form.assistance8' },
    { value: 'บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม', labelKey: 'form.assistance9' },
    { value: 'อื่น ๆ', labelKey: 'form.assistance10' },
    { value: 'ไม่มี', labelKey: 'form.assistance11' },
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
    <div className="supportment-form-container flex flex-col gap-4">
      <div className="form-group">
        <label className="form-label">
          <h3 className="font-semibold text-primary">{t("form.innovationSupportLabel")}<span className="text-red-500">*</span></h3>
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
              {t(option.labelKey)}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <h3 className="font-semibold text-primary">{t("form.assistanceNeededLabel")}<span className="text-red-500">*</span></h3>
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
                {t(option.labelKey)}
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
                    placeholder={t("form.otherSupportPlaceholder")}
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