import React from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import { useTranslation } from '../hooks/useTranslation';
import { ReportStatus, Page } from '../types';
import { ResolvedIcon, InfoIcon } from './icons/NavIcons';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

const timeSince = (date: number) => {
    const seconds = Math.floor((new Date().getTime() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
};


const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose, onNavigate }) => {
    const { notifications, unreadCount, markAllAsRead, clearNotification } = useNotifications();
    const { t } = useTranslation();

    const handlePanelClick = (e: React.MouseEvent) => e.stopPropagation();

    const handleItemClick = (notificationId: string, link?: Page) => {
        clearNotification(notificationId);
        if (link) {
            onNavigate(link);
        }
        onClose();
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div 
                onClick={handlePanelClick}
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                        <h2 className="text-xl font-bold text-gray-800">{t('notifications')}</h2>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">&times;</button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div>
                                {unreadCount > 0 && (
                                     <div className="p-2">
                                        <button onClick={markAllAsRead} className="w-full text-sm font-semibold text-green-600 text-center py-2 hover:bg-green-50 rounded-lg">
                                            {t('markAllAsRead')}
                                        </button>
                                     </div>
                                )}
                                {notifications.map(n => (
                                    <div key={n.id} className={`p-4 border-b border-gray-200 flex items-start space-x-4 hover:bg-gray-100 transition-colors ${!n.read ? 'bg-green-50' : 'bg-white'}`}>
                                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-1">
                                            {n.title === t('reportResolvedTitle') ? <ResolvedIcon /> : <InfoIcon />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800">{n.title}</p>
                                            <p className="text-sm text-gray-600">{n.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{timeSince(n.timestamp)}</p>
                                        </div>
                                        <div className="flex flex-col items-center space-y-2">
                                            <button onClick={() => clearNotification(n.id)} className="text-gray-400 hover:text-gray-600 text-lg p-1">&times;</button>
                                            {n.link && <button onClick={() => handleItemClick(n.id, n.link)} className="text-xs font-semibold text-green-600 hover:underline">View</button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-center text-gray-500 p-8">
                                <div>
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noNotifications')}</h3>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationsPanel;
