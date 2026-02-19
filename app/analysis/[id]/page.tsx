'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import Link from 'next/link';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Analysis, Range } from '@/types/analysis';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';

function formatRange(range: Range) {
    if (range.tipo === 'numerico') {
        const minStr = range.min !== null && range.min !== undefined ? `${range.min}` : '';
        const maxStr = range.max !== null && range.max !== undefined ? `${range.max}` : '';

        if (minStr && maxStr) return `${minStr} - ${maxStr}`;
        if (minStr) return `> ${minStr}`;
        if (maxStr) return `< ${maxStr}`;
        return '-';
    } else if (range.tipo === 'testuale') {
        return range.testo || '-';
    } else if (range.tipo === 'multi-range' && range.segmenti) {
        // We can return a simplified string or maybe a small list
        // For now, let's return a string representation of the "Optimal" or standard range if possible,
        // or just "See details"
        return "Vedi dettagli"; // Placeholder, real implementation might show the segment matching the value or a tooltip
    }
    return '-';
}

export default function AnalysisDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (!id) return;

        const storedData = localStorage.getItem('myMed_analysis_data');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const found = parsedData.find((item: Analysis) => item.id === id);
                setAnalysis(found || null);
            } catch (e) {
                console.error("Failed to parse stored analysis", e);
            }
        }
        setLoading(false);
    }, [id]);

    const handleDelete = () => {
        try {
            const storedData = localStorage.getItem('myMed_analysis_data');
            if (storedData) {
                const parsedData: Analysis[] = JSON.parse(storedData);
                const filtered = parsedData.filter(item => item.id !== id);
                localStorage.setItem('myMed_analysis_data', JSON.stringify(filtered));
            }
        } catch (e) {
            console.error('Failed to delete analysis', e);
        }
        router.push('/');
    };

    if (loading) {
        return <div className={styles.container}><p>Loading...</p></div>;
    }

    if (!analysis) {
        return (
            <div className={styles.container}>
                <p>Analysis not found</p>
                <Link href="/" className={styles.backLink}>Go Back</Link>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <div className={styles.headerRow}>
                    <h1>Referto {analysis.data} {analysis.laboratorio ? `- ${analysis.laboratorio}` : ''}</h1>
                    <div className={styles.headerActions}>
                        <Link href={`/analysis/new?editId=${analysis.id}`} className={styles.editButton}>
                            <Pencil size={18} />
                            Modifica
                        </Link>
                        <button
                            className={styles.deleteButton}
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <Trash2 size={18} />
                            Elimina
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.content}>
                {analysis.sezioni.map((section) => (
                    <div key={section.id} className={styles.section}>
                        {section.categoria && <h2>{section.categoria}</h2>}
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Value</th>
                                    <th>Result</th>
                                    <th>Unit</th>
                                    <th>Range</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {section.valori.map((val) => (
                                    <tr key={val.id} className={styles.row}>
                                        <td>
                                            <div className={styles.valueName}>{val.nomeValore}</div>
                                        </td>
                                        <td className={styles.value}>{val.valore}</td>
                                        <td className={styles.unit}>{val.unitaMisura || '-'}</td>
                                        <td className={styles.range}>
                                            {val.range.tipo !== 'multi-range' ? formatRange(val.range) : (
                                                <div className={styles.rangeDetails}>
                                                    {val.range.segmenti?.map((seg, i) => (
                                                        <div key={i} className={styles.rangeSegment}>
                                                            <span className={styles.segmentLabel}>{seg.label}:</span>
                                                            {seg.min !== undefined ? ` > ${seg.min}` : ''}
                                                            {seg.min !== undefined && seg.max !== undefined ? ' e ' : ''}
                                                            {seg.max !== undefined ? ` < ${seg.max}` : ''}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${styles[val.stato.toLowerCase()] || styles.default}`}>
                                                {val.stato}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Elimina referto"
                message={`Sei sicuro di voler eliminare il referto del ${analysis.data}? Questa azione non può essere annullata.`}
                confirmLabel="Elimina"
                cancelLabel="Annulla"
                variant="danger"
            />
        </div>
    );
}

