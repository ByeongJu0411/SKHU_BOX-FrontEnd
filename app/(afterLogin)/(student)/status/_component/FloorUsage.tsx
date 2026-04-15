import type { BuildingConfig } from "../../apply/config";

interface FloorUsageProps {
  building: BuildingConfig;
  generateStatus: (buildingId: string, floorNum: number, zoneName: string, index: number) => string;
  selectedZone: { floorIdx: number; zoneIdx: number } | null;
  onSelectZone: (zone: { floorIdx: number; zoneIdx: number }) => void;
}

export default function FloorUsage({ building, generateStatus, selectedZone, onSelectZone }: FloorUsageProps) {
  return (
    <div className="flex-1 min-w-0 bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-extrabold text-gray-900">{building.name} · 층별 사용 현황</h2>
        {/* 그라데이션 범례 */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400">여유</span>
          <div className="w-16 h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" />
          <span className="text-[10px] text-gray-400">포화</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {building.floors.map((floor, floorIdx) => {
          // 층별 구역 통계 계산
          const zoneStats = floor.zones.map((zone, zoneIdx) => {
            const total = zone.rows * zone.cols;
            let available = 0,
              occupied = 0,
              broken = 0;
            for (let i = 0; i < total; i++) {
              const s = generateStatus(building.id, floor.number, zone.name, i);
              if (s === "available") available++;
              else if (s === "occupied" || s === "mine") occupied++;
              else if (s === "broken") broken++;
            }
            const percent = Math.round((occupied / total) * 100);
            return { zone, zoneIdx, total, available, occupied, broken, percent };
          });

          return (
            <div key={floor.number} className="flex gap-3 items-start">
              {/* 층 라벨 */}
              <div className="w-8 pt-3 shrink-0 text-right">
                <span className="text-[13px] font-bold text-gray-400">{floor.number}F</span>
              </div>

              {/* 구역 카드들 */}
              <div className="flex-1 flex gap-3 flex-wrap">
                {zoneStats.map((zs) => {
                  const isSelected = selectedZone?.floorIdx === floorIdx && selectedZone?.zoneIdx === zs.zoneIdx;

                  // 바 색상
                  const barColor =
                    zs.percent >= 80 ? "bg-red-400" : zs.percent >= 60 ? "bg-orange-400" : "bg-green-400";

                  return (
                    <button
                      key={zs.zone.name}
                      onClick={() => onSelectZone({ floorIdx, zoneIdx: zs.zoneIdx })}
                      className={`
                        flex-1 min-w-[200px] p-3.5 rounded-xl text-left
                        border-2 cursor-pointer font-sans transition-all duration-200
                        ${
                          isSelected
                            ? "border-brand bg-green-50/50 shadow-sm"
                            : "border-transparent bg-gray-50 hover:border-gray-200"
                        }
                      `}
                    >
                      {/* 구역 이름 + 퍼센트 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-bold text-gray-900">{zs.zone.name}</span>
                        <span
                          className={`text-[13px] font-bold ${
                            zs.percent >= 80 ? "text-red-500" : zs.percent >= 60 ? "text-orange-500" : "text-brand"
                          }`}
                        >
                          {zs.percent}%
                        </span>
                      </div>

                      {/* 프로그레스 바 */}
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${zs.percent}%` }}
                        />
                      </div>

                      {/* 하단 통계 */}
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {zs.available}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {zs.occupied}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />+{zs.broken}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
