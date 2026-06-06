import { useEffect, useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoomsView from './components/RoomsView';
import Analytics from './components/Analytics';
import HistoryView from './components/HistoryView';
import { freshChecklist } from './data';
import styles from './App.module.css';

import { db } from './firebase';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rooms, setRooms] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // ---------------------------
  // AUTH HANDLERS
  // ---------------------------
  function handleLogin(u) {
    setUser(u);
    setActiveTab('dashboard');
  }

  function handleLogout() {
    setUser(null);
    setActiveTab('dashboard');
  }

  // ---------------------------
  // FIRESTORE REALTIME SYNC
  // ---------------------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      data.sort((a, b) => a.id.localeCompare(b.id));
      setRooms(data);
    });

    return () => unsub();
  }, []);

  // ---------------------------
  // FIRESTORE ACTIONS
  // ---------------------------
  async function admitPatient(roomId, data) {
    await updateDoc(doc(db, 'rooms', roomId), {
      status: 'occupied',
      patient: data.patient,
      mrNumber: data.mrNumber,
      contactNumber: data.contactNumber,
      admitDate: data.admitDate,
      admitTime: data.admitTime,
      allocations: increment(1),
    });
  }

  async function dischargePatient(roomId, data) {
    const r = rooms.find(x => x.id === roomId);
    if (!r) return;

    const days = Math.max(
      0,
      Math.ceil(
        (new Date(data.dischargeDate) -
          new Date(r.admitDate || data.dischargeDate)) / 86400000
      )
    );

    const entry = {
      patient: r.patient,
      mrNumber: r.mrNumber || '',
      contactNumber: r.contactNumber || '',
      from: r.admitDate || data.dischargeDate,
      admitTime: r.admitTime || '',
      to: data.dischargeDate,
      dischargeTime: data.dischargeTime,
      days,
      procedure: data.procedure || '',
    };

    await updateDoc(doc(db, 'rooms', roomId), {
      status: 'prep',
      patient: null,
      mrNumber: null,
      contactNumber: null,
      admitDate: null,
      admitTime: null,
      checklist: freshChecklist(),
      history: [entry, ...(r.history || [])],
    });
  }

  async function toggleCheck(roomId, checkId) {
    const r = rooms.find(x => x.id === roomId);
    if (!r) return;

    await updateDoc(doc(db, 'rooms', roomId), {
      [`checklist.${checkId}`]: !r.checklist?.[checkId]
    });
  }

  async function markReady(roomId) {
    await updateDoc(doc(db, 'rooms', roomId), {
      status: 'vacant',
      checklist: freshChecklist()
    });
  }

  // ---------------------------
  // LOGIN GATE
  // ---------------------------
  if (!user) return <Login onLogin={handleLogin} />;

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className={styles.layout}>
      {/* Mobile header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileLogoWrap}>
          <span className={styles.mobileLogo}>F</span>
          <span className={styles.mobileLogoText}>Family Care Hospital</span>
        </div>

        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar overlay on mobile */}
      {menuOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`${styles.sidebarWrap} ${
          menuOpen ? styles.sidebarOpen : ''
        }`}
      >
        <Sidebar
          user={user}
          activeTab={activeTab}
          onTabChange={(t) => {
            setActiveTab(t);
            setMenuOpen(false);
          }}
          onLogout={handleLogout}
        />
      </div>

      <main className={styles.main}>
        {activeTab === 'dashboard' && (
          <Dashboard
            rooms={rooms}
            user={user}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'rooms' && (
          <RoomsView
            rooms={rooms}
            role={user.role}
            onAdmit={admitPatient}
            onDischarge={dischargePatient}
            onToggleCheck={toggleCheck}
            onMarkReady={markReady}
          />
        )}

        {activeTab === 'analytics' && user.role === 'admin' && (
          <Analytics rooms={rooms} />
        )}

        {activeTab === 'history' && user.role === 'admin' && (
          <HistoryView rooms={rooms} />
        )}
      </main>
    </div>
  );
}