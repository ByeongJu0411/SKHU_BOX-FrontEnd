interface PendingComplaintsProps {
  items: { id: number; lockerNumber: string; status: string; createdAt: string }[];
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function mapStatus(status: string): { label: string; color: string } {
  switch (status) {
    case "PENDING":
      return { label: "대기", color: "bg-orange-500" };
    case "IN_PROGRESS":
      return { label: "처리중", color: "bg-blue-500" };
    default:
      return { label: status, color: "bg-gray-400" };
  }
}

export default function PendingComplaints({ items }: PendingComplaintsProps) {
  return (
    <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">미처리 민원</h3>
      {items.length === 0 ? (
        <p className="text-[13px] text-gray-300 text-center py-6">미처리 민원이 없습니다.</p>
      ) : (
        <ul className="list-none m-0 p-0 flex flex-col">
          {items.map((c) => {
            const st = mapStatus(c.status);
            return (
              <li key={c.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-b-0">
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-[13px] font-semibold text-gray-900">민원 #{c.id}</span>
                  <span className="text-[11px] text-gray-300">
                    {c.lockerNumber} · {formatDate(c.createdAt)}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-bold text-white px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${st.color}`}
                >
                  {st.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
