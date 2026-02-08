import Link from 'next/link';
import { mockData } from '../../utils/mock';
import styles from './RecentAnalysis.module.scss';

export default function RecentAnalysis() {
    // Helper to determine status based on values
    const getStatus = (values: typeof mockData[0]['valori']) => {
        const hasIssue = values.some(v => v.stato !== 'OK' && v.stato !== 'normale');
        return hasIssue ? 'Warning' : 'Normal';
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2>Recent Analysis</h2>
                <button className={styles.viewAll}>View All</button>
            </div>
            <div className={styles.list}>
                {mockData.map((item) => {
                    const status = getStatus(item.valori);
                    return (
                        <Link key={item.id} href={`/analysis/${item.id}`} className={styles.linkWrapper}>
                            <div className={styles.item}>
                                <div className={styles.info}>
                                    <span className={styles.category}>{item.categoria}</span>
                                    <span className={styles.date}>{item.data}</span>
                                </div>
                                <div className={`${styles.status} ${styles[status.toLowerCase()]}`}>
                                    {status}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

