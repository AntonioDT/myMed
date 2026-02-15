import React from 'react';
import styles from './Select.module.scss';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, containerClassName, label, error, children, ...props }, ref) => {
        return (
            <div className={clsx(styles.container, containerClassName)}>
                {label && <label className={styles.label}>{label}</label>}
                <div className={styles.selectWrapper}>
                    <select
                        ref={ref}
                        className={clsx(styles.select, error && styles.hasError, className)}
                        {...props}
                    >
                        {children}
                    </select>
                    {/* Optional: Add custom arrow icon here if needed, for now standard arrow is fine or styled via CSS */}
                </div>
                {error && <span className={styles.error}>{error}</span>}
            </div>
        );
    }
);

Select.displayName = 'Select';
