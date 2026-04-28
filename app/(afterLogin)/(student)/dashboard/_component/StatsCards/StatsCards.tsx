const stats = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <rect x="3" y="3" width="14" height="14" rx="3" />
      </svg>
    ),
    color: "text-green-500",
    value: 48,
    label: "전체 잔여 사물함",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    color: "text-blue-500",
    value: 156,
    label: "전체 이용자 수",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    color: "text-red-500",
    value: 7,
    label: "내가 한 민원",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "text-lime-500",
    value: 97,
    label: "내 사물함 남은 기간",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-3.5 max-[900px]:grid-cols-2 max-[500px]:grid-cols-1">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-[18px] flex flex-col gap-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <span className={`w-[22px] h-[22px] [&>svg]:w-full [&>svg]:h-full ${s.color}`}>{s.icon}</span>
          <span className="text-2xl font-black text-gray-900 tracking-tight">{s.value}</span>
          <span className="text-[11px] text-gray-400 font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
