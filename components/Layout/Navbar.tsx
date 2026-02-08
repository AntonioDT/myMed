import Link from 'next/link';
import { Settings, LayoutDashboard } from 'lucide-react';
import styles from './Navbar.module.scss';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">myMed</Link>
            </div>

            {/* 
        For now, we just have the Dashboard link. 
        As the app grows, we can add more navigation items here.
      */}
            <div className={styles.navLinks}>
                <Link href="/" className={styles.link}>
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </Link>
            </div>

            <div className={styles.userActions}>
                <button className={styles.iconButton} aria-label="Instellungen">
                    <Settings size={20} />
                </button>
                <Link href="/profile" className={styles.avatar} aria-label="Profile">
                    JS
                </Link>
            </div>
        </nav>
    );
}
