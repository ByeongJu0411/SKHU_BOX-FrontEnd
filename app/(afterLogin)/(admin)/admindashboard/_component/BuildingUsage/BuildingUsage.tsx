const buildings = [
  { name: "정보과학관", percent: 81, used: 42, total: 52, color: "bg-orange-500" },
  { name: "새천년관", percent: 50, used: 20, total: 40, color: "bg-brand" },
];

export default function BuildingUsage() {
  const totalUsed = buildings.reduce((s, b) => s + b.used, 0);
  const totalAll = buildings.reduce((s, b) => s + b.total, 0);
  const totalPercent = Math.round((totalUsed / totalAll) * 100);

  const rows = [
    ...buildings,
    { name: "전체", percent: totalPercent, used: totalUsed, total: totalAll, color: "bg-orange-500" },
  ];

  return (
    <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-extrabold text-gray-900">건물별 사용률</h3>
        <button className="text-xs text-gray-400 bg-transparent border-none cursor-pointer font-sans">상세 &gt;</button>
      </div>
      <div className="flex flex-col gap-4">
        {rows.map((b, i) => (
          <div
            key={b.name}
            className={`flex items-center gap-3 ${i === rows.length - 1 ? "pt-3.5 border-t border-gray-100" : ""}`}
          >
            <span className="text-[13px] font-bold text-gray-900 min-w-[56px]">{b.name}</span>
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-400 ${b.color}`}
                style={{ width: `${b.percent}%` }}
              />
            </div>
            <span className="text-[13px] font-bold text-gray-900 min-w-[36px] text-right">{b.percent}%</span>
            <span className="text-[11px] text-gray-400 min-w-[52px] text-right">
              {b.used}/{b.total}개
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
