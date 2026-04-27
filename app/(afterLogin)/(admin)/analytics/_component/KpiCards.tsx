const kpis = [
  {
    label: "전체 사물함",
    value: "180",
    change: "+12",
    positive: true,
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
  {
    label: "평균 사용률",
    value: "72%",
    change: "+5%p",
    positive: true,
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "이번 달 신규",
    value: "34",
    change: "+8",
    positive: true,
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    label: "평균 처리시간",
    value: "1.2일",
    change: "-0.3일",
    positive: true,
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "고장률",
    value: "4.4%",
    change: "-1.2%p",
    positive: false,
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-5 gap-3 max-[1100px]:grid-cols-3 max-[700px]:grid-cols-2">
      {kpis.map((k, i) => (
        <div key={i} className="bg-white rounded-2xl px-5 py-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">{k.icon}</span>
            <span className={`text-[12px] font-semibold ${k.positive ? "text-[#3182f6]" : "text-[#f04452]"}`}>
              {k.change}
            </span>
          </div>
          <span className="block text-[28px] font-black text-[#191f28] tracking-tight leading-none mb-1">
            {k.value}
          </span>
          <span className="block text-[13px] text-[#8b95a1]">{k.label}</span>
        </div>
      ))}
    </div>
  );
}
