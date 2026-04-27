"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "새천년관", 사용중: 62, 가능: 18, 고장: 8 },
  { name: "정보과학관", 사용중: 35, 가능: 12, 고장: 4 },
];

export default function BuildingComparison() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[16px] font-bold text-[#191f28]">건물별 사용 현황</h3>
      </div>
      <div className="flex items-center gap-5 mb-5">
        {[
          { label: "사용중", color: "bg-[#3182f6]" },
          { label: "가능", color: "bg-[#69db7c]" },
          { label: "고장", color: "bg-[#e8ebed]" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
            <span className="text-[12px] text-[#8b95a1]">{l.label}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 12, bottom: 5, left: -10 }} barSize={48} barGap={8}>
          <CartesianGrid stroke="#f2f4f6" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 13, fill: "#4e5968", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 12, fill: "#b0b8c1" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              fontSize: 13,
              padding: "12px 16px",
            }}
            itemStyle={{ fontWeight: 700, color: "#191f28" }}
            labelStyle={{ color: "#8b95a1", marginBottom: 4, fontSize: 12 }}
          />
          <Bar dataKey="사용중" stackId="a" fill="#3182f6" radius={[0, 0, 0, 0]} />
          <Bar dataKey="가능" stackId="a" fill="#69db7c" radius={[0, 0, 0, 0]} />
          <Bar dataKey="고장" stackId="a" fill="#e8ebed" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
