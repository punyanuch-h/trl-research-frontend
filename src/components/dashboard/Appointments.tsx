import { Calendar } from "lucide-react";

interface Appointment {
  id: string;
  case_title: string;
  date: string;
}

interface AppointmentsCardProps {
  success: number;
  fail: number;
  upcoming: Appointment[];
}

export function AppointmentsCard({ success, fail, upcoming }: AppointmentsCardProps) {
  return (
    <div className="bg-white p-5 border border-gray-100 rounded-lg">
      <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" /> การนัดหมาย
      </h3>
      <div className="text-sm mb-3">
        <p>
          ✅ เข้าร่วม:{" "}
          <span className="font-semibold text-green-600">{success}</span>
        </p>
        <p>
          ❌ ขาดนัด:{" "}
          <span className="font-semibold text-red-500">{fail}</span>
        </p>
        <p>
          📅 รอดำเนินการ:{" "}
          <span className="font-semibold text-blue-600">{upcoming.length}</span>
        </p>
      </div>

      {upcoming.length > 0 ? (
        <ul className="text-sm space-y-2">
          {upcoming.map((a) => (
            <li key={a.id}>
              <p className="font-medium">{a.case_title}</p>
              <p className="text-gray-500 text-xs">
                {new Date(a.date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">No upcoming appointments</p>
      )}
    </div>
  );
}