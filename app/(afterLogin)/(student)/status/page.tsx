"use client";

import { useState, useMemo, useEffect } from "react";
import { buildings } from "../apply/config";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import type { LockerApiItem } from "../apply/config";
import BuildingCards from "./_component/BuildingCards";
import FloorUsage from "./_component/FloorUsage";
import ZoneDetail from "./_component/ZoneDetail";

export interface ZoneStats {
  buildingName: string;
  floorNumber: number;
  floorLabel: string;
  zoneName: string;
  total: number;
  available: number;
  occupied: number;
  broken: number;
}

export default function StatusPage() {
  const [allLockers, setAllLockers] = useState<LockerApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBuildingIdx, setSelectedBuildingIdx] = useState(0);
  const [selectedZone, setSelectedZone] = useState<{ floorIdx: number; zoneIdx: number } | null>({
    floorIdx: 0,
    zoneIdx: 0,
  });

  const currentBuilding = buildings[selectedBuildingIdx];

  // API에서 사물함 데이터 조회
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers`);
        const data = await res.json();
        if (data.success) setAllLockers(data.data);
      } catch {
        // 에러 처리
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // 건물별 통계
  const buildingStats = useMemo(() => {
    return buildings.map((b) => {
      const bLockers = allLockers.filter((l) => l.building === b.name);
      const total = bLockers.length;
      const available = bLockers.filter((l) => l.status === "NORMAL").length;
      const occupied = bLockers.filter(
        (l) => l.status === "ACTIVE" || l.status === "IN_USE" || l.status === "RESERVED",
      ).length;
      const broken = bLockers.filter((l) => l.status === "BROKEN").length;
      const percent = total > 0 ? Math.round((occupied / total) * 100) : 0;
      return { total, available, occupied, broken, percent };
    });
  }, [allLockers]);

  // 선택된 구역 상세
  const selectedZoneStats: ZoneStats | null = useMemo(() => {
    if (!selectedZone) return null;
    const floor = currentBuilding.floors[selectedZone.floorIdx];
    if (!floor) return null;
    const zone = floor.zones[selectedZone.zoneIdx];
    if (!zone) return null;

    const zoneLockers = allLockers.filter(
      (l) => l.building === currentBuilding.name && l.floor === floor.number && l.locationDetail === zone.name,
    );

    const total = zoneLockers.length;
    const available = zoneLockers.filter((l) => l.status === "NORMAL").length;
    const occupied = zoneLockers.filter(
      (l) => l.status === "ACTIVE" || l.status === "IN_USE" || l.status === "RESERVED",
    ).length;
    const broken = zoneLockers.filter((l) => l.status === "BROKEN").length;

    return {
      buildingName: currentBuilding.name,
      floorNumber: floor.number,
      floorLabel: floor.label,
      zoneName: zone.name,
      total,
      available,
      occupied,
      broken,
    };
  }, [currentBuilding, selectedZone, allLockers]);

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 기준`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">사물함 현황을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-start justify-between max-md:flex-col max-md:gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">이용 현황</h1>
          <p className="text-[13px] text-gray-400">건물별 사물함 사용 현황을 한눈에 확인할 수 있습니다.</p>
        </div>
        <span className="text-[12px] text-gray-400 whitespace-nowrap">{dateStr}</span>
      </div>

      <BuildingCards
        buildings={buildings}
        stats={buildingStats}
        selectedIdx={selectedBuildingIdx}
        onSelect={(idx) => {
          setSelectedBuildingIdx(idx);
          setSelectedZone({ floorIdx: 0, zoneIdx: 0 });
        }}
      />

      <div className="flex gap-4 items-start max-[900px]:flex-col">
        <FloorUsage
          building={currentBuilding}
          allLockers={allLockers}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
        />

        {selectedZoneStats && <ZoneDetail zone={selectedZoneStats} allLockers={allLockers} />}
      </div>
    </div>
  );
}
