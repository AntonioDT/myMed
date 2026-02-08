import { BarChart3 } from 'lucide-react';
import styles from './TrendsChart.module.scss';

export default function TrendsChart() {
    return (
        <section className={styles.container}>
            <div className={styles.placeholder}>
                <BarChart3 size={48} className={styles.icon} />
                <h3>Health Trends</h3>
                <p>Your analysis charts will appear here.</p>
            </div>
        </section>
    );
}
