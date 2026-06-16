export interface AdminApiItem {
  userId: number;
  studentNumber: string;
  name: string;
  email: string;
  department: string;
  role: string;
  activeReservation: {
    reservationId: number;
    lockerId: number;
    lockerNumber: string;
    building: string;
    status: string;
    expiredAt: string;
  } | null;
  createdAt: string;
}

export interface AdminItem {
  id: string;
  name: string;
  studentId: string;
  dept: string;
  email: string;
  joinDate: string;
  isActive: boolean;
}

export function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function toAdminItem(api: AdminApiItem): AdminItem {
  return {
    id: String(api.userId),
    name: api.name,
    studentId: api.studentNumber,
    dept: api.department,
    email: api.email,
    joinDate: formatDate(api.createdAt),
    isActive: true,
  };
}
