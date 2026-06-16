import type { StudentApiItem } from "../type";

interface StudentStatsProps {
  students: StudentApiItem[];
}

export default function StudentStats({ students }: StudentStatsProps) {
  const total = students.length;
  const withLocker = students.filter((s) => s.activeReservation).length;
  const withoutLocker = total - withLocker;
  const adminCount = students.filter((s) => s.role === "ADMIN").length;

  const stats = [
    { value: total, label: "전체 학생", color: "text-gray-900" },
    { value: withLocker, label: "사물함 이용중", color: "text-brand" },
    { value: withoutLocker, label: "미이용", color: "text-gray-900" },
    { value: adminCount, label: "관리자", color: "text-blue-500" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3.5 max-[800px]:grid-cols-2 max-[500px]:grid-cols-1">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-[18px] flex flex-col gap-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <span className={`text-[26px] font-black tracking-tight ${s.color}`}>{s.value}</span>
          <span className="text-[11px] text-gray-400 font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
