import type { ZoneStats } from "../page";
import type { LockerApiItem } from "../../apply/config";

interface ZoneDetailProps {
  zone: ZoneStats;
  allLockers: LockerApiItem[];
}

function mapStatusLabel(apiStatus: string): { text: string; color: string; dotColor: string } {
  switch (apiStatus) {
    case "NORMAL":
      return { text: "가능", color: "text-green-600", dotColor: "bg-green-500" };
    case "ACTIVE":
    case "IN_USE":
    case "RESERVED":
      return { text: "사용중", color: "text-red-500", dotColor: "bg-red-500" };
    case "BROKEN":
      return { text: "고장", color: "text-gray-400", dotColor: "bg-gray-300" };
    default:
      return { text: "가능", color: "text-green-600", dotColor: "bg-green-500" };
  }
}

export default function ZoneDetail({ zone, allLockers }: ZoneDetailProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const occupiedPercent = zone.total > 0 ? (zone.occupied / zone.total) * 100 : 0;

  // 해당 구역의 사물함 목록
  const zoneLockers = allLockers.filter(
    (l) => l.building === zone.buildingName && l.floor === zone.floorNumber && l.locationDetail === zone.zoneName,
  );

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
        <div className="relative w-[80px] h-[80px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="7" />
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-green-500 shrink-0" />
            <span className="text-gray-500 flex-1">사용 가능</span>
            <span className="font-bold text-gray-900">{zone.available}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500 shrink-0" />
            <span className="text-gray-500 flex-1">사용중</span>
            <span className="font-bold text-gray-900">{zone.occupied}</span>
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
        <div className="flex flex-col max-h-[300px] overflow-y-auto">
          {zoneLockers.map((locker) => {
            const label = mapStatusLabel(locker.status);
            return (
              <div
                key={locker.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${label.dotColor}`} />
                  <span className="text-[13px] font-semibold text-gray-900">{locker.lockerNumber}</span>
                </div>
                <span className={`text-[11px] font-bold ${label.color}`}>{label.text}</span>
              </div>
            );
          })}
          {zoneLockers.length === 0 && (
            <p className="text-[13px] text-gray-300 text-center py-4">사물함 데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
