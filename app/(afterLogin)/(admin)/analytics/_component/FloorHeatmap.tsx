import { buildings } from "@/app/(afterLogin)/_component/config";

function getUsagePercent(buildingId: string, floorNum: number, zoneName: string): number {
  const seed = buildingId.charCodeAt(0) * 100 + floorNum * 10 + zoneName.charCodeAt(0);
  return 30 + (seed % 60);
}

function getHeatStyle(percent: number): string {
  if (percent >= 80) return "bg-[#ff6b6b]/20 text-[#e03131] border-[#ff6b6b]/30";
  if (percent >= 65) return "bg-[#ffd43b]/20 text-[#e67700] border-[#ffd43b]/30";
  if (percent >= 50) return "bg-[#69db7c]/20 text-[#2b8a3e] border-[#69db7c]/30";
  return "bg-[#e8ebed]/50 text-[#4e5968] border-[#e8ebed]";
}

export default function FloorHeatmap() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-[#191f28]">층 · 구역별 사용률</h3>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#b0b8c1]">여유</span>
          <div className="flex gap-[2px]">
            <div className="w-5 h-2.5 rounded-[3px] bg-[#e8ebed]" />
            <div className="w-5 h-2.5 rounded-[3px] bg-[#69db7c]/40" />
            <div className="w-5 h-2.5 rounded-[3px] bg-[#ffd43b]/40" />
            <div className="w-5 h-2.5 rounded-[3px] bg-[#ff6b6b]/40" />
          </div>
          <span className="text-[11px] text-[#b0b8c1]">포화</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {buildings.map((building) => (
          <div key={building.id}>
            <span className="block text-[14px] font-bold text-[#191f28] mb-3">{building.name}</span>
            <div className="flex flex-col gap-2">
              {building.floors.map((floor) => (
                <div key={floor.number} className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-[#b0b8c1] w-7 text-right shrink-0">{floor.number}F</span>
                  <div className="flex gap-2 flex-wrap flex-1">
                    {floor.zones.map((zone) => {
                      const percent = getUsagePercent(building.id, floor.number, zone.name);
                      const style = getHeatStyle(percent);
                      return (
                        <div
                          key={zone.name}
                          className={`
                            px-4 py-2.5 rounded-xl border min-w-[110px]
                            transition-all duration-200
                            ${style}
                          `}
                        >
                          <span className="block text-[15px] font-black">{percent}%</span>
                          <span className="block text-[11px] opacity-70 mt-0.5">{zone.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
