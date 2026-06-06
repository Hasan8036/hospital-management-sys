import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import styles from './Analytics.module.css';

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function buildMonthlyData(rooms, year) {
  const map = {};
  MONTH_SHORT.forEach((m, i) => { map[i] = { month: m, admissions: 0, totalDays: 0 }; });

  rooms.forEach(r => {
    (r.history || []).forEach(h => {
      if (!h.from) return;
      const d = new Date(h.from);
      if (d.getFullYear() !== year) return;
      const mo = d.getMonth();
      map[mo].admissions += 1;
      map[mo].totalDays += (h.days || 0);
    });
  });

  const result = Object.values(map);
  const hasAny = result.some(m => m.admissions > 0);
  return hasAny ? result : [];
}

function buildRoomStats(rooms, year, month) {
  return rooms.map(r => {
    const entries = (r.history || []).filter(h => {
      if (!h.from) return false;
      const d = new Date(h.from);
      if (d.getFullYear() !== year) return false;
      if (month !== null && d.getMonth() !== month) return false;
      return true;
    });
    const admissions = entries.length;
    const totalDays = entries.reduce((s, h) => s + (h.days || 0), 0);
    const procedures = {};
    entries.forEach(h => { if (h.procedure) procedures[h.procedure] = (procedures[h.procedure] || 0) + 1; });
    return { ...r, admissions, totalDays, procedures, entries };
  });
}

