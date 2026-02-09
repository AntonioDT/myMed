import { Plus, Upload } from 'lucide-react';
import styles from './QuickActions.module.scss';
import Link from 'next/link';

export default function QuickActions() {
    return (
        <div className={styles.container}>
            <Link href="/analysis/new" className={styles.actionButton}>
                <Plus size={20} />
                Add Manual Entry
            </Link>
            <button className={styles.actionButton}>
                <Upload size={20} />
                Upload PDF Report
            </button>
        </div>
    );
}
