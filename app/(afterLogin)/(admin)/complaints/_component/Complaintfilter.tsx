"use client";

import type { ComplaintStatus } from "../type";

interface ComplaintFilterProps {
  activeTab: ComplaintStatus | "전체";
  onTabChange: (tab: ComplaintStatus | "전체") => void;
  counts: Record<string, number>;
}

const tabs: { label: ComplaintStatus | "전체"; colorClass: string }[] = [
  { label: "전체", colorClass: "bg-gray-900 text-white" },
  { label: "확인중", colorClass: "bg-yellow-500 text-white" },
  { label: "처리중", colorClass: "bg-blue-500 text-white" },
  { label: "완료", colorClass: "bg-green-600 text-white" },
];

export default function ComplaintFilter({ activeTab, onTabChange, counts }: ComplaintFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        const count = counts[tab.label] || 0;
        return (
          <button
            key={tab.label}
            onClick={() => onTabChange(tab.label)}
            className={`
              flex items-center gap-1.5 text-xs font-semibold
              px-3 py-1.5 rounded-lg border-none cursor-pointer font-sans transition-colors
              ${isActive ? tab.colorClass : "bg-gray-100 text-gray-400"}
            `}
          >
            {tab.label}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
              ${isActive ? "bg-white/25" : "bg-gray-200 text-gray-500"}`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
