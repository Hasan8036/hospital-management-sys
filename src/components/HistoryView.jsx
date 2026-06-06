import { useState } from 'react';
import styles from './HistoryView.module.css';

export default function HistoryView({ rooms }) {
  const [search, setSearch] = useState('');
  const [filterRoom, setFilterRoom] = useState('all');
  const [filterProc, setFilterProc] = useState('all');
  const [selected, setSelected] = useState(null);

  const allHistory = rooms
    .flatMap(r => r.history.map(h => ({ ...h, roomId: r.id, roomType: r.type, ward: r.ward })))
    .sort((a, b) => b.from.localeCompare(a.from));

  const procedures = ['all', ...new Set(allHistory.map(h => h.procedure).filter(Boolean))];

  const filtered = allHistory.filter(h => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || h.patient.toLowerCase().includes(q)
      || (h.mrNumber || '').toLowerCase().includes(q)
      || (h.contactNumber || '').includes(q);
    const matchRoom = filterRoom === 'all' || h.roomId === filterRoom;
    const matchProc = filterProc === 'all' || h.procedure === filterProc;
    return matchSearch && matchRoom && matchProc;
  });

  const totalStays = allHistory.length;
  const avgDays = allHistory.length
    ? Math.round(allHistory.reduce((s, h) => s + (h.days || 0), 0) / allHistory.length)
    : 0;

  if (selected) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => setSelected(null)}>← Back to history</button>
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <div>
              <div className={styles.detailName}>{selected.patient}</div>
              {selected.mrNumber && <div className={styles.detailMr}>MR# {selected.mrNumber}</div>}
            </div>
            <div className={styles.roomTag}>{selected.roomId} · {selected.roomType}</div>
          </div>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Contact number</span>
              <span className={styles.detailValue}>{selected.contactNumber || '—'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Ward</span>
              <span className={styles.detailValue}>{selected.ward}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Date of admission</span>
              <span className={styles.detailValue}>{selected.from}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Time of admission</span>
              <span className={styles.detailValue}>{selected.admitTime || '—'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Date of discharge</span>
              <span className={styles.detailValue}>{selected.to}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Time of discharge</span>
              <span className={styles.detailValue}>{selected.dischargeTime || '—'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Duration</span>
              <span className={styles.detailValue}>{selected.days !== undefined ? `${selected.days} day${selected.days !== 1 ? 's' : ''}` : '—'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Procedure</span>
              <span className={styles.detailValue}>
                {selected.procedure
                  ? <span className={styles.procBadge}>{selected.procedure}</span>
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Patient History</h1>
          <p className={styles.subtitle}>{totalStays} total stays · click any row for full details</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statVal}>{totalStays}</span>
          <span className={styles.statLabel}>Total stays</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal}>{avgDays}d</span>
          <span className={styles.statLabel}>Avg. stay</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal}>{rooms.length}</span>
          <span className={styles.statLabel}>Rooms tracked</span>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, MR#, or contact..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.search}
        />
        <select value={filterRoom} onChange={e => setFilterRoom(e.target.value)}>
          <option value="all">All rooms</option>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.id} ({r.type})</option>)}
        </select>
        <select value={filterProc} onChange={e => setFilterProc(e.target.value)}>
          {procedures.map(p => <option key={p} value={p}>{p === 'all' ? 'All procedures' : p}</option>)}
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div>Room</div>
            <div>Patient</div>
            <div>MR#</div>
            <div>Admitted</div>
            <div>Discharged</div>
            <div>Procedure</div>
            <div>Days</div>
          </div>
          {filtered.map((h, i) => (
            <div key={i} className={styles.tableRow} onClick={() => setSelected(h)}>
              <div className={styles.roomCell}>{h.roomId}</div>
              <div className={styles.nameCell}>{h.patient}</div>
              <div className={styles.monoCell}>{h.mrNumber || '—'}</div>
              <div className={styles.dateCell}>
                <div>{h.from}</div>
                {h.admitTime && <div className={styles.timeLabel}>{h.admitTime}</div>}
              </div>
              <div className={styles.dateCell}>
                <div>{h.to}</div>
                {h.dischargeTime && <div className={styles.timeLabel}>{h.dischargeTime}</div>}
              </div>
              <div>{h.procedure ? <span className={styles.procBadge}>{h.procedure}</span> : <span className={styles.noneText}>—</span>}</div>
              <div className={styles.daysCell}>{h.days !== undefined ? `${h.days}d` : '—'}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          {search || filterRoom !== 'all' || filterProc !== 'all'
            ? 'No records match your search.'
            : 'No history recorded yet.'}
        </div>
      )}
    </div>
  );
}
