interface AveragesCardProps {
  avgTRL: string;
  pendingRatio: number;
  urgentRatio: number;
}

export function AveragesCard({ avgTRL, pendingRatio, urgentRatio }: AveragesCardProps) {
  return (
    <div className="bg-white p-5 border border-gray-100 rounded-lg">
      <h3 className="font-semibold mb-3 text-sm">ค่าเฉลี่ย</h3>
      <div className="space-y-2 text-sm">
        <p>
          ค่าเฉลี่ยระดับความพร้อมทางเทคโนโลยี (TRL Level):{" "}
          <span className="font-semibold text-blue-600">{avgTRL}</span>
        </p>
        <p>อัตราส่วนงานวิจัยที่กำลังประเมิน : {pendingRatio.toFixed(1)}%</p>
        <p>อัตราส่วนงานวิจัยที่เร่งด่วน : {urgentRatio.toFixed(1)}%</p>
      </div>
    </div>
  );
}