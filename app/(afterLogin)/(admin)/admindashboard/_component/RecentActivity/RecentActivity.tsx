const activities = [
  { color: "bg-brand", text: "이서현님 3A-12 자동 배정", time: "2분 전" },
  { color: "bg-brand", text: "송민지님 2B-11 반납 처리", time: "32분 전" },
  { color: "bg-orange-500", text: "이병주님 수리 요청 #0325 접수", time: "1시간 전" },
  { color: "bg-red-500", text: "M1B-06 고장 자동 전환", time: "3시간 전" },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">최근 활동</h3>
      <ul className="list-none m-0 p-0 flex flex-col">
        {activities.map((a, i) => (
          <li key={i} className="flex items-start gap-2.5 py-2.5 border-b border-gray-50 last:border-b-0">
            <span className={`w-2 h-2 rounded-full mt-[5px] shrink-0 ${a.color}`} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-gray-900">{a.text}</span>
              <span className="text-[11px] text-gray-300">{a.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