function PrintReport({ rooms, month, year, onClose }) {
  const monthName = MONTH_NAMES[month];
  const stats = buildRoomStats(rooms, year, month);
  const totalAdmissions = stats.reduce((s, r) => s + r.admissions, 0);
  const totalDays = stats.reduce((s, r) => s + r.totalDays, 0);
  const avgStay = totalAdmissions > 0 ? (totalDays / totalAdmissions).toFixed(1) : 0;
  const occupied = rooms.filter(r => r.status === 'occupied').length;

  const allProcs = {};
  stats.forEach(r => Object.entries(r.procedures).forEach(([p, n]) => {
    allProcs[p] = (allProcs[p] || 0) + n;
  }));

  const allEntries = stats.flatMap(r =>
    r.entries.map(e => ({ ...e, roomId: r.id, roomType: r.type }))
  ).sort((a, b) => a.from.localeCompare(b.from));

  return (
    <div className={styles.reportOverlay}>
      <div className={styles.reportModal}>
        <div className={styles.reportActions}>
          <button className={styles.printBtn} onClick={() => window.print()}>🖨 Print / Save as PDF</button>
          <button className={styles.closeReportBtn} onClick={onClose}>✕ Close</button>
        </div>

        <div className={styles.reportBody} id="report-print-area">
          <div className={styles.repHeader}>
            <div className={styles.repHospital}>Family Care Hospital — Attock</div>
            <div className={styles.repTitle}>Monthly Patient Report</div>
            <div className={styles.repPeriod}>{monthName} {year}</div>
            <div className={styles.repGenerated}>
              Generated: {new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className={styles.repSection}>
            <div className={styles.repSectionTitle}>Summary</div>
            <div className={styles.repStatsGrid}>
              <div className={styles.repStat}>
                <div className={styles.repStatVal}>{totalAdmissions}</div>
                <div className={styles.repStatLabel}>Total admissions</div>
              </div>
              <div className={styles.repStat}>
                <div className={styles.repStatVal}>{avgStay}d</div>
                <div className={styles.repStatLabel}>Avg. stay length</div>
              </div>
              <div className={styles.repStat}>
                <div className={styles.repStatVal}>{occupied}</div>
                <div className={styles.repStatLabel}>Currently occupied</div>
              </div>
              <div className={styles.repStat}>
                <div className={styles.repStatVal}>{rooms.length}</div>
                <div className={styles.repStatLabel}>Total rooms/cabins</div>
              </div>
            </div>
          </div>

          {Object.keys(allProcs).length > 0 && (
            <div className={styles.repSection}>
              <div className={styles.repSectionTitle}>Procedures performed</div>
              <div className={styles.repProcRow}>
                {Object.entries(allProcs).map(([p, n]) => (
                  <div key={p} className={styles.repProcItem}>
                    <div className={styles.repProcName}>{p}</div>
                    <div className={styles.repProcCount}>{n}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.repSection}>
            <div className={styles.repSectionTitle}>Room-wise summary</div>
            <table className={styles.repTable}>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Admissions</th>
                  <th>Total days</th>
                  <th>Procedures</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.id}</strong></td>
                    <td>{r.type}</td>
                    <td>{r.admissions}</td>
                    <td>{r.totalDays}d</td>
                    <td>{Object.entries(r.procedures).map(([p, n]) => `${p}×${n}`).join(', ') || '—'}</td>
                    <td>{r.status === 'vacant' ? 'Ready' : r.status === 'prep' ? 'Preparing' : 'Occupied'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {allEntries.length > 0 && (
            <div className={styles.repSection}>
              <div className={styles.repSectionTitle}>Patient log — {monthName} {year}</div>
              <table className={styles.repTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Room</th>
                    <th>Patient name</th>
                    <th>MR#</th>
                    <th>Contact</th>
                    <th>Admitted</th>
                    <th>Discharged</th>
                    <th>Days</th>
                    <th>Procedure</th>
                  </tr>
                </thead>
                <tbody>
                  {allEntries.map((e, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td><strong>{e.roomId}</strong></td>
                      <td>{e.patient}</td>
                      <td>{e.mrNumber || '—'}</td>
                      <td>{e.contactNumber || '—'}</td>
                      <td>{e.from}{e.admitTime ? ` ${e.admitTime}` : ''}</td>
                      <td>{e.to}{e.dischargeTime ? ` ${e.dischargeTime}` : ''}</td>
                      <td>{e.days !== undefined ? `${e.days}d` : '—'}</td>
                      <td>{e.procedure || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {allEntries.length === 0 && (
            <div className={styles.repEmpty}>No patient records found for {monthName} {year}.</div>
          )}

          <div className={styles.repFooter}>
            Family Care Hospital Attock &nbsp;·&nbsp; Software by Halik &nbsp;·&nbsp; Confidential
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Analytics({ rooms }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [year, setYear] = useState(currentYear);
  const [reportMonth, setReportMonth] = useState(null);

  const monthlyData = buildMonthlyData(rooms, year);
  const roomStats   = buildRoomStats(rooms, year, null);

  const totalAllocs   = rooms.reduce((s, r) => s + (r.allocations || 0), 0);
  const occupied      = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = rooms.length ? Math.round((occupied / rooms.length) * 100) : 0;

  const mostAllocated = [...roomStats].sort((a, b) => b.admissions - a.admissions)[0];

  const roomAllocData = [...roomStats]
    .sort((a, b) => b.admissions - a.admissions)
    .map(r => ({ name: r.id, allocations: r.admissions }));

  const typeData = [
    { name: 'VIP',      value: rooms.filter(r => r.type === 'VIP').length,      color: '#7c3aed' },
    { name: 'Semi-VIP', value: rooms.filter(r => r.type === 'Semi-VIP').length, color: '#1e40af' },
    { name: 'Standard', value: rooms.filter(r => r.type === 'Standard').length, color: '#374151' },
    { name: 'Cabin',    value: rooms.filter(r => r.type === 'Cabin').length,     color: '#065f46' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 12 }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  };

  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div className={styles.page}>
      {reportMonth !== null && (
        <PrintReport
          rooms={rooms}
          month={reportMonth}
          year={year}
          onClose={() => setReportMonth(null)}
        />
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.subtitle}>Derived from live patient history data</p>
        </div>
        <div className={styles.headerRight}>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className={styles.yearSelect}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className={styles.reportMenuWrap}>
            <button className={styles.reportBtn}>🖨 Monthly report ▾</button>
            <div className={styles.reportDropdown}>
              {MONTH_NAMES.map((m, i) => (
                <button key={i} onClick={() => setReportMonth(i)} className={styles.reportDropItem}>
                  {m} {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{totalAllocs}</div>
            <div className={styles.statLabel}>Total admissions (all time)</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{buildRoomStats(rooms, year, currentMonth).reduce((s, r) => s + r.admissions, 0)}</div>
            <div className={styles.statLabel}>Admissions this month</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{occupancyRate}%</div>
            <div className={styles.statLabel}>Current occupancy rate</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{mostAllocated?.admissions > 0 ? mostAllocated.id : '—'}</div>
            <div className={styles.statLabel}>Most used room ({year})</div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Monthly admissions — {year}</h3>
          {monthlyData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="admissions" name="Admissions" fill="#0f1923" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className={styles.chartLegend}>
                <span><span className={styles.dot} style={{ background: '#0f1923' }} />Admissions</span>
              </div>
            </>
          ) : (
            <div className={styles.noData}>No admissions recorded for {year} yet.</div>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Room type distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {typeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.typeList}>
            {typeData.map(t => (
              <div key={t.name} className={styles.typeItem}>
                <span className={styles.dot} style={{ background: t.color }} />
                <span className={styles.typeName}>{t.name}</span>
                <span className={styles.typeVal}>{t.value} rooms</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Admissions per room — {year}</h3>
          {roomAllocData.some(r => r.allocations > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={roomAllocData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="allocations" name="Admissions" fill="#0f1923" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noData}>No admissions recorded for {year} yet.</div>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Room performance summary</h3>
          <div className={styles.miniTable}>
            <div className={styles.miniHead}>
              <span>Room</span><span>Type</span><span>Admissions</span><span>Status</span>
            </div>
            {rooms.map(r => {
              const rs = roomStats.find(x => x.id === r.id);
              return (
                <div key={r.id} className={styles.miniRow}>
                  <span className={styles.monoCell}>{r.id}</span>
                  <span>{r.type}</span>
                  <span>{rs?.admissions || 0}</span>
                  <span>
                    <span className={`${styles.statusPill} ${styles[r.status]}`}>
                      {r.status === 'vacant' ? 'Ready' : r.status === 'prep' ? 'Prep' : 'Occupied'}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}