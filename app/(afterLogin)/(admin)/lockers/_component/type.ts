export interface LockerCurrentUser {
  userId: number;
  studentNumber: string;
  name: string;
  department: string;
  reservationId: number;
  reservedAt: string;
  expiredAt: string;
  daysLeft: number;
}

export type LockerStatus = "NORMAL" | "BROKEN" | "DISABLED";

export interface LockerApiItem {
  lockerId: number;
  lockerNumber: string;
  building: string;
  floor: number;
  locationDetail: string;
  status: LockerStatus;
  currentUser: LockerCurrentUser | null;
}

export type DisplayStatus = "available" | "inUse" | "broken" | "disabled";

export function getDisplayStatus(locker: LockerApiItem): DisplayStatus {
  if (locker.currentUser) return "inUse";
  if (locker.status === "BROKEN") return "broken";
  if (locker.status === "DISABLED") return "disabled";
  return "available";
}

export function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
