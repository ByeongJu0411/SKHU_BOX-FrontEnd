"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import AdminStatsCards from "./_component/AdminStatsCards/AdminStatsCard";
import TodayHistory from "./_component/TodayHistory/TodayHistory";
import BuildingUsage from "./_component/BuildingUsage/BuildingUsage";
import RecentActivity from "./_component/RecentActivity/RecentActivity";
import PendingComplaints from "./_component/PendingComplaints/PendingComplaints";
import OperationSummary from "./_component/OperationSummary/OperationSummary";
import QueueModeControl from "./_component/QueueModeControl";

interface DashboardData {
  today: string;
  totalLockers: number;
  totalUsers: number;
  nearestExpiryDate: string;
  todayProcessedCount: number;
  unresolvedComplaintCount: number;
  totalUsageRate: number;
  todayProcessingHistory: { title: string; description: string; createdAt: string }[];
  buildingUsageRates: { building: string; totalLockers: number; activeLockers: number; usageRate: number }[];
  recentReservationActivities: { title: string; description: string; createdAt: string }[];
  unresolvedComplaints: { id: number; lockerNumber: string; status: string; createdAt: string }[];
  operationSummary: {
    autoAssignedToday: number;
    brokenLockers: number;
    expiringSoon: number;
    newUsersThisWeek: number;
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/admin`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {
        //
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">대시보드를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-[14px] text-[#8b95a1]">데이터를 불러올 수 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-start justify-between max-md:flex-col max-md:gap-3">
        <div>
          <p className="text-[13px] text-gray-400 mb-0.5">관리자 대시보드</p>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">운영 현황</h1>
        </div>
        <span className="text-[13px] text-gray-400 bg-white px-4 py-2 rounded-[10px] border border-gray-100 whitespace-nowrap">
          {data.today}
        </span>
      </div>

      <QueueModeControl />

      <AdminStatsCards
        totalLockers={data.totalLockers}
        totalUsers={data.totalUsers}
        todayProcessed={data.todayProcessedCount}
        unresolvedComplaints={data.unresolvedComplaintCount}
        totalUsageRate={data.totalUsageRate}
      />

      <div className="grid grid-cols-2 gap-4 max-[1000px]:grid-cols-1">
        <TodayHistory items={data.todayProcessingHistory} />
        <BuildingUsage buildings={data.buildingUsageRates} />
      </div>

      <div className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-1">
        <RecentActivity items={data.recentReservationActivities} />
        <PendingComplaints items={data.unresolvedComplaints} />
        <OperationSummary summary={data.operationSummary} />
      </div>
    </div>
  );
}
