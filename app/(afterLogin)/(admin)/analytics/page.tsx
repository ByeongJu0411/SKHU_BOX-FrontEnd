"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import type { LockerApiItem } from "../lockers/_component/type";
import type { ComplaintApiItem } from "../complaints/type";
import type { StudentApiItem } from "../students/type";
import KpiCards from "./_component/KpiCards";
import MonthlyTrend from "./_component/MonthlyTrend";
import BuildingComparison from "./_component/BuildingComparison";
import HourlyPattern from "./_component/HourlyPattern";
import ComplaintDistribution from "./_component/ComplaintDistribution";
import FloorHeatmap from "./_component/FloorHeatmap";

export default function AnalyticsPage() {
  const [lockers, setLockers] = useState<LockerApiItem[]>([]);
  const [students, setStudents] = useState<StudentApiItem[]>([]);
  const [complaints, setComplaints] = useState<ComplaintApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [lockersRes, studentsRes, complaintsRes] = await Promise.all([
          fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/lockers`),
          fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`),
          fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/complaints`),
        ]);
        const [lockersData, studentsData, complaintsData] = await Promise.all([
          lockersRes.json(),
          studentsRes.json(),
          complaintsRes.json(),
        ]);

        if (lockersData.success) setLockers(lockersData.data);
        if (studentsData.success) setStudents(studentsData.data);
        if (complaintsData.success) setComplaints(complaintsData.data);
      } catch {
        //
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const totalLockers = lockers.length;
  const occupiedCount = lockers.filter((l) => l.currentUser).length;
  const brokenCount = lockers.filter((l) => l.status === "BROKEN" || l.status === "DISABLED").length;
  const usageRate = totalLockers > 0 ? (occupiedCount / totalLockers) * 100 : 0;
  const brokenRate = totalLockers > 0 ? (brokenCount / totalLockers) * 100 : 0;

  const now = new Date();
  const newThisMonth = students.filter((s) => {
    const d = new Date(s.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">통계를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">데이터 / 통계</h1>
        <p className="text-[13px] text-gray-400">사물함 운영 데이터를 분석하고 인사이트를 확인할 수 있습니다.</p>
      </div>

      {/* KPI 카드 */}
      <KpiCards totalLockers={totalLockers} usageRate={usageRate} newThisMonth={newThisMonth} brokenRate={brokenRate} />

      {/* 라인 차트 + 막대 차트 */}
      <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <MonthlyTrend />
        <BuildingComparison lockers={lockers} />
      </div>

      {/* 시간대별 패턴 + 민원 분포 */}
      <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <HourlyPattern />
        <ComplaintDistribution complaints={complaints} />
      </div>

      {/* 히트맵 */}
      <FloorHeatmap lockers={lockers} />
    </div>
  );
}
