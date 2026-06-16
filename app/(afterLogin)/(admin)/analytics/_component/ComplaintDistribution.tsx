"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ComplaintApiItem } from "../../complaints/type";

interface ComplaintDistributionProps {
  complaints: ComplaintApiItem[];
}

type Status = "확인중" | "처리중" | "완료";

function mapStatus(raw: string): Status {
  switch (raw) {
    case "IN_PROGRESS":
    case "처리중":
      return "처리중";
    case "RESOLVED":
    case "완료":
      return "완료";
    default:
      return "확인중";
  }
}

const STATUS_COLORS: Record<Status, string> = {
  확인중: "#ffd43b",
  처리중: "#3182f6",
  완료: "#69db7c",
};

export default function ComplaintDistribution({ complaints }: ComplaintDistributionProps) {
  const counts: Record<Status, number> = { 확인중: 0, 처리중: 0, 완료: 0 };
  complaints.forEach((c) => {
    counts[mapStatus(c.status)] += 1;
  });

  const data = (Object.keys(counts) as Status[])
    .map((name) => ({ name, value: counts[name], color: STATUS_COLORS[name] }))
    .filter((d) => d.value > 0);

  const total = complaints.length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h3 className="text-[16px] font-bold text-[#191f28] mb-5">민원 처리 상태 분포</h3>

      {total === 0 ? (
        <p className="text-[13px] text-gray-300 text-center py-12">민원 데이터가 없습니다.</p>
      ) : (
        <div className="flex items-center gap-8 max-[600px]:flex-col">
          {/* 도넛 */}
          <div className="relative w-[160px] h-[160px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    fontSize: 13,
                    padding: "10px 14px",
                  }}
                  itemStyle={{ fontWeight: 700, color: "#191f28" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[24px] font-black text-[#191f28] leading-none">{total}</span>
              <span className="text-[11px] text-[#b0b8c1] mt-0.5">전체</span>
            </div>
          </div>

          {/* 범례 */}
          <div className="flex flex-col gap-4 flex-1">
            {data.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-[4px] shrink-0" style={{ background: d.color }} />
                  <span className="text-[14px] text-[#4e5968]">{d.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-bold text-[#191f28]">{d.value}건</span>
                  <span className="text-[13px] text-[#b0b8c1] w-10 text-right">
                    {Math.round((d.value / total) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
