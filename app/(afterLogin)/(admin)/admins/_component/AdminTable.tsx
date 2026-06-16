import type { AdminItem } from "../type";

interface AdminTableProps {
  admins: AdminItem[];
}

export default function AdminTable({ admins }: AdminTableProps) {
  return (
    <div className="bg-white rounded-2xl overflow-x-auto shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-3.5 px-5 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">관리자</th>
            <th className="py-3.5 px-5 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">학번</th>
            <th className="py-3.5 px-5 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">학부</th>
            <th className="py-3.5 px-5 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">등록일</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-b border-gray-50 hover:bg-[#fafbfa] transition-colors">
              {/* 관리자 */}
              <td className="py-4 px-5 min-w-[180px]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1a1e23] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {admin.name.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-[13px] font-bold text-gray-900">{admin.name}</span>
                    <span className="block text-[11px] text-gray-300">{admin.email}</span>
                  </div>
                </div>
              </td>

              {/* 학번 */}
              <td className="py-4 px-5 text-[13px] font-medium text-gray-900 whitespace-nowrap">{admin.studentId}</td>

              {/* 학부 */}
              <td className="py-4 px-5 text-[13px] text-gray-500 whitespace-nowrap">{admin.dept}</td>

              {/* 등록일 */}
              <td className="py-4 px-5 text-[13px] text-gray-500 whitespace-nowrap">{admin.joinDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
