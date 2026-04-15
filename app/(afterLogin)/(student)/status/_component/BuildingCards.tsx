import type { BuildingConfig } from "../../apply/config";

interface BuildingCardsProps {
  buildings: BuildingConfig[];
  stats: { total: number; available: number; occupied: number; broken: number; percent: number }[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

export default function BuildingCards({ buildings, stats, selectedIdx, onSelect }: BuildingCardsProps) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${buildings.length}, 1fr)` }}>
      {buildings.map((b, idx) => {
        const s = stats[idx];
        const isSelected = selectedIdx === idx;

        // SVG 원형 프로그레스 계산
        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (s.percent / 100) * circumference;

        // 퍼센트에 따른 색상
        const progressColor = s.percent >= 80 ? "#ef5350" : s.percent >= 60 ? "#ff9800" : "#4a8c66";

        return (
          <button
            key={b.id}
            onClick={() => onSelect(idx)}
            className={`
              flex items-center gap-4 p-4 rounded-2xl
              border-2 text-left cursor-pointer font-sans transition-all duration-200
              ${
                isSelected
                  ? "bg-white border-brand shadow-[0_2px_12px_rgba(74,140,102,0.1)]"
                  : "bg-white border-transparent shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-gray-200"
              }
            `}
          >
            {/* 원형 프로그레스 */}
            <div className="relative w-[64px] h-[64px] shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="5" />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  fill="none"
                  stroke={progressColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-gray-900">
                {s.percent}%
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <span className="block text-sm font-extrabold text-gray-900">{b.name}</span>
              <span className="block text-[11px] text-gray-400 mb-1.5">
                {b.floors.length}개 층 · {s.total}칸
              </span>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {s.available}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {s.occupied}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  {s.broken}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
