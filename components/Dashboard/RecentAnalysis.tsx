'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockData } from '../../utils/mock';
import styles from './RecentAnalysis.module.scss';
import { Analysis } from '@/types/analysis';

export default function RecentAnalysis() {
    const [analysisList, setAnalysisList] = useState<any[]>(mockData);

    useEffect(() => {
        const storedData = localStorage.getItem('myMed_analysis_data');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                // Merge stored data with mock data, avoiding duplicates if any logic needed, 
                // but for now we just prepend stored data as they are "new"
                // Actually mockData is static, so we can just use storedData + mockData
                // However, mockData might be modified in memory if we navigated here without reload.
                // Let's rely on localStorage as the source of truth for new items + static mockData for old ones.
                // If mockData was exported as 'let' and modified, it might already have items.
                // To be safe and simple: combine Unique items or just prepend.

                // Better approach for this prototype: 
                // 1. Initial state is mockData.
                // 2. Effect loads localStorage. 
                // 3. We filter localStorage items to ensure we don't duplicate if mockData already has them (unlikely in this simple static setup unless ids conflict).

                setAnalysisList([...parsedData, ...mockData]);
            } catch (e) {
                console.error("Failed to parse stored analysis", e);
            }
        }
    }, []);

    // Helper to determine status based on values
    const getStatus = (values: Analysis['valori']) => {
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
                {analysisList.map((item) => {
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

