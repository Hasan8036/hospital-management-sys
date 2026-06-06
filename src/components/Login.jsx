import { useState } from 'react';
import { USERS } from '../data';
import styles from './Login.module.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>F</span>
            <div>
              <div className={styles.logoText}>Family Care Hospital</div>
              <div className={styles.logoCity}>Attock</div>
            </div>
          </div>
          <h1 className={styles.headline}>
            Room<br />Management<br />System
          </h1>
          <p className={styles.sub}>Manage private ward rooms, admissions, discharges, and room readiness — all in one place.</p>
          <div className={styles.features}>
            <div className={styles.feature}><span className={styles.featureDot} />Real-time room status</div>
            <div className={styles.feature}><span className={styles.featureDot} />Room readiness checklist</div>
            <div className={styles.feature}><span className={styles.featureDot} />Occupancy analytics</div>
            <div className={styles.feature}><span className={styles.featureDot} />Role-based access control</div>
          </div>
        </div>
        <div className={styles.decorGrid}>
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className={styles.gridCell} style={{ opacity: (i % 7) * 0.07 + 0.04 }} />
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Welcome back</h2>
            <p>Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
            <div className={styles.field}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="new-password"
              />
            </div>
            {error && <div className={styles.error}>⚠ {error}</div>}
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Sign in →'}
            </button>
          </form>
        </div>

        <div className={styles.footer}>
          Software owned by <strong>Halik</strong>
        </div>
      </div>
    </div>
  );
}
