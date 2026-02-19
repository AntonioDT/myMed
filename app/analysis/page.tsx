'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.scss';
import { Analysis } from '@/types/analysis';

function getStatus(sezioni: Analysis['sezioni']): 'Normal' | 'Warning' {
    if (!sezioni || !Array.isArray(sezioni)) return 'Normal';

    for (const section of sezioni) {
        if (section.valori.some(v => v.stato !== 'OK' && v.stato !== 'normale')) {
            return 'Warning';
        }
    }
    return 'Normal';
}

function getPreviewTags(analysis: Analysis): string[] {
    // 1. Try categories first
    const categories = analysis.sezioni
        .map(s => s.categoria)
        .filter((c): c is string => !!c && c.trim() !== '');

    if (categories.length > 0) {
        return categories.slice(0, 4);
    }

    // 2. Fallback: first 3 value names
    const allValues = analysis.sezioni.flatMap(s => s.valori);
    return allValues.slice(0, 3).map(v => v.nomeValore);
}

export default function AllAnalysisPage() {
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedData = localStorage.getItem('myMed_analysis_data');
        if (storedData) {
            try {
                const parsed: Analysis[] = JSON.parse(storedData);
                // Sort by date descending (most recent first)
                parsed.sort((a, b) => {
                    // Dates are in YYYY-MM-DD format, so string comparison works
                    if (b.data > a.data) return 1;
                    if (b.data < a.data) return -1;
                    return 0;
                });
                setAnalyses(parsed);
            } catch (e) {
                console.error('Failed to parse stored analysis data', e);
            }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div className={styles.container}><p>Loading...</p></div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <h1>All Reports</h1>
                <p className={styles.subtitle}>
                    {analyses.length} {analyses.length === 1 ? 'report' : 'reports'} saved
                </p>
            </header>

            {analyses.length === 0 ? (
                <div className={styles.emptyState}>
                    No analysis reports found. Start by adding a new one!
                </div>
            ) : (
                <div className={styles.grid}>
                    {analyses.map(analysis => {
                        const status = getStatus(analysis.sezioni);
                        const tags = getPreviewTags(analysis);

                        return (
                            <Link
                                key={analysis.id}
                                href={`/analysis/${analysis.id}`}
                                className={styles.card}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardInfo}>
                                        <span className={styles.cardDate}>{analysis.data}</span>
                                        {analysis.laboratorio && (
                                            <span className={styles.cardLab}>{analysis.laboratorio}</span>
                                        )}
                                    </div>
                                    <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
                                        {status}
                                    </span>
                                </div>

                                {tags.length > 0 && (
                                    <div className={styles.cardPreview}>
                                        {tags.map((tag, i) => (
                                            <span key={i} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
