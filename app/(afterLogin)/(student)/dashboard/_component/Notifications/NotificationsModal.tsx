"use client";

interface NoticeItem {
  title: string;
  content: string;
  date: string;
  author: string;
  badge: string;
  badgeColor: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const notices: NoticeItem[] = [
  {
    title: "1학기 사물함 신청이 시작되었습니다.",
    content:
      "2026년 1학기 사물함 신청이 시작되었습니다. 새천년관, 정보과학관 사물함을 신청할 수 있으며, 선착순으로 배정됩니다. 신청 기간은 3월 1일부터 3월 15일까지입니다.",
    date: "2026.03.01",
    author: "관리팀",
    badge: "공지",
    badgeColor: "bg-[#3182f6] text-white",
  },
  {
    title: "새천년관 2층 B구역 사물함 점검 안내 (3/28-29)",
    content:
      "새천년관 2층 B구역 사물함 점검이 예정되어 있습니다. 점검 기간 동안 해당 구역 사물함 이용이 제한될 수 있으니 양해 부탁드립니다. 점검 완료 후 정상 이용 가능합니다.",
    date: "2026.03.20",
    author: "학생팀",
    badge: "안내",
    badgeColor: "bg-[#ff9800] text-white",
  },
  {
    title: "수리요청 #0312 처리 완료되었습니다.",
    content:
      "접수하신 수리요청 #0312 건이 처리 완료되었습니다. 사물함 문 경첩 교체 작업이 완료되었으며, 정상적으로 이용 가능합니다. 불편을 드려 죄송합니다.",
    date: "2026.03.18",
    author: "관리팀",
    badge: "완료",
    badgeColor: "bg-brand text-white",
  },
  {
    title: "사물함 이용 규칙 변경 안내",
    content:
      "2026년부터 사물함 이용 규칙이 일부 변경됩니다. 사물함 내 음식물 보관이 금지되며, 이용 기간 만료 7일 전 알림이 전송됩니다. 자세한 내용은 이용약관을 확인해 주세요.",
    date: "2026.02.25",
    author: "관리팀",
    badge: "공지",
    badgeColor: "bg-[#3182f6] text-white",
  },
  {
    title: "정보과학관 1층 사물함 추가 설치 완료",
    content:
      "정보과학관 1층에 사물함 15칸이 추가 설치되었습니다. 지금 바로 신청 가능하며, 로비 구역에 위치해 있습니다.",
    date: "2026.02.15",
    author: "학생팀",
    badge: "안내",
    badgeColor: "bg-[#ff9800] text-white",
  },
];

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
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
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f2f4f6] shrink-0">
          <h2 className="text-[18px] font-black text-[#191f28]">알림 및 공지</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-none bg-[#f2f4f6] rounded-full cursor-pointer text-sm text-[#8b95a1] flex items-center justify-center hover:bg-[#e8ebed] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 공지 리스트 */}
        <div className="flex-1 overflow-y-auto">
          {notices.map((notice, i) => (
            <div
              key={i}
              className="px-6 py-5 border-b border-[#f2f4f6] last:border-b-0 hover:bg-[#f8f9fa] transition-colors"
            >
              {/* 배지 + 날짜 */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${notice.badgeColor}`}>
                  {notice.badge}
                </span>
                <span className="text-[12px] text-[#b0b8c1]">
                  {notice.date} · {notice.author}
                </span>
              </div>

              {/* 제목 */}
              <h3 className="text-[15px] font-bold text-[#191f28] mb-1.5">{notice.title}</h3>

              {/* 본문 */}
              <p className="text-[13px] text-[#6b7684] leading-relaxed">{notice.content}</p>
            </div>
          ))}
        </div>

        {/* 하단 */}
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
