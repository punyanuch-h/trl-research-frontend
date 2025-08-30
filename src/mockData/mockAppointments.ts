import type { Appointment } from '../types/trl';
import mockTRL from "./mockTRL";


const mockAppointments: Appointment[] = [
  {
    id: 1,
    research_id: "M0001",
    date: "2025-08-01T09:00:00.000Z",
    location: "ห้องประชุมคณะแพทยศาสตร์ มข.",
    attendees: [
        { email: "alice@professor.com", name: "Prof. Alice"},
        { email: "bob@hospital.com", name: "Dr. Bob" }
    ],
    status: "attended",
    summary: "สรุปการประชุมโดย Admin หรือ AI ถอดคำ",
    notes: "รีวิวต้นแบบ IoT และขอให้ทดสอบเพิ่มกับคนไข้จริง"
  },
  {
    id: 2,
    research_id: "M0001",
    date: "2025-08-31T14:00:00.000Z",
    location: "Zoom Online",
    attendees: [
        { email: "alice@professor.com", name: "Prof. Alice" },
        { email: "carol@investor.com", name: "Carol (VC)" }
    ],
    status: "attended",
    summary: "สรุปการประชุมโดย Admin หรือ AI ถอดคำ",
    notes: "เตรียม pitch ให้ VC ฟัง"
  },
  {
    id: 3,
    research_id: "S0001",
    date: "2025-06-18T10:00:00.000Z",
    location: "โรงพยาบาลศิริราช ห้องประชุมใหญ่",
    attendees: [
        { email: "alice@professor.com", name: "Prof. Alice" },
        { email: "david@hospital.com", name: "Dr. David" }
    ],
    status: "absent",
    notes: "ประชุมทดสอบระบบกับข้อมูลผู้ป่วยจริงบางส่วน"
  },
  {
    id: 4,
    research_id: "M0002",
    date: "2025-06-25T13:00:00.000Z",
    location: "ห้องประชุมใหญ่ กรมวิทยาศาสตร์การแพทย์",
    attendees: [
        { email: "alice@professor.com", name: "Prof. Alice" },
        { email: "erin@meddevice.com", name: "Erin (Med Device)" }
    ],
    status: "attended",
    summary: "สรุปการประชุมโดย Admin หรือ AI ถอดคำ",
    notes: "หารือความร่วมมือกับบริษัทเครื่องมือแพทย์"
  },
  {
    id: 5,
    research_id: "M0003",
    date: "2025-06-27T15:00:00.000Z",
    location: "Zoom Online",
    attendees: [
        { email: "alice@professor.com", name: "Prof. Alice" },
        { email: "frank@pharma.com", name: "Frank (Big Pharma)" }
    ],
    status: "attended",
    summary: "สรุปการประชุมโดย Admin หรือ AI ถอดคำ",
    notes: "นำเสนอระบบ AI ให้กับบริษัทยา"
  },
  {
    id: 6,
    research_id: "M0004",
    date: "2025-07-28T11:00:00.000Z",
    location: "ห้องประชุม สำนักงาน อย.",
    attendees: [
        { email: "alice@professor.com", name: "Prof. Alice" },
        { email: "george@fda.go.th", name: "Dr. George (อย.)" }
    ],
    status: "attended",
    summary: "สรุปการประชุมโดย Admin หรือ AI ถอดคำ",
    notes: "หารือขั้นตอนการยื่น IRB"
  },
  {
    id: 7,
    research_id: "M0005",
    date: "2025-08-29T09:30:00.000Z",
    location: "National Cancer Center Tokyo",
    attendees: [
        { email: "alice@professor.com", name: "Prof. Alice" },
        { email: "hiroshi@ncct.jp", name: "Dr. Hiroshi" }
    ],
    status: "pending",
    notes: "ติดตามผล preliminary clinical trial"
  },
  {
    id: 8,
    research_id: "M0006",
    date: "2025-10-29T09:30:00.000Z",
    location: "National Cancer Center Tokyo",
    attendees: [
        { email: "alice@professor.com", name: "Prof. Alice" },
        { email: "hiroshi@ncct.jp", name: "Dr. Hiroshi" }
    ],
    status: "pending",
    notes: "ติดตามผล preliminary clinical trial"
  },
  {
    id: 9,
    research_id: "S0001",
    date: "2025-10-20T10:00:00.000Z",
    location: "โรงพยาบาลศิริราช ห้องประชุมใหญ่",
    attendees: [
        { email: "alice@professor.com", name: "Prof. Alice" },
        { email: "david@hospital.com", name: "Dr. David" }
    ],
    status: "pending",
    notes: "ประชุมทดสอบระบบกับข้อมูลผู้ป่วยจริงบางส่วน"
  },
];

export default mockAppointments;