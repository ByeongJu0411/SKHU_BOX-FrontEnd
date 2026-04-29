"use client";

interface Notice {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: Notice[];
}

export default function NotificationsModal({ isOpen, onClose, notices }: NotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[560px] max-h-[80vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.15)] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f2f4f6] shrink-0">
          <h2 className="text-[18px] font-black text-[#191f28]">알림 및 공지</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-none bg-[#f2f4f6] rounded-full cursor-pointer text-sm text-[#8b95a1] flex items-center justify-center hover:bg-[#e8ebed] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notices.length === 0 ? (
            <p className="text-sm text-gray-400 px-6 py-5">공지사항이 없습니다.</p>
          ) : (
            notices.map((notice) => (
              <div
                key={notice.id}
                className="px-6 py-5 border-b border-[#f2f4f6] last:border-b-0 hover:bg-[#f8f9fa] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  {notice.pinned && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-brand text-white">공지</span>
                  )}
                  <span className="text-[12px] text-[#b0b8c1]">{notice.createdAt}</span>
                </div>
                <h3 className="text-[15px] font-bold text-[#191f28] mb-1.5">{notice.title}</h3>
                <p className="text-[13px] text-[#6b7684] leading-relaxed">{notice.content}</p>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#f2f4f6] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 border-none rounded-xl bg-[#f2f4f6] text-[14px] font-semibold text-[#4e5968] cursor-pointer font-sans hover:bg-[#e8ebed] transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
