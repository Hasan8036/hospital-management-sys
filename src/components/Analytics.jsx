import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import styles from './Analytics.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



export default function Analytics({ rooms }) {
  const [selectedYear] = useState('2026');

  const totalAllocs = rooms.reduce((s, r) => s + r.allocations, 0);
  const totalVacantDays = rooms.reduce((s, r) => s + r.vacantDays, 0);
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupied / rooms.length) * 100);

  const roomAllocData = [...rooms]
    .sort((a, b) => b.allocations - a.allocations)
    .map(r => ({ name: r.id, allocations: r.allocations, type: r.type }));

  const vacantData = [...rooms]
    .sort((a, b) => b.vacantDays - a.vacantDays)
    .map(r => ({ name: r.id, vacantDays: r.vacantDays }));

  const typeData = [
    { name: 'VIP', value: rooms.filter(r => r.type === 'VIP').length, color: '#7c3aed' },
    { name: 'Semi-VIP', value: rooms.filter(r => r.type === 'Semi-VIP').length, color: '#1e40af' },
    { name: 'Standard', value: rooms.filter(r => r.type === 'Standard').length, color: '#374151' },
    { name: 'Cabin', value: rooms.filter(r => r.type === 'Cabin').length, color: '#065f46' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontSize: 12 }}>
              {p.name}: <strong>{p.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.subtitle}>Occupancy and performance overview — {selectedYear}</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{totalAllocs}</div>
            <div className={styles.statLabel}>Total admissions this year</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{totalVacantDays}</div>
            <div className={styles.statLabel}>Total vacant days this month</div>
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
            <div className={styles.statValue}>{roomAllocData[0]?.name}</div>
            <div className={styles.statLabel}>Most allocated room</div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Monthly admissions vs vacant days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[]} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="admissions" name="Admissions" fill="#0f1923" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vacantDays" name="Vacant days" fill="#c8a96e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className={styles.chartLegend}>
            <span><span className={styles.dot} style={{ background: '#0f1923' }} />Admissions</span>
            <span><span className={styles.dot} style={{ background: '#c8a96e' }} />Vacant days</span>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Room type distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {typeData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
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
          <h3 className={styles.chartTitle}>Allocations per room (year to date)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={roomAllocData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="allocations" name="Allocations" fill="#0f1923" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Vacant days per room (this month)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vacantData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="vacantDays" name="Vacant days" fill="#c8a96e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.tableCard}>
        <h3 className={styles.chartTitle}>Room performance summary</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Room</th>
              <th>Type</th>
              <th>Status</th>
              <th>Allocations (yr)</th>
              <th>Vacant days (mo)</th>
              <th>Last patient</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r.id}>
                <td className={styles.monoCell}>{r.id}</td>
                <td>{r.type}</td>
                <td>
                  <span className={`${styles.statusPill} ${styles[r.status]}`}>
                    {r.status === 'vacant' ? 'Ready' : r.status === 'prep' ? 'Preparing' : 'Occupied'}
                  </span>
                </td>
                <td className={styles.numCell}>{r.allocations}</td>
                <td className={styles.numCell}>{r.vacantDays}d</td>
                <td className={styles.patientCell}>{r.history[0]?.patient || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
