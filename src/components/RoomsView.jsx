import { useState } from 'react';
import RoomCard from './RoomCard';
import RoomModal from './RoomModal';
import styles from './RoomsView.module.css';

export default function RoomsView({ rooms, role, onAdmit, onDischarge, onToggleCheck, onMarkReady }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const privateRooms = rooms.filter(r => r.ward === 'Private');
  const cabins = rooms.filter(r => r.ward === 'Ward');

  function applyFilter(list) {
    return list.filter(r => {
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchType = filterType === 'all' || r.type === filterType;
      return matchStatus && matchType;
    });
  }

  const filteredPrivate = applyFilter(privateRooms);
  const filteredCabins = applyFilter(cabins);

  const room = selectedRoom ? rooms.find(r => r.id === selectedRoom) : null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Rooms & Cabins</h1>
          <p className={styles.subtitle}>{rooms.length} total · click any room for details</p>
        </div>
        {role === 'admin' && (
          <button
            className={styles.admitBtn}
            onClick={() => {
              const vacant = rooms.find(r => r.status === 'vacant');
              if (vacant) setSelectedRoom(vacant.id);
            }}
          >
            + Admit patient
          </button>
        )}
        {role === 'reception' && (
          <div className={styles.readOnly}>👁 View only</div>
        )}
      </div>

      <div className={styles.filters}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="vacant">Ready</option>
          <option value="occupied">Occupied</option>
          <option value="prep">Preparing</option>
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All types</option>
          <option value="VIP">VIP</option>
          <option value="Semi-VIP">Semi-VIP</option>
          <option value="Standard">Standard</option>
          <option value="Cabin">Cabin</option>
        </select>
      </div>

      <div className={styles.sectionLabel}>Private rooms — Floor 2</div>
      {filteredPrivate.length > 0 ? (
        <div className={styles.grid}>
          {filteredPrivate.map(r => (
            <RoomCard key={r.id} room={r} onClick={() => setSelectedRoom(r.id)} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No rooms match the current filter.</div>
      )}

      <div className={styles.sectionLabel}>Ward cabins — Floor 1</div>
      {filteredCabins.length > 0 ? (
        <div className={styles.grid}>
          {filteredCabins.map(r => (
            <RoomCard key={r.id} room={r} onClick={() => setSelectedRoom(r.id)} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No cabins match the current filter.</div>
      )}

      {room && (
        <RoomModal
          room={room}
          role={role}
          onClose={() => setSelectedRoom(null)}
          onAdmit={onAdmit}
          onDischarge={onDischarge}
          onToggleCheck={onToggleCheck}
          onMarkReady={onMarkReady}
        />
      )}
    </div>
  );
}
