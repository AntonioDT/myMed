import { Plus, Upload } from 'lucide-react';
import styles from './QuickActions.module.scss';

export default function QuickActions() {
    return (
        <div className={styles.container}>
            <button className={styles.actionButton}>
                <Plus size={20} />
                Add Manual Entry
            </button>
            <button className={styles.actionButton}>
                <Upload size={20} />
                Upload PDF Report
            </button>
        </div>
    );
}
