import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import type { Notification, Page } from '../types';

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (title: string, message: string, link?: Page) => void;
    markAllAsRead: () => void;
    clearNotification: (id: string) => void;
    showToast: (message: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

    useEffect(() => {
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            setNotifications(JSON.parse(storedNotifications));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = useCallback((title: string, message: string, link?: Page) => {
        const newNotification: Notification = {
            id: new Date().toISOString(),
            title,
            message,
            timestamp: Date.now(),
            read: false,
            link,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const showToast = useCallback((message: string) => {
        setToast({ message, id: Date.now() });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;
    
    const ToastComponent = () => {
        if (!toast) return null;
        return (
            <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-[10000] animate-toastIn">
                {toast.message}
            </div>
        );
    };
    
    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead, clearNotification, showToast }}>
            <style>{`
                @keyframes toastIn {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-toastIn { animation: toastIn 0.3s ease-out forwards; }
            `}</style>
            <ToastComponent />
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = (): NotificationsContextType => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};
