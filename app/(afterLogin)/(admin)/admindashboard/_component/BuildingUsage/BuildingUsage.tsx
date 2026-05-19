interface BuildingUsageProps {
  buildings: { building: string; totalLockers: number; activeLockers: number; usageRate: number }[];
}

export default function BuildingUsage({ buildings }: BuildingUsageProps) {
  const totalUsed = buildings.reduce((s, b) => s + b.activeLockers, 0);
  const totalAll = buildings.reduce((s, b) => s + b.totalLockers, 0);
  const totalPercent = totalAll > 0 ? Math.round((totalUsed / totalAll) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-extrabold text-gray-900 mb-5">건물별 사용률</h3>
      {buildings.length === 0 ? (
        <p className="text-[13px] text-gray-300 text-center py-6">건물 데이터가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {buildings.map((b) => {
            const barColor = b.usageRate >= 80 ? "bg-red-400" : b.usageRate >= 60 ? "bg-orange-400" : "bg-brand";
            return (
              <div key={b.building} className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-gray-900 min-w-[56px]">{b.building}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${b.usageRate}%` }}
                  />
                </div>
                <span className="text-[13px] font-bold text-gray-900 min-w-[50px] text-right">
                  {b.usageRate.toFixed(2)}%
                </span>
                <span className="text-[11px] text-gray-400 min-w-[52px] text-right">
                  {b.activeLockers}/{b.totalLockers}
                </span>
              </div>
            );
          })}

          {/* 전체 합계 */}
          <div className="flex items-center gap-3 pt-3.5 border-t border-gray-100">
            <span className="text-[13px] font-bold text-gray-900 min-w-[56px]">전체</span>
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-orange-400"
                style={{ width: `${totalPercent}%` }}
              />
            </div>
            <span className="text-[13px] font-bold text-gray-900 min-w-[50px] text-right">
              {totalPercent.toFixed(2)}%
            </span>
            <span className="text-[11px] text-gray-400 min-w-[52px] text-right">
              {totalUsed}/{totalAll}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
