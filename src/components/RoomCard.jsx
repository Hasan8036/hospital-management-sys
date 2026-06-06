import { STATUS_CONFIG, TYPE_CONFIG, CHECKLIST_ITEMS } from '../data';
import styles from './RoomCard.module.css';

export default function RoomCard({ room, onClick }) {
  const status = STATUS_CONFIG[room.status];
  const typeConfig = TYPE_CONFIG[room.type];
  const done = Object.values(room.checklist).filter(Boolean).length;
  const total = CHECKLIST_ITEMS.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div
      className={`${styles.card} ${styles[room.status]}`}
      onClick={onClick}
      style={{ '--status-border': status.border, '--status-bg': status.bg }}
    >
      <div className={styles.header}>
        <div className={styles.roomId}>{room.id}</div>
        <div className={styles.statusDot} style={{ background: status.dot }} />
      </div>

      <div className={styles.typeBadge} style={{ background: typeConfig.bg, color: typeConfig.color }}>
        {room.type}
      </div>

      <div className={styles.statusLabel} style={{ color: status.color }}>
        {room.status === 'occupied' && room.patient
          ? room.patient
          : status.label}
      </div>

      {room.status === 'prep' && (
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.progressText}>{done}/{total}</span>
        </div>
      )}

      {room.status === 'occupied' && room.admitDate && (
        <div className={styles.admitDate}>Since {room.admitDate}</div>
      )}
    </div>
  );
}
