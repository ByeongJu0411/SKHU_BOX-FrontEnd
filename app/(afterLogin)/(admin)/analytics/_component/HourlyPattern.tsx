export default function HourlyPattern() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-[#191f28]">시간대별 신청</h3>
        <span className="text-[12px] text-[#b0b8c1]">이번 달</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-1.5 h-[200px] text-center">
        <span className="text-[13px] text-gray-300">시간대별 신청 이력을 집계할 API가 아직 없습니다.</span>
      </div>
    </div>
  );
}
