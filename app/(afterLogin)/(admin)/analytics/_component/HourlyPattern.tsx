"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { hour: "08", 건수: 3 },
  { hour: "09", 건수: 12 },
  { hour: "10", 건수: 18 },
  { hour: "11", 건수: 15 },
  { hour: "12", 건수: 8 },
  { hour: "13", 건수: 14 },
  { hour: "14", 건수: 20 },
  { hour: "15", 건수: 16 },
  { hour: "16", 건수: 11 },
  { hour: "17", 건수: 7 },
  { hour: "18", 건수: 4 },
  { hour: "19", 건수: 2 },
];

const maxVal = Math.max(...data.map((d) => d.건수));

export default function HourlyPattern() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-[#191f28]">시간대별 신청</h3>
        <span className="text-[12px] text-[#b0b8c1]">이번 달</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 8, bottom: 0, left: -10 }} barSize={16}>
          <CartesianGrid stroke="#f2f4f6" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11, fill: "#b0b8c1" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}시`}
          />
          <YAxis tick={{ fontSize: 11, fill: "#b0b8c1" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              fontSize: 13,
              padding: "10px 14px",
            }}
            labelFormatter={(v) => `${v}시`}
            itemStyle={{ fontWeight: 700, color: "#191f28" }}
            labelStyle={{ color: "#8b95a1", marginBottom: 2, fontSize: 12 }}
          />
          <Bar dataKey="건수" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.건수 === maxVal ? "#3182f6" : "#e8ebed"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
