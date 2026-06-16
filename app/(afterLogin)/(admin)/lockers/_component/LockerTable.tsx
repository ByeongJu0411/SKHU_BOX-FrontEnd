import type { LockerApiItem } from "./type";
import { getDisplayStatus, formatDate } from "./type";

interface LockerTableProps {
  lockers: LockerApiItem[];
  selectedId: number | null;
  checkedIds: Set<number>;
  onSelect: (id: number) => void;
  onCheck: (id: number) => void;
  onCheckAll: () => void;
}

const statusConfig = {
  available: { label: "가능", style: "bg-green-50 text-green-800" },
  inUse: { label: "사용중", style: "bg-red-50 text-red-800" },
  broken: { label: "고장", style: "bg-gray-100 text-gray-500" },
  disabled: { label: "비활성", style: "bg-orange-50 text-orange-700" },
} as const;

export default function LockerTable({
  lockers,
  selectedId,
  checkedIds,
  onSelect,
  onCheck,
  onCheckAll,
}: LockerTableProps) {
  const allChecked = lockers.length > 0 && checkedIds.size === lockers.length;

  return (
    <div className="bg-white rounded-t-2xl overflow-x-auto shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-11 text-center py-3.5 px-4">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={onCheckAll}
                className="w-4 h-4 accent-brand cursor-pointer"
              />
            </th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">번호</th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">위치</th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">사용자</th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">상태</th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">이용 기간</th>
          </tr>
        </thead>
        <tbody>
          {lockers.map((locker) => {
            const cfg = statusConfig[getDisplayStatus(locker)];
            const isSelected = selectedId === locker.lockerId;
            const user = locker.currentUser;

            return (
              <tr
                key={locker.lockerId}
                onClick={() => onSelect(locker.lockerId)}
                className={`
                  cursor-pointer transition-colors duration-100
                  border-b border-gray-50
                  ${isSelected ? "bg-[#f0f7f2]" : "hover:bg-[#fafbfa]"}
                `}
              >
                {/* 체크박스 */}
                <td className="w-11 text-center py-3.5 px-4">
                  <input
                    type="checkbox"
                    checked={checkedIds.has(locker.lockerId)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onCheck(locker.lockerId);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 accent-brand cursor-pointer"
                  />
                </td>

                {/* 번호 */}
                <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">{locker.lockerNumber}</td>

                {/* 위치 */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="block text-[13px] font-semibold text-gray-900">
                    {locker.building} {locker.floor}층
                  </span>
                  <span className="block text-[11px] text-gray-300">{locker.locationDetail}</span>
                </td>

                {/* 사용자 */}
                <td className="py-3.5 px-4 min-w-[140px]">
                  {user ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand shrink-0" />
                      <div>
                        <span className="block text-[13px] font-semibold text-gray-900">{user.name}</span>
                        <span className="block text-[11px] text-gray-300">
                          {user.department} · {user.studentNumber}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[13px] text-gray-300">미사용</span>
                  )}
                </td>

                {/* 상태 배지 */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap ${cfg.style}`}
                  >
                    {cfg.label}
                  </span>
                </td>

                {/* 이용 기간 */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {user ? (
                    <div>
                      <span className="block text-[13px] font-medium text-gray-900">
                        {formatDate(user.reservedAt)} ~ {formatDate(user.expiredAt)}
                      </span>
                      <span
                        className={`block text-[11px] ${user.daysLeft <= 7 ? "text-red-500 font-semibold" : "text-gray-300"}`}
                      >
                        D-{user.daysLeft}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[13px] text-gray-300">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
