interface ComplaintStatsProps {
  counts: Record<string, number>;
}

export default function ComplaintStats({ counts }: ComplaintStatsProps) {
  const stats = [
    { icon: "⚠", iconBg: "bg-red-50 text-red-500", value: counts["대기중"] || 0, label: "대기중" },
    { icon: "🔍", iconBg: "bg-yellow-50 text-yellow-600", value: counts["확인중"] || 0, label: "확인중" },
    { icon: "🔧", iconBg: "bg-orange-50 text-orange-500", value: counts["처리중"] || 0, label: "처리중" },
    { icon: "✓", iconBg: "bg-green-50 text-green-600", value: counts["완료"] || 0, label: "완료" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3.5 max-[900px]:grid-cols-2 max-[500px]:grid-cols-1">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl p-[18px] flex flex-col gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <span className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${s.iconBg}`}>
            {s.icon}
          </span>
          <span className="text-[26px] font-black text-gray-900 tracking-tight">{s.value}</span>
          <span className="text-[11px] text-gray-400 font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
