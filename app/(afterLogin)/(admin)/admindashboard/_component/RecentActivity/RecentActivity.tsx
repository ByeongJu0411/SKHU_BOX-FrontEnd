interface RecentActivityProps {
  items: { title: string; description: string; createdAt: string }[];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  return `${Math.floor(hr / 24)}일 전`;
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">최근 활동</h3>
      {items.length === 0 ? (
        <p className="text-[13px] text-gray-300 text-center py-6">최근 활동이 없습니다.</p>
      ) : (
        <ul className="list-none m-0 p-0 flex flex-col">
          {items.map((a, i) => (
            <li key={i} className="flex items-start gap-2.5 py-2.5 border-b border-gray-50 last:border-b-0">
              <span className="w-2 h-2 rounded-full mt-[5px] shrink-0 bg-brand" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-gray-900">{a.title}</span>
                <span className="text-[11px] text-gray-300">
                  {a.description} · {timeAgo(a.createdAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
