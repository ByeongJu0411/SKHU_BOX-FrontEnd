const stats = [
  { icon: "⚠", iconBg: "bg-red-50 text-red-500", value: "3", label: "대기중" },
  { icon: "🔧", iconBg: "bg-orange-50 text-orange-500", value: "2", label: "처리중" },
  { icon: "✓", iconBg: "bg-green-50 text-green-600", value: "24", label: "이번 달 완료" },
  { icon: "⏱", iconBg: "bg-blue-50 text-blue-500", value: "1.2일", label: "평균 처리 시간" },
];

export default function ComplaintStats() {
  return (
    <div className="grid grid-cols-4 gap-3.5 max-[900px]:grid-cols-2 max-[300px]:grid-cols-1">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-[18px] flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          {/* 아이콘 */}
          <span className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${s.iconBg}`}>
            {s.icon}
          </span>

          {/* 텍스트 영역 (세로) */}
          <div className="flex flex-col">
            <span className="text-[20px] font-black text-gray-900 tracking-tight">{s.value}</span>
            <span className="text-[11px] text-gray-400 font-medium">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
