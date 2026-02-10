import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import type { CaseResponse, CoordinatorResponse, AppointmentResponse, IntellectualPropertyResponse, SupportmentResponse, AssessmentResponse } from '@/types/type';

const formatDate = (dateString: string | Date | undefined, withTime: boolean = false) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        const pattern = withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
        return format(date, pattern, { locale: th });
    } catch (e) {
        return '-';
    }
};

const fixThaiEndLine = (text: string | undefined | null) => {
    if (!text) return '-';
    return text.split('\n').join('<br/>');
};

interface PdfData {
    c: CaseResponse;
    coordinatorData?: CoordinatorResponse;
    appointments?: AppointmentResponse[];
    ipList?: IntellectualPropertyResponse[];
    supportmentData?: SupportmentResponse;
    assessmentData?: AssessmentResponse;
}

export const generateCaseReportHTML = (data: PdfData): string => {
    const { c, coordinatorData, appointments = [], ipList = [], supportmentData, assessmentData } = data;

    const html = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <style>
        @font-face {
            font-family: 'Sarabun';
            src: url('/assets/fonts/Sarabun-Regular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Sarabun';
            src: url('/assets/fonts/Sarabun-Bold.ttf') format('truetype');
            font-weight: bold;
            font-style: normal;
        }
        body {
            font-family: 'Sarabun', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 40px;
            background: #fff;
            word-wrap: break-word;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .report-title {
            font-size: 24px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 10px;
        }
        .header-info {
            font-size: 12px;
            color: #666;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .row {
            display: flex;
            margin-bottom: 8px;
        }
        .label {
            width: 30%;
            font-weight: bold;
        }
        .value {
            width: 70%;
        }
        .description-box {
            margin-top: 10px;
            text-align: justify;
            text-indent: 2em;
        }
        .entry-divider {
            margin: 15px 0;
            border-bottom: 1px solid #ccc;
        }
        .bullet-list {
            list-style-type: disc;
            margin-left: 40px;
        }
        @media print {
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="report-title">${c.title || 'N/A'}</div>
        <div class="header-info">
            <div>Case ID: ${c.id || '-'}</div>
            <div>Printed Date: ${formatDate(new Date(), true)}</div>
        </div>
    </div>

    <!-- 1. Project Information -->
    <div class="section">
        <div class="section-title">Project Information</div>
        <div class="row">
            <div class="label">Submission Date:</div>
            <div class="value">${formatDate(c.created_at)}</div>
        </div>
        <div class="row">
            <div class="label">Type of Innovation:</div>
            <div class="value">${c.type || '-'}</div>
        </div>
        <div class="row">
            <div class="label">TRL Level:</div>
            <div class="value">${c.trl_score ?? '-'}</div>
        </div>
        <div class="row">
            <div class="label">Keywords:</div>
            <div class="value">${fixThaiEndLine(c.keywords) || '-'}</div>
        </div>
        <div>
            <div class="label" style="width: 100%; margin-top: 10px;">Project Description:</div>
            <div class="description-box">
                ${fixThaiEndLine(c.description) || '-'}
            </div>
        </div>
    </div>

    <!-- 2. Personnel in Charge -->
    ${coordinatorData ? `
    <div class="section">
        <div class="section-title">Personnel in Charge</div>
        <div class="row">
            <div class="label">Coordinator:</div>
            <div class="value">${fixThaiEndLine(coordinatorData.first_name)} ${fixThaiEndLine(coordinatorData.last_name)}</div>
        </div>
        <div class="row">
            <div class="label">Contact:</div>
            <div class="value">${coordinatorData.email || '-'} / Tel: ${coordinatorData.phone_number || '-'}</div>
        </div>
    </div>
    ` : ''}

    <!-- 3. Activity & Follow-up Log -->
    ${appointments.length > 0 ? `
    <div class="section">
        <div class="section-title">Follow-up & Activity Log</div>
        ${appointments.map((a, i) => `
            <div class="row">
                <div class="label">Date & Time:</div>
                <div class="value">${formatDate(a.date, true)}</div>
            </div>
            <div class="row">
                <div class="label">Status:</div>
                <div class="value" style="font-weight: bold;">${a.status?.toUpperCase() || '-'}</div>
            </div>
            <div class="row">
                <div class="label">Location:</div>
                <div class="value">${fixThaiEndLine(a.location) || '-'}</div>
            </div>
            <div>
                <div class="label" style="width: 100%; margin-top: 5px;">Summary:</div>
                <div class="description-box" style="margin-top: 0;">${fixThaiEndLine(a.summary) || '-'}</div>
            </div>
            <div>
                <div class="label" style="width: 100%; margin-top: 5px;">Details:</div>
                <div class="description-box" style="margin-top: 0;">${fixThaiEndLine(a.detail) || '-'}</div>
            </div>
            ${i < appointments.length - 1 ? '<div class="entry-divider"></div>' : ''}
        `).join('')}
    </div>
    ` : ''}

    <!-- 4. Intellectual Property -->
    ${ipList.length > 0 ? `
    <div class="section">
        <div class="section-title">Intellectual Property Status</div>
        ${ipList.map((ip, i) => `
            <div class="row">
                <div class="label">IP Type:</div>
                <div class="value">${ip.types?.toUpperCase() || '-'}</div>
            </div>
            <div class="row">
                <div class="label">Reference Number:</div>
                <div class="value">${ip.request_number || '-'}</div>
            </div>
            <div class="row">
                <div class="label">Status:</div>
                <div class="value">${ip.protection_status || '-'}</div>
            </div>
            ${i < ipList.length - 1 ? '<div class="entry-divider"></div>' : ''}
        `).join('')}
    </div>
    ` : ''}

    <!-- 5. Supporter Information -->
    ${supportmentData ? `
    <div class="section">
        <div class="section-title">Supporter Information</div>
        <div style="font-weight: bold; margin-bottom: 5px;">Existing Support:</div>
        <div class="bullet-list">
            ${(supportmentData.support_research || supportmentData.support_vdc || supportmentData.support_sieic) ? `
                ${supportmentData.support_research ? '<div>• ฝ่ายวิจัย (Research Division)</div>' : ''}
                ${supportmentData.support_vdc ? '<div>• ศูนย์ขับเคลื่อนคุณค่าการบริการ (VDC)</div>' : ''}
                ${supportmentData.support_sieic ? '<div>• ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (SiEIC)</div>' : ''}
            ` : '<div>ไม่มีหน่วยงานสนับสนุนนวัตกรรม</div>'}
        </div>

        <div style="font-weight: bold; margin-top: 15px; margin-bottom: 5px;">Requirements & Assistance Needed:</div>
        <div class="bullet-list">
            ${(supportmentData.need_protect_intellectual_property || supportmentData.need_co_developers ||
                supportmentData.need_activities || supportmentData.need_test || supportmentData.need_capital ||
                supportmentData.need_partners || supportmentData.need_guidelines ||
                supportmentData.need_certification || supportmentData.need_account) ? `
                ${supportmentData.need_protect_intellectual_property ? '<div>• การคุ้มครองทรัพย์สินทางปัญญา</div>' : ''}
                ${supportmentData.need_co_developers ? '<div>• หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม</div>' : ''}
                ${supportmentData.need_activities ? '<div>• จัดกิจกรรมร่วม เช่น Design Thinking, Prototype Testing</div>' : ''}
                ${supportmentData.need_test ? '<div>• หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม</div>' : ''}
                ${supportmentData.need_capital ? '<div>• หาแหล่งทุน</div>' : ''}
                ${supportmentData.need_partners ? '<div>• หาคู่ค้าทางธุรกิจ</div>' : ''}
                ${supportmentData.need_guidelines ? '<div>• แนะนำแนวทางการเริ่มธุรกิจ</div>' : ''}
                ${supportmentData.need_certification ? '<div>• การขอรับรองมาตรฐานหรือคุณภาพ</div>' : ''}
                ${supportmentData.need_account ? '<div>• บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม</div>' : ''}
            ` : '<div>ไม่ต้องการความช่วยเหลือเพิ่มเติม</div>'}
        </div>

        ${supportmentData.need ? `
        <div style="font-weight: bold; margin-top: 15px; margin-bottom: 5px;">Additional Requirements:</div>
        <div class="description-box" style="margin-top: 0;">${fixThaiEndLine(supportmentData.need)}</div>
        ` : ''}
    </div>
    ` : ''}

    <!-- 6. Improvement Suggestions -->
    ${assessmentData ? `
    <div class="section">
        <div class="section-title">Improvement Suggestions</div>
        <div class="description-box" style="margin-top: 0;">
            ${assessmentData.improvement_suggestion ?
                fixThaiEndLine(assessmentData.improvement_suggestion) :
                "Excellent Progress: All evaluated Technology Readiness Level (TRL) criteria have been addressed. No further technical adjustments are recommended at this stage."}
        </div>
    </div>
    ` : ''}
</body>
</html>
  `;
    return html.trim();
};
