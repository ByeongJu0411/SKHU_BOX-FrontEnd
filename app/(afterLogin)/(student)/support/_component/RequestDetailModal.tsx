import type { RequestItem, RequestStatus } from "../type";

interface RequestDetailModalProps {
  request: RequestItem;
  onClose: () => void;
  onCancel?: (id: number) => void;
}

const progressSteps = [
  { label: "접수", order: 1 },
  { label: "확인중", order: 2 },
  { label: "처리중", order: 3 },
  { label: "완료", order: 4 },
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
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[520px] mx-4 shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">민원 #{request.id}</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">사물함: {request.lockerNumber || "-"}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-gray-200 bg-white rounded-full cursor-pointer text-sm text-gray-400 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-5">
          {/* 상태 알림 */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${alert.bg}`}>
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${alert.dot}`} />
            <div>
              <span className={`block text-[13px] font-bold ${alert.text}`}>{request.status}</span>
              <span className="block text-[12px] text-gray-400">{alert.desc}</span>
            </div>
          </div>

          {/* 진행 단계 */}
          <div className="flex items-center justify-between px-2">
            {progressSteps.map((step, i) => {
              const isComplete = step.order < currentOrder;
              const isCurrent = step.order === currentOrder;

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
                        step.order
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

                  {i < progressSteps.length - 1 && (
                    <div
                      className={`
                      w-12 h-0.5 mx-1 mt-[-16px]
                      ${step.order < currentOrder ? "bg-brand" : "bg-gray-200"}
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
              <span className="block text-[13px] font-semibold text-gray-900">{request.lockerNumber || "-"}</span>
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
                {request.status}
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

          {/* 답변 (있을 경우) */}
          {request.answer && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[12px]">💬</span>
                <span className="text-[13px] font-bold text-gray-900">관리자 답변</span>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-[13px] text-gray-600 leading-relaxed">{request.answer}</p>
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2 pt-1">
            {request.status === "접수대기" && onCancel && (
              <button
                onClick={() => onCancel(request.id)}
                className="px-4 py-2 border border-red-500 rounded-lg text-[13px] font-semibold text-red-500 bg-white cursor-pointer font-sans hover:bg-red-50 transition-colors"
              >
                접수 취소
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-500 bg-white cursor-pointer font-sans hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
