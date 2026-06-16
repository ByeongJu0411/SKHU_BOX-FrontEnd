export default function MonthlyTrend() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[16px] font-bold text-[#191f28]">월별 신청 · 반납 추이</h3>
        <span className="text-[12px] text-[#b0b8c1]">최근 6개월</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-1.5 h-[240px] text-center">
        <span className="text-[13px] text-gray-300">월별 추이를 집계할 이력 API가 아직 없습니다.</span>
      </div>
    </div>
  );
}
