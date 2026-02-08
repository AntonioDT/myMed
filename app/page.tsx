import styles from './page.module.scss';
import QuickActions from '@/components/Dashboard/QuickActions';
import RecentAnalysis from '@/components/Dashboard/RecentAnalysis';
import TrendsChart from '@/components/Dashboard/TrendsChart';

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome back, Antonio</p>
      </header>

      <QuickActions />

      <div className={styles.grid}>
        <div className={styles.mainContent}>
          <TrendsChart />
        </div>
        <aside className={styles.sidebar}>
          <RecentAnalysis />
        </aside>
      </div>
    </div>
  );
}
