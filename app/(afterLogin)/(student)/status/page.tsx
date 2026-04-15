"use client";

import { useState, useMemo } from "react";
import { buildings } from "../apply/config";
import BuildingCards from "./_component/BuildingCards";
import FloorUsage from "./_component/FloorUsage";
import ZoneDetail from "./_component/ZoneDetail";

// Mock 상태 생성 (apply/select와 동일한 함수)
export function generateLockerStatus(buildingId: string, floorNum: number, zoneName: string, index: number) {
  const seed = buildingId.charCodeAt(0) * 10000 + floorNum * 1000 + zoneName.charCodeAt(0) * 10 + index;
  if (seed % 11 === 0) return "broken" as const;
  if (seed % 3 === 0) return "occupied" as const;
  if (buildingId === "saecheonnyeon" && floorNum === 4 && zoneName === "복도 좌측" && index === 5)
    return "mine" as const;
  return "available" as const;
}

export interface ZoneStats {
  buildingId: string;
  buildingName: string;
  floorNumber: number;
  floorLabel: string;
  zoneName: string;
  total: number;
  available: number;
  occupied: number;
  broken: number;
  mine: number;
  cols: number;
}

export default function StatusPage() {
  const [selectedBuildingIdx, setSelectedBuildingIdx] = useState(0);
  const [selectedZone, setSelectedZone] = useState<{ floorIdx: number; zoneIdx: number } | null>({
    floorIdx: 0,
    zoneIdx: 0,
  });

  const currentBuilding = buildings[selectedBuildingIdx];

  // 건물별 통계 계산
  const buildingStats = useMemo(() => {
    return buildings.map((b) => {
      let total = 0,
        available = 0,
        occupied = 0,
        broken = 0;
      b.floors.forEach((f) => {
        f.zones.forEach((z) => {
          const count = z.rows * z.cols;
          total += count;
          for (let i = 0; i < count; i++) {
            const s = generateLockerStatus(b.id, f.number, z.name, i);
            if (s === "available") available++;
            else if (s === "occupied" || s === "mine") occupied++;
            else if (s === "broken") broken++;
          }
        });
      });
      return { total, available, occupied, broken, percent: Math.round((occupied / total) * 100) };
    });
  }, []);

  // 현재 선택된 구역 상세 정보
  const selectedZoneStats: ZoneStats | null = useMemo(() => {
    if (!selectedZone) return null;
    const floor = currentBuilding.floors[selectedZone.floorIdx];
    if (!floor) return null;
    const zone = floor.zones[selectedZone.zoneIdx];
    if (!zone) return null;

    const total = zone.rows * zone.cols;
    let available = 0,
      occupied = 0,
      broken = 0,
      mine = 0;
    for (let i = 0; i < total; i++) {
      const s = generateLockerStatus(currentBuilding.id, floor.number, zone.name, i);
      if (s === "available") available++;
      else if (s === "occupied") occupied++;
      else if (s === "broken") broken++;
      else if (s === "mine") mine++;
    }

    return {
      buildingId: currentBuilding.id,
      buildingName: currentBuilding.name,
      floorNumber: floor.number,
      floorLabel: floor.label,
      zoneName: zone.name,
      total,
      available,
      occupied,
      broken,
      mine,
      cols: zone.cols,
    };
  }, [currentBuilding, selectedZone]);

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 기준`;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 헤더 */}
      <div className="flex items-start justify-between max-md:flex-col max-md:gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">이용 현황</h1>
          <p className="text-[13px] text-gray-400">건물별 사물함 사용 현황을 한눈에 확인할 수 있습니다.</p>
        </div>
      </div>

      {/* 건물 카드 */}
      <BuildingCards
        buildings={buildings}
        stats={buildingStats}
        selectedIdx={selectedBuildingIdx}
        onSelect={(idx) => {
          setSelectedBuildingIdx(idx);
          setSelectedZone({ floorIdx: 0, zoneIdx: 0 });
        }}
      />

      {/* 층별 현황 + 구역 상세 */}
      <div className="flex gap-4 items-start max-[900px]:flex-col">
        <FloorUsage
          building={currentBuilding}
          generateStatus={generateLockerStatus}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
        />

        {selectedZoneStats && <ZoneDetail zone={selectedZoneStats} generateStatus={generateLockerStatus} />}
      </div>
    </div>
  );
}
