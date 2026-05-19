interface OperationSummaryProps {
  summary: {
    autoAssignedToday: number;
    brokenLockers: number;
    expiringSoon: number;
    newUsersThisWeek: number;
  };
}

export default function OperationSummary({ summary }: OperationSummaryProps) {
  const items = [
    { icon: "✓", iconColor: "text-brand", label: "오늘 자동 배정", value: summary.autoAssignedToday },
    { icon: "▲", iconColor: "text-orange-500", label: "고장 사물함", value: summary.brokenLockers },
    { icon: "◉", iconColor: "text-red-500", label: "만료 임박 (7일)", value: summary.expiringSoon },
    { icon: "■", iconColor: "text-blue-500", label: "이번 주 신규 가입", value: summary.newUsersThisWeek },
  ];

  return (
    <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">운영 요약</h3>
      <ul className="list-none m-0 p-0 flex flex-col">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-b-0">
            <span className={`text-sm shrink-0 w-5 text-center ${it.iconColor}`}>{it.icon}</span>
            <span className="text-[13px] text-gray-500 flex-1">{it.label}</span>
            <span className="text-lg font-extrabold text-gray-900">{it.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
