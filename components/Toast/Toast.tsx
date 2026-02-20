'use client';

import React from 'react';
import styles from './Toast.module.scss';
import clsx from 'clsx';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', isVisible }) => {
    const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;

    return (
        <div className={clsx(styles.toastContainer, isVisible && styles.visible, styles[type])}>
            <div className={styles.toast}>
                <Icon size={20} className={styles.icon} />
                <span className={styles.message}>{message}</span>
            </div>
        </div>
    );
};

export default Toast;
