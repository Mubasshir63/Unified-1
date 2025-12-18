import React from 'react';
import type { User } from '../types';
import { SearchIcon, NotificationIcon, AiAssistantIcon } from './icons/NavIcons';

interface HeaderProps {
    user: User | null;
    unreadCount: number;
    searchQuery: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onNotificationsClick: () => void;
    onProfileClick: () => void;
    onAiAssistantClick: () => void;
    searchPlaceholder: string;
    searchDisabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    user,
    unreadCount,
    searchQuery,
    onSearchChange,
    onNotificationsClick,
    onProfileClick,
    onAiAssistantClick,
    searchPlaceholder,
    searchDisabled = false,
}) => {
    return (
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <button
                onClick={onProfileClick}
                className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-green-500 focus:outline-none focus:ring-green-700 transition flex-shrink-0"
                aria-label="Open Profile"
            >
                <img src={user?.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            </button>

            <div className="flex-1 mx-4 relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white focus:shadow-md transition-all placeholder:text-gray-500 disabled:bg-gray-200/60 disabled:cursor-not-allowed"
                    value={searchQuery}
                    onChange={onSearchChange}
                    aria-label="Search"
                    disabled={searchDisabled}
                />
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
                <button onClick={onNotificationsClick} className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Open Notifications">
                    <NotificationIcon />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                </button>
                <button onClick={onAiAssistantClick} className="p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Open AI Assistant">
                    <AiAssistantIcon />
                </button>
            </div>
        </header>
    );
};

export default Header;