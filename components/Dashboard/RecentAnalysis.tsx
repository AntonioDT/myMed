import styles from './RecentAnalysis.module.scss';

const MOCK_DATA = [
    { id: 1, category: 'Blood Work', date: 'Oct 24, 2023', status: 'Normal' },
    { id: 2, category: 'Urine Analysis', date: 'Sep 15, 2023', status: 'Warning' },
    { id: 3, category: 'Lipid Panel', date: 'Aug 10, 2023', status: 'Normal' },
    { id: 4, category: 'General Checkup', date: 'Jul 05, 2023', status: 'Normal' },
];

export default function RecentAnalysis() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2>Recent Analysis</h2>
                <button className={styles.viewAll}>View All</button>
            </div>
            <div className={styles.list}>
                {MOCK_DATA.map((item) => (
                    <div key={item.id} className={styles.item}>
                        <div className={styles.info}>
                            <span className={styles.category}>{item.category}</span>
                            <span className={styles.date}>{item.date}</span>
                        </div>
                        <div className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>
                            {item.status}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
