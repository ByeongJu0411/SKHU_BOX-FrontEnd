import type { ZoneStats } from "../page";
import { generateLockerStatus } from "../page";

interface ZoneDetailProps {
  zone: ZoneStats;
  generateStatus: typeof generateLockerStatus;
}

const statusLabel: Record<string, { text: string; color: string; dotColor: string }> = {
  available: { text: "가능", color: "text-green-600", dotColor: "bg-green-500" },
  occupied: { text: "사용중", color: "text-red-500", dotColor: "bg-red-500" },
  broken: { text: "고장", color: "text-gray-400", dotColor: "bg-gray-300" },
  mine: { text: "내 사물함", color: "text-blue-500", dotColor: "bg-blue-500" },
};

export default function ZoneDetail({ zone }: ZoneDetailProps) {
  // 도넛 차트 계산
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const occupiedPercent = ((zone.occupied + zone.mine) / zone.total) * 100;

  // 사물함 개별 목록 생성
  const lockers = Array.from({ length: zone.total }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    const id = `${zone.floorNumber}${zone.zoneName.charAt(0)}-${num}`;
    const status = generateLockerStatus(zone.buildingId, zone.floorNumber, zone.zoneName, i);
    return { id, status };
  });

  return (
    <div
      className="
      w-[280px] min-w-[280px] bg-white rounded-xl p-5
      shadow-[0_1px_4px_rgba(0,0,0,0.04)]
      flex flex-col gap-4
      sticky top-6
      max-[900px]:static max-[900px]:w-full max-[900px]:min-w-0
    "
    >
      {/* 헤더 */}
      <div>
        <h3 className="text-[15px] font-extrabold text-gray-900">
          {zone.floorLabel} {zone.zoneName} 상세
        </h3>
        <p className="text-[11px] text-gray-400">
          {zone.buildingName} · 총 {zone.total}칸
        </p>
      </div>

      {/* 도넛 차트 + 통계 */}
      <div className="flex items-center gap-5">
        {/* 도넛 */}
        <div className="relative w-[80px] h-[80px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="7" />
            {/* 사용중 (빨강) */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="#ef5350"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (occupiedPercent / 100) * circumference}
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-gray-900">
            {zone.total}
          </span>
        </div>

        {/* 통계 리스트 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-green-500 shrink-0" />
            <span className="text-gray-500 flex-1">사용 가능</span>
            <span className="font-bold text-gray-900">{zone.available}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500 shrink-0" />
            <span className="text-gray-500 flex-1">사용중</span>
            <span className="font-bold text-gray-900">{zone.occupied + zone.mine}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-300 shrink-0" />
            <span className="text-gray-500 flex-1">고장</span>
            <span className="font-bold text-gray-900">{zone.broken}</span>
          </div>
        </div>
      </div>

      {/* 사물함 목록 */}
      <div>
        <h4 className="text-[13px] font-bold text-gray-900 mb-2">사물함 목록</h4>
        <div className="flex flex-col max-h-[270px] overflow-y-auto">
          {lockers.map((locker) => {
            const cfg = statusLabel[locker.status] || statusLabel.available;
            return (
              <div
                key={locker.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dotColor}`} />
                  <span className="text-[13px] font-semibold text-gray-900">{locker.id}</span>
                </div>
                <span className={`text-[11px] font-bold ${cfg.color}`}>{cfg.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
