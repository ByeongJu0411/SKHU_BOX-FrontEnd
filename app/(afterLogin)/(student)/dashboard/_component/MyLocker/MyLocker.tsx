interface MyLockerData {
  reserved: boolean;
  lockerNumber: string;
  location: string;
  lockerStatus: string;
  reservedAt: string;
  expiredAt: string;
  remainingDays: number;
  usageDays: number;
}

export default function MyLocker({ data }: { data: MyLockerData | null }) {
  if (!data || !data.reserved) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h3 className="text-[15px] font-extrabold text-gray-900 mb-3.5">내 사물함</h3>
        <p className="text-sm text-gray-400">현재 신청된 사물함이 없습니다.</p>
      </div>
    );
  }

  const cols = [
    { label: "건물", value: data.location, sub: data.lockerNumber },
    { label: "상태", value: data.lockerStatus, sub: "사용중", valueColor: "text-brand" },
    { label: "사용 기간", value: `${data.usageDays}일`, sub: `${data.reservedAt} ~ ${data.expiredAt}` },
    { label: "남은 기간", value: `${data.remainingDays}일`, sub: `D - ${data.remainingDays}` },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-extrabold text-gray-900 mb-3.5">내 사물함</h3>
      <div className="flex items-center gap-6 max-md:flex-col max-md:items-start">
        <div className="w-[90px] h-[90px] bg-green-50 rounded-[14px] flex flex-col items-center justify-center gap-1.5 shrink-0">
          {/* 아이콘 생략 */}
          <span className="text-base font-extrabold text-brand tracking-wider">{data.lockerNumber}</span>
        </div>
        <div className="flex items-center flex-1 max-md:flex-wrap max-md:gap-4">
          {cols.map((col, i) => (
            <div key={col.label} className="flex items-center flex-1">
              {i > 0 && <div className="w-px h-10 bg-gray-100 mr-5 max-md:hidden" />}
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-gray-400 font-medium">{col.label}</span>
                <span className={`text-base font-extrabold ${col.valueColor || "text-gray-900"}`}>{col.value}</span>
                <span className="text-[11px] text-gray-300">{col.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
