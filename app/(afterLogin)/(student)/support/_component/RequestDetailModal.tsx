import type { RequestItem, RequestStatus } from "../type";

interface RequestDetailModalProps {
  request: RequestItem;
  onClose: () => void;
  onCancel: (id: string) => void;
}

const progressSteps: { label: string; key: RequestStatus | "확인중" | "완료" }[] = [
  { label: "접수", key: "접수대기" },
  { label: "확인중", key: "확인중" },
  { label: "처리중", key: "처리중" },
  { label: "완료", key: "완료" },
];

const statusOrder: Record<RequestStatus, number> = {
  접수대기: 1,
  처리중: 3,
  처리완료: 4,
};

const statusAlert: Record<RequestStatus, { bg: string; dot: string; text: string; desc: string }> = {
  접수대기: {
    bg: "bg-red-50 border-red-100",
    dot: "bg-orange-400",
    text: "text-red-600",
    desc: "학생회에서 요청을 확인하면 처리가 시작됩니다.",
  },
  처리중: {
    bg: "bg-blue-50 border-blue-100",
    dot: "bg-blue-500",
    text: "text-blue-600",
    desc: "담당자가 요청을 처리하고 있습니다.",
  },
  처리완료: {
    bg: "bg-green-50 border-green-100",
    dot: "bg-brand",
    text: "text-brand",
    desc: "요청이 처리 완료되었습니다.",
  },
};

export default function RequestDetailModal({ request, onClose, onCancel }: RequestDetailModalProps) {
  const alert = statusAlert[request.status];
  const currentOrder = statusOrder[request.status];

  return (
    /* 오버레이 */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 모달 */}
      <div
        className="bg-white rounded-2xl w-full max-w-[520px] mx-4 shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-lg shrink-0">🔧</div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">{request.title}</h2>
              <p className="text-[12px] text-gray-400 mt-0.5">
                요청번호 #{request.id} · {request.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-gray-200 bg-white rounded-full cursor-pointer text-sm text-gray-400 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-5">
          {/* 상태 알림 박스 */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${alert.bg}`}>
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${alert.dot}`} />
            <div>
              <span className={`block text-[13px] font-bold ${alert.text}`}>
                {request.status === "접수대기" ? "접수 대기중" : request.status}
              </span>
              <span className="block text-[12px] text-gray-400">{alert.desc}</span>
            </div>
          </div>

          {/* 진행 단계 */}
          <div className="flex items-center justify-between px-2">
            {progressSteps.map((step, i) => {
              const stepOrder = i + 1;
              const isComplete = stepOrder < currentOrder;
              const isCurrent = stepOrder === currentOrder;

              return (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold
                      transition-all duration-300
                      ${
                        isComplete
                          ? "bg-brand text-white"
                          : isCurrent
                            ? "bg-brand text-white shadow-[0_0_0_3px_rgba(74,140,102,0.2)]"
                            : "bg-gray-100 text-gray-400"
                      }
                    `}
                    >
                      {isComplete ? (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        stepOrder
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        isComplete || isCurrent ? "text-gray-900" : "text-gray-300"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* 연결선 (마지막 제외) */}
                  {i < progressSteps.length - 1 && (
                    <div
                      className={`
                      w-12 h-0.5 mx-1 mt-[-16px]
                      ${stepOrder < currentOrder ? "bg-brand" : "bg-gray-200"}
                      transition-colors duration-300
                    `}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* 요청 정보 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 border border-gray-100 rounded-xl p-4">
            <div>
              <span className="block text-[11px] text-gray-400 mb-0.5">접수일</span>
              <span className="block text-[13px] font-semibold text-gray-900">{request.createdAt}</span>
            </div>
            <div>
              <span className="block text-[11px] text-gray-400 mb-0.5">사물함 번호</span>
              <span className="block text-[13px] font-semibold text-gray-900">{request.lockerId}</span>
            </div>
            <div>
              <span className="block text-[11px] text-gray-400 mb-0.5">위치</span>
              <span className="block text-[13px] font-semibold text-gray-900">
                {request.building} {request.location}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-gray-400 mb-0.5">상태</span>
              <span
                className={`block text-[13px] font-bold ${
                  request.status === "접수대기"
                    ? "text-red-500"
                    : request.status === "처리중"
                      ? "text-blue-500"
                      : "text-brand"
                }`}
              >
                {request.status === "접수대기" ? "접수 완료" : request.status}
              </span>
            </div>
          </div>

          {/* 요청 내용 */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[12px]">📋</span>
              <span className="text-[13px] font-bold text-gray-900">요청 내용</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[13px] text-gray-600 leading-relaxed">{request.content}</p>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex items-center justify-between pt-1">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-500 bg-white cursor-pointer font-sans hover:bg-gray-50 transition-colors">
              ✏️ 수정하기
            </button>
            <button
              onClick={() => onCancel(request.id)}
              className="flex items-center gap-1.5 px-4 py-2 border border-red-500 rounded-lg text-[13px] font-semibold text-red-500 bg-white cursor-pointer font-sans hover:bg-red-50 transition-colors"
            >
              🗑 요청 취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
