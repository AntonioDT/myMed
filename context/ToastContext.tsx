'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        setToast({ message, type });
        setIsVisible(true);

        // Auto hide after 3 seconds
        setTimeout(() => {
            setIsVisible(false);
            // Wait for animation to finish before clearing state
            setTimeout(() => {
                setToast(null);
            }, 500);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && <ToastContainer message={toast.message} type={toast.type} isVisible={isVisible} />}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Internal container component for the toast
import Toast from '@/components/Toast/Toast';

const ToastContainer = ({ message, type, isVisible }: { message: string; type: ToastType; isVisible: boolean }) => {
    return (
        <Toast message={message} type={type} isVisible={isVisible} />
    );
};
