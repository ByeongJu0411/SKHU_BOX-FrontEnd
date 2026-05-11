"use client";

import { useState, useMemo, useEffect } from "react";
import { buildings, type LockerApiItem } from "../config";
import toast from "react-hot-toast";

type LockerStatus = "available" | "selected" | "occupied" | "broken" | "mine" | "empty";

const statusConfig: Record<LockerStatus, { bg: string }> = {
  available: { bg: "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer" },
  selected: { bg: "bg-yellow-100 text-yellow-800 ring-2 ring-yellow-400 cursor-pointer" },
  occupied: { bg: "bg-red-100 text-red-700" },
  broken: { bg: "bg-gray-100 text-gray-400" },
  mine: { bg: "bg-blue-100 text-blue-700" },
  empty: { bg: "bg-transparent" }, // 그리드에서 사물함이 없는 빈 칸
};

const legendItems = [
  { label: "사용 가능", dotColor: "bg-green-400" },
  { label: "선택됨", dotColor: "bg-yellow-400" },
  { label: "사용중", dotColor: "bg-red-400" },
  { label: "고장", dotColor: "bg-gray-300" },
  { label: "내 사물함", dotColor: "bg-blue-400" },
];

// 백엔드 status → 프론트 status 매핑
function mapApiStatus(apiStatus: string): LockerStatus {
  switch (apiStatus) {
    case "NORMAL":
      return "available";
    case "ACTIVE":
      return "occupied";
    case "IN_USE":
      return "occupied";
    case "RESERVED":
      return "occupied";
    case "BROKEN":
      return "broken";
    default:
      return "available";
  }
}

