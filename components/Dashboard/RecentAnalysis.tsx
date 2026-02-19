'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './RecentAnalysis.module.scss';
import { Analysis } from '@/types/analysis';

export default function RecentAnalysis() {
    const [analysisList, setAnalysisList] = useState<any[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem('myMed_analysis_data');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setAnalysisList(parsedData);
            } catch (e) {
                console.error("Failed to parse stored analysis", e);
            }
        }
    }, []);

    // Helper to determine status based on sections
    const getStatus = (sections: Analysis['sezioni']) => {
        if (!sections || !Array.isArray(sections)) return 'Normal'; // Handle legacy/invalid data

        let hasIssue = false;

        for (const section of sections) {
            if (section.valori.some(v => v.stato !== 'OK' && v.stato !== 'normale')) {
                hasIssue = true;
                break;
            }
        }

        return hasIssue ? 'Warning' : 'Normal';
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2>Recent Analysis</h2>
                <Link href="/analysis" className={styles.viewAll}>View All</Link>
            </div>
            <div className={styles.list}>
                {analysisList.length === 0 ? (
                    <div className={styles.emptyState}>No recent analysis found.</div>
                ) : (
                    analysisList.map((item: Analysis) => {
                        const status = getStatus(item.sezioni);
                        // Check if laboratorio exists to conditionally render it
                        const label = `Referto ${item.data}${item.laboratorio ? ` - ${item.laboratorio}` : ''}`;

                        return (
                            <Link key={item.id} href={`/analysis/${item.id}`} className={styles.linkWrapper}>
                                <div className={styles.item}>
                                    <div className={styles.info}>
                                        <span className={styles.category}>{label}</span>
                                    </div>
                                    <div className={`${styles.status} ${styles[status.toLowerCase()]}`}>
                                        {status}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </section>
    );
}

