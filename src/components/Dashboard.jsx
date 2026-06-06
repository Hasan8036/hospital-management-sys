import { STATUS_CONFIG } from '../data';
import styles from './Dashboard.module.css';

export default function Dashboard({ rooms, user, onNavigate }) {
  const occupied = rooms.filter(r => r.status === 'occupied');
  const vacant = rooms.filter(r => r.status === 'vacant');
  const prep = rooms.filter(r => r.status === 'prep');
  const occupancyRate = Math.round((occupied.length / rooms.length) * 100);

  const privateRooms = rooms.filter(r => r.ward === 'Private');
  const cabins = rooms.filter(r => r.ward === 'Ward');

  const recentActivity = rooms
    .flatMap(r => r.history.map(h => ({ ...h, roomId: r.id, type: r.type })))
    .sort((a, b) => b.from.localeCompare(a.from))
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {user.role === 'reception' && (
          <div className={styles.readOnlyBadge}>👁 View only</div>
        )}
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total rooms</div>
          <div className={styles.statValue}>{rooms.length}</div>
          <div className={styles.statSub}>{privateRooms.length} private · {cabins.length} cabins</div>
        </div>
        <div className={`${styles.statCard} ${styles.statRed}`}>
          <div className={styles.statLabel}>Occupied</div>
          <div className={styles.statValue}>{occupied.length}</div>
          <div className={styles.statSub}>{occupancyRate}% occupancy rate</div>
        </div>
        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statLabel}>Ready / vacant</div>
          <div className={styles.statValue}>{vacant.length}</div>
          <div className={styles.statSub}>Available now</div>
        </div>
        <div className={`${styles.statCard} ${styles.statAmber}`}>
          <div className={styles.statLabel}>Preparing</div>
          <div className={styles.statValue}>{prep.length}</div>
          <div className={styles.statSub}>Checklist in progress</div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Room overview</h2>
            <button className={styles.viewAll} onClick={() => onNavigate('rooms')}>View all →</button>
          </div>
          <div className={styles.roomOverview}>
            {rooms.map(room => {
              const s = STATUS_CONFIG[room.status];
              return (
                <div
                  key={room.id}
                  className={styles.roomDot}
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                  title={`${room.id} — ${room.patient || s.label}`}
                >
                  <div className={styles.roomDotId}>{room.id}</div>
                  <div className={styles.roomDotStatus} style={{ background: s.dot }} />
                </div>
              );
            })}
          </div>
          <div className={styles.legend}>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <div key={key} className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: val.dot }} />
                <span>{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent activity</h2>
          </div>
          {recentActivity.length > 0 ? (
            <div className={styles.activityList}>
              {recentActivity.map((a, i) => (
                <div key={i} className={styles.activityItem}>
                  <div className={styles.activityRoom}>{a.roomId}</div>
                  <div className={styles.activityInfo}>
                    <div className={styles.activityName}>{a.patient}</div>
                    <div className={styles.activityDates}>{a.from} → {a.to}</div>
                  </div>
                  {a.days && <div className={styles.activityDays}>{a.days}d</div>}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>No recent activity</p>
          )}
        </div>
      </div>

      {prep.length > 0 && (
        <div className={styles.prepAlert}>
          <div className={styles.alertIcon}>⚠️</div>
          <div className={styles.alertText}>
            <strong>{prep.length} room{prep.length > 1 ? 's' : ''} pending preparation</strong>
            <span> — {prep.map(r => r.id).join(', ')}</span>
          </div>
          {user.role === 'admin' && (
            <button className={styles.alertBtn} onClick={() => onNavigate('rooms')}>
              Manage →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
