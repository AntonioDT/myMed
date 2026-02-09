import { mockData } from '@/utils/mock';
import styles from './page.module.scss';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Analysis, Range } from '@/types/analysis';

export async function generateStaticParams() {
    return mockData.map((item) => ({
        id: item.id,
    }));
}

function formatRange(range: Range): string {
    if (range.tipo === 'numerico') {
        const minStr = range.min !== null && range.min !== undefined ? `${range.min}` : '';
        const maxStr = range.max !== null && range.max !== undefined ? `${range.max}` : '';

        if (minStr && maxStr) return `${minStr} - ${maxStr}`;
        if (minStr) return `> ${minStr}`;
        if (maxStr) return `< ${maxStr}`;
        return '-';
    } else if (range.tipo === 'testuale') {
        return range.testo || '-';
    }
    return '-';
}

export default async function AnalysisDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Cast mock data to Analysis type for type safety in this component since mock.ts isn't strictly typed yet
    const analysis = (mockData as unknown as Analysis[]).find((item) => item.id === id);

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
                <h1>{analysis.categoria}</h1>
                <p className={styles.date}>{analysis.data}</p>
            </header>

            <div className={styles.content}>
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
                        {analysis.valori.map((val) => (
                            <tr key={val.id} className={styles.row}>
                                <td>{val.nomeValore}</td>
                                <td className={styles.value}>{val.valore}</td>
                                <td className={styles.unit}>{val.unitaMisura || '-'}</td>
                                <td className={styles.range}>{formatRange(val.range)}</td>
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
        </div>
    );
}

