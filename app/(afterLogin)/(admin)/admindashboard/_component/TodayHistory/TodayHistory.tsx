"use client";
import { useState } from "react";

type Tab = "전체" | "신청" | "반납" | "기타";
const items = [
  {
    type: "신청" as Tab,
    icon: "✓",
    iconColor: "text-brand",
    text: "이서현님 → 일만관 3A-12 자동 배정",
    dept: "1 · 소프트웨어공학과 · 20231045",
    time: "2분 전",
    badge: "자동",
    badgeColor: "text-brand",
  },
  {
    type: "신청" as Tab,
    icon: "✓",
    iconColor: "text-brand",
    text: "박준혁님 → 미가엘관 M2A-06 자동 배정",
    dept: "1 · 사회복지학과 · 20240312",
    time: "15분 전",
    badge: "자동",
    badgeColor: "text-brand",
  },
  {
    type: "반납" as Tab,
    icon: "↩",
    iconColor: "text-blue-500",
    text: "송민지님 → 일만관 2B-11 반납 처리",
    dept: "1 · 영어학과 · 20211567",
    time: "32분 전",
    badge: "수동",
    badgeColor: "text-orange-500",
  },
  {
    type: "신청" as Tab,
    icon: "✓",
    iconColor: "text-brand",
    text: "김지은님 → 일만관 2B-03 자동 배정",
    dept: "1 · IT융합자율학부 · 20220876",
    time: "1시간 전",
    badge: "자동",
    badgeColor: "text-brand",
  },
  {
    type: "기타" as Tab,
    icon: "⚠",
    iconColor: "text-orange-500",
    text: "새뮤엘관 S1A-03 이용기간 만료 자동 해제",
    dept: "",
    time: "2시간 전",
    badge: "자동",
    badgeColor: "text-brand",
  },
];
const tabs: { label: Tab; count: number }[] = [
  { label: "전체", count: 27 },
  { label: "신청", count: 18 },
  { label: "반납", count: 6 },
  { label: "기타", count: 3 },
];

export default function TodayHistory() {
  const [activeTab, setActiveTab] = useState<Tab>("전체");
  const filtered = activeTab === "전체" ? items : items.filter((it) => it.type === activeTab);

  return (
    <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[15px] font-extrabold text-gray-900">오늘의 처리 내역</h3>
        <button className="text-xs text-gray-400 bg-transparent border-none cursor-pointer font-sans">
          전체보기 &gt;
        </button>
      </div>
      <div className="flex gap-1.5 mb-4">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(t.label)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-none cursor-pointer font-sans transition-colors
              ${activeTab === t.label ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>
      <ul className="list-none m-0 p-0 flex flex-col">
        {filtered.map((it, i) => (
          <li key={i} className="flex items-start justify-between gap-3 py-3 border-b border-gray-50 last:border-b-0">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <span className={`text-sm mt-0.5 shrink-0 ${it.iconColor}`}>{it.icon}</span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[13px] font-semibold text-gray-900">{it.text}</span>
                {it.dept && <span className="text-[11px] text-gray-300">{it.dept}</span>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[11px] text-gray-300 whitespace-nowrap">{it.time}</span>
              <span className={`text-[11px] font-bold ${it.badgeColor}`}>{it.badge}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
