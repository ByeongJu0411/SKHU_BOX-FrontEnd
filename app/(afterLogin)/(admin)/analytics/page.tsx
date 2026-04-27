import KpiCards from "./_component/KpiCards";
import MonthlyTrend from "./_component/MonthlyTrend";
import BuildingComparison from "./_component/BuildingComparison";
import HourlyPattern from "./_component/HourlyPattern";
import ComplaintDistribution from "./_component/ComplaintDistribution";
import FloorHeatmap from "./_component/FloorHeatmap";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">데이터 / 통계</h1>
        <p className="text-[13px] text-gray-400">사물함 운영 데이터를 분석하고 인사이트를 확인할 수 있습니다.</p>
      </div>

      {/* KPI 카드 */}
      <KpiCards />

      {/* 라인 차트 + 막대 차트 */}
      <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <MonthlyTrend />
        <BuildingComparison />
      </div>

      {/* 시간대별 패턴 + 민원 분포 */}
      <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <HourlyPattern />
        <ComplaintDistribution />
      </div>

      {/* 히트맵 */}
      <FloorHeatmap />
    </div>
  );
}
