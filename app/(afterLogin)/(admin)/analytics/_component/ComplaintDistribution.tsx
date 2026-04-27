"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "수리 요청", value: 42, color: "#3182f6" },
  { name: "자리 이동", value: 25, color: "#69db7c" },
  { name: "문의", value: 18, color: "#ffd43b" },
  { name: "기타", value: 8, color: "#e8ebed" },
];

const total = data.reduce((s, d) => s + d.value, 0);

export default function ComplaintDistribution() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h3 className="text-[16px] font-bold text-[#191f28] mb-5">민원 유형 분포</h3>

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
    </div>
  );
}
