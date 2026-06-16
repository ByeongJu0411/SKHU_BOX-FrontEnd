export interface StudentApiItem {
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

export function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
