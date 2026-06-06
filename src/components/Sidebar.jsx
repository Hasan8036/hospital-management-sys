import styles from './Sidebar.module.css';

const NAV_ADMIN = [
  { id: 'dashboard', label: 'Dashboard',      icon: '⊞' },
  { id: 'rooms',     label: 'Rooms & Cabins', icon: '🚪' },
  { id: 'analytics', label: 'Analytics',      icon: '📊' },
  { id: 'history',   label: 'Patient History',icon: '📋' },
];

const NAV_RECEPTION = [
  { id: 'dashboard', label: 'Dashboard',   icon: '⊞' },
  { id: 'rooms',     label: 'Room Status', icon: '🚪' },
];

export default function Sidebar({ user, activeTab, onTabChange, onLogout }) {
  const nav = user.role === 'admin' ? NAV_ADMIN : NAV_RECEPTION;

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>F</div>
        <div>
          <div className={styles.logoText}>Family Care</div>
          <div className={styles.logoSub}>Hospital · Attock</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navLabel}>Menu</div>
        {nav.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.roleBadge}>
          <span className={`${styles.roleTag} ${user.role === 'admin' ? styles.admin : styles.reception}`}>
            {user.role === 'admin' ? '🔑 Admin' : '👤 Reception'}
          </span>
        </div>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{user.avatar}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userRole}>{user.role}</div>
          </div>
          <button className={styles.logout} onClick={onLogout} title="Sign out">↩</button>
        </div>
        <div className={styles.credit}>Software by <strong>Halik</strong></div>
      </div>
    </div>
  );
}
