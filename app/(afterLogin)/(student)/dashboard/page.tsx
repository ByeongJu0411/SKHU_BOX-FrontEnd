import MyLocker from "./_component/MyLocker/MyLocker";
import StatsCards from "./_component/StatsCards/StatsCards";
import QuickLinks from "./_component/QuickLinks/QuickLinks";
import Notifications from "./_component/Notifications/Notifications";
import { cookies } from "next/headers";

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (!data.success) return null;
  return data.data;
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* 헤더 */}
      <div className="flex items-start justify-between max-md:flex-col max-md:gap-3">
        <div>
          <p className="text-[13px] text-gray-400 mb-0.5">안녕하세요, 사용자님</p>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">대시보드</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] text-gray-400 bg-white px-4 py-2 rounded-[10px] border border-gray-100 whitespace-nowrap">
            {data?.today ?? "-"}
          </span>
          <button className="w-[34px] h-[34px] rounded-[10px] border border-gray-100 bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <svg
              className="w-[18px] h-[18px] text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
        </div>
      </div>

      <MyLocker data={data?.myLocker ?? null} />
      <StatsCards
        totalAvailableLockers={data?.totalAvailableLockers ?? 0}
        totalUsers={data?.totalUsers ?? 0}
        myComplaints={data?.myComplaints?.length ?? 0}
        remainingDays={data?.myLocker?.remainingDays ?? 0}
      />

      {/* 하단 2열 */}
      <div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
        <QuickLinks />
        <Notifications notices={data?.notices ?? []} />
      </div>
    </div>
  );
}
