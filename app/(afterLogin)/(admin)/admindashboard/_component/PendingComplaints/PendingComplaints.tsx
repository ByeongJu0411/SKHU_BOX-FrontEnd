const complaints = [
  {
    icon: "🔧",
    title: "잠금장치 고장 · 이병주",
    location: "일만관 3A-05 · 1일 전",
    badge: "대기",
    badgeColor: "bg-orange-500",
  },
  {
    icon: "↔",
    title: "자리 이동 요청 · 김지은",
    location: "일만관 2B → 2A · 3일 전",
    badge: "대기",
    badgeColor: "bg-orange-500",
  },
  {
    icon: "🚪",
    title: "문 경첩 파손 · 정하늘",
    location: "미가엘관 M2A-11 · 5일 전",
    badge: "처리중",
    badgeColor: "bg-blue-500",
  },
];

export default function PendingComplaints() {
  return (
    <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-extrabold text-gray-900">미처리 민원</h3>
        <button className="text-xs text-gray-400 bg-transparent border-none cursor-pointer font-sans">
          전체보기 &gt;
        </button>
      </div>
      <ul className="list-none m-0 p-0 flex flex-col">
        {complaints.map((c, i) => (
          <li key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-b-0">
            <span className="text-base shrink-0">{c.icon}</span>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-gray-900">{c.title}</span>
              <span className="text-[11px] text-gray-300">{c.location}</span>
            </div>
            <span
              className={`text-[11px] font-bold text-white px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${c.badgeColor}`}
            >
              {c.badge}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
