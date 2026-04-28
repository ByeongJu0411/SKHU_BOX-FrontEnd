"use client";

import { useState } from "react";
import NotificationsModal from "./NotificationsModal";

const notices = [
  {
    text: "1학기 사물함 신청이 시작되었습니다.",
    date: "2026.03.01",
    author: "관리팀",
    badge: "공지",
    badgeColor: "bg-brand",
  },
  {
    text: "새천년관 2층 B구역 사물함 점검 안내 (3/28-29)",
    date: "2026.03.20",
    author: "학생팀",
    badge: "안내",
    badgeColor: "bg-orange-500",
  },
  {
    text: "수리요청 #0312 처리 완료되었습니다.",
    date: "2026.03.18",
    author: "관리팀",
    badge: "완료",
    badgeColor: "bg-blue-500",
  },
];

export default function Notifications() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-extrabold text-gray-900">알림 및 공지</h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-gray-400 bg-transparent border-none cursor-pointer font-sans hover:text-brand transition-colors"
          >
            전체보기
          </button>
        </div>
        <ul className="list-none m-0 p-0 flex flex-col">
          {notices.map((n, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2.5 py-2.5 border-b border-gray-50 last:border-b-0"
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className="w-2 h-2 bg-brand rounded-full mt-[5px] shrink-0" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[13px] font-semibold text-gray-900 truncate">{n.text}</span>
                  <span className="text-[11px] text-gray-300">
                    {n.date} · {n.author}
                  </span>
                </div>
              </div>
              <span
                className={`text-[11px] font-bold text-white px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${n.badgeColor}`}
              >
                {n.badge}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <NotificationsModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
