interface StudentStatsProps {
  total: number;
  withLocker: number;
  expiringSoon: number;
}

export default function StudentStats({ total, withLocker, expiringSoon }: StudentStatsProps) {
  const stats = [
    { icon: "👥", iconBg: "bg-blue-50 text-blue-500", value: total, label: "전체 학생 수" },
    { icon: "🔒", iconBg: "bg-green-50 text-green-600", value: withLocker, label: "사물함 보유" },
    { icon: "⚠", iconBg: "bg-red-50 text-red-500", value: expiringSoon, label: "만료 임박 (7일)" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3.5 max-[700px]:grid-cols-1">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-[18px] flex items-center gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          {/* 아이콘 */}
          <span className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${s.iconBg}`}>
            {s.icon}
          </span>

          {/* 텍스트 */}
          <div className="flex flex-col">
            <span className="text-[26px] font-black text-gray-900 tracking-tight">{s.value}</span>
            <span className="text-[11px] text-gray-400 font-medium">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
