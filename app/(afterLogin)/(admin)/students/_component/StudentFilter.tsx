"use client";

type TabType = "전체" | "만료임박";

interface StudentFilterProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: Record<string, number>;
}

const selectArrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
} as const;

export default function StudentFilter({ activeTab, onTabChange, counts }: StudentFilterProps) {
  const tabs: { label: TabType }[] = [{ label: "전체" }, { label: "만료임박" }];

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        {/* 탭 */}
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
                ${isActive ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}
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

        {/* 학년 드롭다운 */}
        <select
          className="h-[34px] px-3 pr-8 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 bg-white appearance-none outline-none font-sans focus:border-brand transition-colors cursor-pointer ml-2"
          style={selectArrow}
        >
          <option>전체 학년</option>
          <option>1학년</option>
          <option>2학년</option>
          <option>3학년</option>
          <option>4학년</option>
        </select>

        {/* 검색 */}
        <div className="relative ml-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs">🔍</span>
          <input
            type="text"
            placeholder="이름, 학번, 이메일로 검색"
            className="h-[34px] w-[220px] pl-8 pr-3 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300 max-md:w-full"
          />
        </div>
      </div>
    </div>
  );
}
