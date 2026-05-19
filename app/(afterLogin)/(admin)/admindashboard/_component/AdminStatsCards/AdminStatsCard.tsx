interface AdminStatsCardsProps {
  totalLockers: number;
  totalUsers: number;
  todayProcessed: number;
  unresolvedComplaints: number;
  totalUsageRate: number;
}

export default function AdminStatsCards({
  totalLockers,
  totalUsers,
  todayProcessed,
  unresolvedComplaints,
  totalUsageRate,
}: AdminStatsCardsProps) {
  const stats = [
    {
      icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      ),
      color: "text-brand",
      value: totalLockers,
      label: "전체 사물함",
    },
    {
      icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
      color: "text-blue-500",
      value: totalUsers,
      label: "전체 이용자",
    },
    {
      icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      color: "text-orange-500",
      value: todayProcessed,
      label: "오늘 처리 건",
    },
    {
      icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      color: "text-red-500",
      value: unresolvedComplaints,
      label: "미처리 민원",
    },
    {
      icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      color: "text-blue-500",
      value: `${totalUsageRate.toFixed(3)}%`,
      label: "전체 사용률",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-3.5 max-[1000px]:grid-cols-3 max-[600px]:grid-cols-2">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-[18px] flex flex-col gap-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <span className={`w-[22px] h-[22px] [&>svg]:w-full [&>svg]:h-full ${s.color}`}>{s.icon}</span>
          <span className="text-[26px] font-black text-gray-900 tracking-tight">{s.value}</span>
          <span className="text-[11px] text-gray-400 font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
