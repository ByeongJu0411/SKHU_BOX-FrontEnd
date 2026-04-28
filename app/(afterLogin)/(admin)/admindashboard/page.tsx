import AdminStatsCards from "./_component/AdminStatsCards/AdminStatsCard";
import TodayHistory from "./_component/TodayHistory/TodayHistory";
import BuildingUsage from "./_component/BuildingUsage/BuildingUsage";
import RecentActivity from "./_component/RecentActivity/RecentActivity";
import PendingComplaints from "./_component/PendingComplaints/PendingComplaints";
import OperationSummary from "./_component/OperationSummary/OperationSummary";
import QueueModeControl from "./_component/QueueModeControl";

export default function AdminDashboardPage() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-start justify-between max-md:flex-col max-md:gap-3">
        <div>
          <p className="text-[13px] text-gray-400 mb-0.5">관리자 대시보드</p>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">운영 현황</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] text-gray-400 bg-white px-4 py-2 rounded-[10px] border border-gray-100 whitespace-nowrap">
            {dateStr}
          </span>
          <button className="w-[34px] h-[34px] rounded-[10px] border border-gray-100 bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <svg
              className="w-[18px] h-[18px] text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* 대기열 모드 컨트롤 */}
      <QueueModeControl />

      <AdminStatsCards />

      <div className="grid grid-cols-2 gap-4 max-[1000px]:grid-cols-1">
        <TodayHistory />
        <BuildingUsage />
      </div>

      <div className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-1">
        <RecentActivity />
        <PendingComplaints />
        <OperationSummary />
      </div>
    </div>
  );
}
