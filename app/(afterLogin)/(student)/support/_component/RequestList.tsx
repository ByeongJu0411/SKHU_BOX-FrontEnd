import type { RequestItem, RequestStatus } from "../type";

interface RequestListProps {
  requests: RequestItem[];
  onSelect: (id: string) => void;
}

const categoryIcons: Record<string, string> = {
  "수리 요청": "🔧",
  "자리 이동": "↔️",
  문의: "💬",
};

const statusStyle: Record<RequestStatus, string> = {
  접수대기: "text-red-500",
  처리중: "text-blue-500",
  처리완료: "text-brand",
};

export default function RequestList({ requests, onSelect }: RequestListProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex-1 min-w-0">
      <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">요청 내역</h3>

      {requests.length === 0 ? (
        <p className="text-[13px] text-gray-300 text-center py-10">접수된 요청이 없습니다.</p>
      ) : (
        <div className="flex flex-col">
          {requests.map((req) => (
            <button
              key={req.id}
              onClick={() => onSelect(req.id)}
              className="
                flex items-start gap-3.5 p-4 text-left
                border-b border-gray-50 last:border-b-0
                cursor-pointer font-sans bg-transparent
                hover:bg-gray-50 transition-colors rounded-lg
              "
            >
              {/* 카테고리 아이콘 */}
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-lg">
                {categoryIcons[req.category] || "📋"}
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[14px] font-bold text-gray-900">
                    {req.title}
                    <span className="text-gray-300 font-normal text-[12px] ml-1.5">#{req.id}</span>
                  </span>
                  <span className={`text-[12px] font-bold shrink-0 ${statusStyle[req.status]}`}>{req.status}</span>
                </div>
                <p className="text-[12px] text-gray-400 leading-relaxed mb-1.5 line-clamp-1">{req.description}</p>
                <span className="text-[11px] text-gray-300">
                  {req.createdAt} · 📍 {req.building} {req.location}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