export default function LockerSelectPage() {
  const [allLockers, setAllLockers] = useState<LockerApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBuildingIdx, setSelectedBuildingIdx] = useState(0);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
  const [selectedZoneIdx, setSelectedZoneIdx] = useState(0);
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);

  const currentBuilding = buildings[selectedBuildingIdx];
  const currentFloor = currentBuilding.floors[selectedFloorIdx];
  const currentZone = currentFloor.zones[selectedZoneIdx];

  // API에서 전체 사물함 데이터 가져오기
  useEffect(() => {
    const fetchLockers = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((c) => c.startsWith("accessToken="))
          ?.split("=")[1];

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json();

        if (data.success) {
          setAllLockers(data.data);
        } else {
          setError(data.message || "사물함 정보를 불러올 수 없습니다.");
        }
      } catch {
        setError("서버 연결에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLockers();
  }, []);

  const handleReserve = async () => {
    if (!selectedLocker) return;

    // 선택한 사물함의 API id 찾기
    const locker = lockers.find((l) => l.id === selectedLocker);
    if (!locker || !locker.apiId) return;

    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("accessToken="))
      ?.split("=")[1];

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ lockerId: locker.apiId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`${selectedLocker} 사물함이 예약되었습니다`);
        setSelectedLocker(null);
        // 사물함 목록 새로고침
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const refreshData = await refreshRes.json();
        if (refreshData.success) setAllLockers(refreshData.data);
      } else {
        toast.error(data.message || "예약에 실패했습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    }
  };

  // 현재 구역에 해당하는 사물함 필터링 + 그리드 매핑
  const lockers = useMemo(() => {
    // API 데이터에서 현재 건물 + 층 + 구역에 해당하는 사물함 필터
    const zoneLockers = allLockers.filter(
      (l) =>
        l.building === currentBuilding.name && l.floor === currentFloor.number && l.locationDetail === currentZone.name,
    );

    // 그리드 크기만큼 배열 생성
    const gridSize = currentZone.rows * currentZone.cols;

    return Array.from({ length: gridSize }, (_, i) => {
      // i번째 칸에 매칭되는 사물함 찾기
      const apiLocker = zoneLockers[i];

      if (apiLocker) {
        return {
          id: apiLocker.lockerNumber,
          num: apiLocker.lockerNumber,
          apiId: apiLocker.id,
          status: mapApiStatus(apiLocker.status),
        };
      }

      // 사물함 데이터가 없는 빈 칸
      return {
        id: `empty-${i}`,
        num: "",
        apiId: null,
        status: "empty" as LockerStatus,
      };
    });
  }, [allLockers, currentBuilding.name, currentFloor.number, currentZone]);

  // 건물별 잔여석 (API 데이터 기반)
  const buildingAvailableCounts = useMemo(() => {
    return buildings.map((b) => {
      return allLockers.filter((l) => l.building === b.name && l.status === "NORMAL").length;
    });
  }, [allLockers]);

  // 층별 잔여석
  const floorAvailableCounts = useMemo(() => {
    return currentBuilding.floors.map((floor) => {
      return allLockers.filter(
        (l) => l.building === currentBuilding.name && l.floor === floor.number && l.status === "NORMAL",
      ).length;
    });
  }, [allLockers, currentBuilding]);

  const handleBuildingChange = (idx: number) => {
    setSelectedBuildingIdx(idx);
    setSelectedFloorIdx(0);
    setSelectedZoneIdx(0);
    setSelectedLocker(null);
  };

  const handleFloorChange = (idx: number) => {
    setSelectedFloorIdx(idx);
    setSelectedZoneIdx(0);
    setSelectedLocker(null);
  };

  const handleZoneChange = (idx: number) => {
    setSelectedZoneIdx(idx);
    setSelectedLocker(null);
  };

  const handleLockerClick = (id: string, status: LockerStatus) => {
    if (status === "available") {
      setSelectedLocker(selectedLocker === id ? null : id);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">사물함 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[40px]">⚠️</span>
          <span className="text-[14px] text-[#4e5968]">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-brand text-white text-[13px] font-bold rounded-lg cursor-pointer border-none hover:opacity-90"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">사물함 신청</h1>
        <p className="text-[13px] text-gray-400">원하는 층과 구역을 선택한 뒤, 사물함을 골라주세요</p>
      </div>

      <div className="flex gap-4 items-start max-[900px]:flex-col">
        {/* ===== 좌측: 건물 + 층 선택 ===== */}
        <div className="w-[260px] min-w-[260px] flex flex-col gap-2.5 max-[900px]:w-full max-[900px]:min-w-0">
          {/* 건물 선택 */}
          {buildings.map((b, idx) => {
            const isActive = selectedBuildingIdx === idx;
            return (
              <button
                key={b.id}
                onClick={() => handleBuildingChange(idx)}
                className={`
                  w-full flex items-center gap-3 p-4 rounded-xl
                  border-2 text-left cursor-pointer font-sans transition-all duration-200
                  ${
                    isActive
                      ? "bg-white border-brand shadow-[0_2px_12px_rgba(74,140,102,0.1)]"
                      : "bg-white border-transparent shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-gray-200"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-green-50" : "bg-gray-50"}`}
                >
                  <svg
                    className={`w-5 h-5 ${isActive ? "text-brand" : "text-gray-400"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path d="M9 22v-4h6v4" />
                    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className={`block text-sm font-extrabold ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                    {b.name}
                  </span>
                  <span className="block text-[11px] text-gray-400">
                    {b.floors.length}개 층 {b.floors.reduce((a, f) => a + f.zones.length, 0)}개 구역
                  </span>
                </div>
                <div className="text-right">
                  <span className={`block text-lg font-black ${isActive ? "text-brand" : "text-gray-400"}`}>
                    {buildingAvailableCounts[idx]}
                  </span>
                  <span className="block text-[10px] text-gray-300">잔여석</span>
                </div>
              </button>
            );
          })}

          {/* 층 리스트 */}
          <div className="border-t border-gray-100 pt-2.5 mt-1">
            {currentBuilding.floors.map((floor, idx) => {
              const isSelected = selectedFloorIdx === idx;
              return (
                <button
                  key={floor.number}
                  onClick={() => handleFloorChange(idx)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl mb-1
                    border-2 text-left cursor-pointer font-sans transition-all duration-200
                    ${isSelected ? "bg-white border-brand/50 shadow-sm" : "bg-white border-transparent hover:bg-gray-50"}
                  `}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-black ${isSelected ? "bg-brand text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    {floor.number}F
                  </div>
                  <div className="flex-1">
                    <span className={`block text-[13px] font-bold ${isSelected ? "text-gray-900" : "text-gray-500"}`}>
                      {floor.label}
                    </span>
                    <span className="block text-[11px] text-gray-300">
                      {floor.zones.map((z) => z.name).join(" / ")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`block text-sm font-black ${isSelected ? "text-brand" : "text-gray-400"}`}>
                      {floorAvailableCounts[idx]}
                    </span>
                    <span className="block text-[10px] text-gray-300">잔여석</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== 우측: 사물함 그리드 ===== */}
        <div className="flex-1 min-w-0 bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-extrabold text-gray-900 mb-3">사물함 선택</h2>

          {/* 구역 탭 */}
          <div className="flex gap-2 mb-3">
            {currentFloor.zones.map((zone, idx) => {
              const isActive = selectedZoneIdx === idx;
              const avail = allLockers.filter(
                (l) =>
                  l.building === currentBuilding.name &&
                  l.floor === currentFloor.number &&
                  l.locationDetail === zone.name &&
                  l.status === "NORMAL",
              ).length;

              return (
                <button
                  key={zone.name}
                  onClick={() => handleZoneChange(idx)}
                  className={`
                    flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg
                    text-[13px] font-semibold border cursor-pointer font-sans transition-colors duration-150
                    ${
                      isActive
                        ? "bg-brand text-white border-brand"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  {zone.name}
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25" : "bg-gray-100 text-gray-400"}`}
                  >
                    {avail}석
                  </span>
                </button>
              );
            })}
          </div>

          {/* 범례 */}
          <div className="flex gap-3.5 mb-3 flex-wrap">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <div className={`w-2.5 h-2.5 rounded-sm ${item.dotColor}`} />
                {item.label}
              </div>
            ))}
          </div>

          {/* 그리드 정보 */}
          <p className="text-[12px] text-gray-400 mb-2.5">
            {currentFloor.label} {currentZone.name} · 총 {lockers.filter((l) => l.status !== "empty").length}칸
          </p>

          {/* 사물함 그리드 — 고정 크기 셀, 넘치면 가로 스크롤 */}
          <div className="overflow-x-auto overflow-y-auto max-h-[450px] mb-4 justify-items-center align-items-center">
            <div className="grid gap-1 w-fit p-1" style={{ gridTemplateColumns: `repeat(${currentZone.cols}, 68px)` }}>
              {lockers.map((locker) => {
                if (locker.status === "empty") {
                  return <div key={locker.id} className="w-[68px] h-[68px]" />;
                }

                const isSelected = selectedLocker === locker.id;
                const displayStatus = isSelected ? "selected" : locker.status;
                const cfg = statusConfig[displayStatus];
                const isClickable = locker.status === "available" || isSelected;

                return (
                  <button
                    key={locker.id}
                    onClick={() => handleLockerClick(locker.id, locker.status)}
                    disabled={!isClickable}
                    className={`
                      w-[68px] h-[68px] rounded-md flex flex-col items-center justify-center
                      border-none font-sans transition-all duration-150
                      ${cfg.bg} ${!isClickable ? "cursor-not-allowed" : ""}
                    `}
                  >
                    <span className="text-[11px] font-bold leading-tight">{locker.num}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 하단 */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3.5 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] text-gray-400">선택한 사물함</span>
              {selectedLocker ? (
                <>
                  <span className="text-sm font-bold text-brand bg-green-50 px-3 py-1 rounded-lg">
                    {selectedLocker}
                  </span>
                  <span className="text-[12px] text-gray-400">
                    {currentBuilding.name} {currentFloor.label} {currentZone.name}
                  </span>
                </>
              ) : (
                <span className="text-[13px] text-gray-300">사물함을 선택해 주세요</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLocker(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-500 bg-white cursor-pointer font-sans hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReserve}
                disabled={!selectedLocker}
                className={`
                  px-5 py-2 border-none rounded-lg text-[13px] font-bold font-sans transition-all duration-200
                  ${
                    selectedLocker
                      ? "bg-brand text-white cursor-pointer hover:bg-brand-dark"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                신청하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
