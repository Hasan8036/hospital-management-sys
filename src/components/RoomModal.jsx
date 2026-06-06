import { useState } from 'react';
import { STATUS_CONFIG, TYPE_CONFIG, CHECKLIST_ITEMS, PROCEDURES } from '../data';
import styles from './RoomModal.module.css';

function now() {
  const d = new Date();
  return {
    date: d.toISOString().slice(0, 10),
    time: d.toTimeString().slice(0, 5),
  };
}

export default function RoomModal({ room, role, onClose, onAdmit, onDischarge, onToggleCheck, onMarkReady }) {
  const n = now();
  const [view, setView] = useState('detail'); // 'detail' | 'admit' | 'discharge'

  // Admit form
  const [patientName, setPatientName] = useState('');
  const [mrNumber, setMrNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [admitDate, setAdmitDate] = useState(n.date);
  const [admitTime, setAdmitTime] = useState(n.time);

  // Discharge form
  const [dischargeDate, setDischargeDate] = useState(n.date);
  const [dischargeTime, setDischargeTime] = useState(n.time);
  const [procedure, setProcedure] = useState('');

  // History detail popup
  const [selectedHistory, setSelectedHistory] = useState(null);

  const status = STATUS_CONFIG[room.status];
  const typeConfig = TYPE_CONFIG[room.type];
  const done = Object.values(room.checklist).filter(Boolean).length;
  const total = CHECKLIST_ITEMS.length;
  const pct = Math.round((done / total) * 100);
  const allDone = done === total;

  function handleAdmit() {
    if (!patientName.trim()) return;
    onAdmit(room.id, {
      patient: patientName.trim(),
      mrNumber: mrNumber.trim(),
      contactNumber: contactNumber.trim(),
      admitDate,
      admitTime,
    });
    onClose();
  }

  function handleDischarge() {
    onDischarge(room.id, { dischargeDate, dischargeTime, procedure });
    onClose();
  }

  if (selectedHistory) {
    const h = selectedHistory;
    return (
      <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setSelectedHistory(null)}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <div className={styles.mhLeft}>
              <div className={styles.roomId}>{room.id}</div>
              <div className={styles.badges}>
                <span className={styles.typeBadge} style={{ background: typeConfig.bg, color: typeConfig.color }}>{room.type}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Patient record</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setSelectedHistory(null)}>✕</button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Patient name</span>
                <span className={styles.infoValue}>{h.patient}</span>
              </div>
              {h.mrNumber && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>MR Number</span>
                  <span className={styles.infoValue} style={{ fontFamily: 'DM Mono, monospace' }}>{h.mrNumber}</span>
                </div>
              )}
              {h.contactNumber && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Contact</span>
                  <span className={styles.infoValue}>{h.contactNumber}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Admitted</span>
                <span className={styles.infoValue}>{h.from}{h.admitTime ? ` · ${h.admitTime}` : ''}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Discharged</span>
                <span className={styles.infoValue}>{h.to}{h.dischargeTime ? ` · ${h.dischargeTime}` : ''}</span>
              </div>
              {h.days !== undefined && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Duration</span>
                  <span className={styles.infoValue}>{h.days} day{h.days !== 1 ? 's' : ''}</span>
                </div>
              )}
              {h.procedure && (
                <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                  <span className={styles.infoLabel}>Procedure</span>
                  <span className={styles.infoValue}>
                    <span className={styles.procedureBadge}>{h.procedure}</span>
                  </span>
                </div>
              )}
            </div>
            <div className={styles.actions}>
              <button className={styles.btnSecondary} onClick={() => setSelectedHistory(null)}>← Back to room</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader} style={{ borderColor: status.border }}>
          <div className={styles.mhLeft}>
            <div className={styles.roomId}>{room.id}</div>
            <div className={styles.badges}>
              <span className={styles.typeBadge} style={{ background: typeConfig.bg, color: typeConfig.color }}>{room.type}</span>
              <span className={styles.statusBadge} style={{ background: status.bg, color: status.color }}>
                <span className={styles.statusDot} style={{ background: status.dot }} />
                {status.label}
              </span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          {/* ADMIT FORM */}
          {view === 'admit' && (
            <div className={styles.admitForm}>
              <h4 className={styles.sectionTitle}>Admit Patient</h4>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Patient name *</label>
                  <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Full name" autoFocus />
                </div>
                <div className={styles.formField}>
                  <label>MR Number</label>
                  <input type="text" value={mrNumber} onChange={e => setMrNumber(e.target.value)} placeholder="e.g. MR-00123" />
                </div>
              </div>
              <div className={styles.formField}>
                <label>Contact number</label>
                <input type="tel" value={contactNumber} onChange={e => setContactNumber(e.target.value)} placeholder="e.g. 0300-1234567" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Admission date *</label>
                  <input type="date" value={admitDate} onChange={e => setAdmitDate(e.target.value)} />
                </div>
                <div className={styles.formField}>
                  <label>Admission time *</label>
                  <input type="time" value={admitTime} onChange={e => setAdmitTime(e.target.value)} />
                </div>
              </div>
              <div className={styles.formActions}>
                <button className={styles.btnPrimary} onClick={handleAdmit} disabled={!patientName.trim()}>
                  Confirm admission
                </button>
                <button className={styles.btnSecondary} onClick={() => setView('detail')}>Cancel</button>
              </div>
            </div>
          )}

          {/* DISCHARGE FORM */}
          {view === 'discharge' && (
            <div className={styles.admitForm}>
              <h4 className={styles.sectionTitle}>Discharge Patient</h4>
              <div className={styles.patientSummary}>
                <span className={styles.infoLabel}>Patient</span>
                <span className={styles.infoValue}>{room.patient}</span>
                {room.mrNumber && <><span className={styles.infoLabel}>MR#</span><span className={styles.infoValue}>{room.mrNumber}</span></>}
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Discharge date *</label>
                  <input type="date" value={dischargeDate} onChange={e => setDischargeDate(e.target.value)} />
                </div>
                <div className={styles.formField}>
                  <label>Discharge time *</label>
                  <input type="time" value={dischargeTime} onChange={e => setDischargeTime(e.target.value)} />
                </div>
              </div>
              <div className={styles.formField}>
                <label>Procedure (optional)</label>
                <div className={styles.procedureGrid}>
                  {PROCEDURES.map(p => (
                    <button
                      key={p}
                      type="button"
                      className={`${styles.procBtn} ${procedure === p ? styles.procBtnActive : ''}`}
                      onClick={() => setProcedure(prev => prev === p ? '' : p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {procedure && (
                  <div className={styles.selectedProc}>
                    Selected: <strong>{procedure}</strong>
                    <button onClick={() => setProcedure('')} className={styles.clearProc}>✕</button>
                  </div>
                )}
              </div>
              <div className={styles.formActions}>
                <button className={styles.btnDanger} onClick={handleDischarge}>
                  Confirm discharge
                </button>
                <button className={styles.btnSecondary} onClick={() => setView('detail')}>Cancel</button>
              </div>
            </div>
          )}

          {/* DETAIL VIEW */}
          {view === 'detail' && (
            <>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Floor</span>
                  <span className={styles.infoValue}>{room.floor}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ward</span>
                  <span className={styles.infoValue}>{room.ward}</span>
                </div>
                {room.patient && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Patient</span>
                    <span className={styles.infoValue}>{room.patient}</span>
                  </div>
                )}
                {room.mrNumber && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>MR Number</span>
                    <span className={styles.infoValue} style={{ fontFamily: 'DM Mono, monospace' }}>{room.mrNumber}</span>
                  </div>
                )}
                {room.contactNumber && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Contact</span>
                    <span className={styles.infoValue}>{room.contactNumber}</span>
                  </div>
                )}
                {room.admitDate && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Admitted</span>
                    <span className={styles.infoValue}>{room.admitDate}{room.admitTime ? ` · ${room.admitTime}` : ''}</span>
                  </div>
                )}
                {role === 'admin' && (
                  <>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Allocations (yr)</span>
                      <span className={styles.infoValue}>{room.allocations}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Vacant days (mo)</span>
                      <span className={styles.infoValue}>{room.vacantDays}d</span>
                    </div>
                  </>
                )}
              </div>

              {room.status === 'prep' && role === 'admin' && (
                <div className={styles.checklist}>
                  <div className={styles.checklistHeader}>
                    <h4 className={styles.sectionTitle}>Room readiness checklist</h4>
                    <span className={styles.checkCount} style={{ color: allDone ? 'var(--green)' : 'var(--amber)' }}>
                      {done}/{total}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${pct}%`, background: allDone ? 'var(--green)' : 'var(--amber)' }} />
                  </div>
                  <div className={styles.checkItems}>
                    {CHECKLIST_ITEMS.map(item => (
                      <label key={item.id} className={`${styles.checkItem} ${room.checklist[item.id] ? styles.checked : ''}`}>
                        <input type="checkbox" checked={room.checklist[item.id]} onChange={() => onToggleCheck(room.id, item.id)} />
                        <span className={styles.checkIcon}>{item.icon}</span>
                        <span className={styles.checkLabel}>{item.label}</span>
                        {room.checklist[item.id] && <span className={styles.checkMark}>✓</span>}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {room.history.length > 0 && (
                <div className={styles.history}>
                  <h4 className={styles.sectionTitle}>Patient history</h4>
                  <div className={styles.histList}>
                    {room.history.map((h, i) => (
                      <div key={i} className={styles.histItem} onClick={() => setSelectedHistory(h)}>
                        <div className={styles.histInfo}>
                          <div className={styles.histName}>{h.patient}</div>
                          {h.mrNumber && <div className={styles.histMr}>MR# {h.mrNumber}</div>}
                        </div>
                        <div className={styles.histMeta}>
                          <div className={styles.histDates}>{h.from} → {h.to}</div>
                          {h.procedure && <span className={styles.procedureBadge}>{h.procedure}</span>}
                        </div>
                        <span className={styles.histArrow}>›</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {role === 'admin' && (
                <div className={styles.actions}>
                  {room.status === 'occupied' && (
                    <button className={styles.btnDanger} onClick={() => setView('discharge')}>
                      Discharge patient
                    </button>
                  )}
                  {room.status === 'vacant' && (
                    <button className={styles.btnPrimary} onClick={() => setView('admit')}>
                      Admit patient
                    </button>
                  )}
                  {room.status === 'prep' && (
                    <button className={styles.btnSuccess} onClick={() => { onMarkReady(room.id); onClose(); }} disabled={!allDone} title={!allDone ? 'Complete all checklist items first' : ''}>
                      {allDone ? '✓ Mark as ready' : `Complete checklist (${done}/${total})`}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
