import styles from "./LockerGrid.module.css";

type LockerStatus = "available" | "occupied" | "mine" | "broken";

interface LockerGridProps {
  statuses: LockerStatus[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

const statusLabels: Record<LockerStatus, string> = {
  available: "가능",
  occupied: "사용중",
  mine: "내 사물함",
  broken: "가능",
};

export default function LockerGrid({ statuses, selectedIndex, onSelect }: LockerGridProps) {
  return (
    <>
      <div className={styles.grid}>
        {statuses.map((status, i) => (
          <button
            key={i}
            onClick={() => status === "available" && onSelect?.(i)}
            className={`${styles.cell} ${styles[status]} ${selectedIndex === i ? styles.selected : ""}`}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      <div className={styles.legend}>
        {(
          [
            { status: "available", label: "가능" },
            { status: "occupied", label: "사용중" },
            { status: "mine", label: "내 사물함" },
            { status: "broken", label: "가능" },
          ] as const
        ).map(({ status, label }) => (
          <div key={status} className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles[status]}`} />
            {label}
          </div>
        ))}
      </div>
    </>
  );
}
