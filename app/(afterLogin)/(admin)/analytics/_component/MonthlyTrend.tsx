"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "10월", 신청: 28, 반납: 12 },
  { month: "11월", 신청: 35, 반납: 18 },
  { month: "12월", 신청: 22, 반납: 30 },
  { month: "1월", 신청: 15, 반납: 25 },
  { month: "2월", 신청: 42, 반납: 10 },
  { month: "3월", 신청: 34, 반납: 8 },
];

export default function MonthlyTrend() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[16px] font-bold text-[#191f28]">월별 신청 · 반납 추이</h3>
        <span className="text-[12px] text-[#b0b8c1]">최근 6개월</span>
      </div>
      <div className="flex items-center gap-5 mb-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3182f6]" />
          <span className="text-[12px] text-[#8b95a1]">신청</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#e8ebed]" />
          <span className="text-[12px] text-[#8b95a1]">반납</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 12, bottom: 5, left: -10 }}>
          <CartesianGrid stroke="#f2f4f6" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#b0b8c1" }} axisLine={false} tickLine={false} />
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
          <Line
            type="monotone"
            dataKey="신청"
            stroke="#3182f6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#3182f6", strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="반납"
            stroke="#e8ebed"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#8b95a1", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
