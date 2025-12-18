

import React, { useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';

interface GovtHeaderProps {
    onProfileClick: () => void;
}

const GovtHeader: React.FC<GovtHeaderProps> = ({ onProfileClick }) => {
    const { user } = useContext(UserContext);

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 h-[65px]">
            <div className="flex items-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <defs><linearGradient id="govLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2dd4bf"/><stop offset="100%" stopColor="#0d9488"/></linearGradient></defs>
                    <circle cx="12" cy="12" r="11" fill="url(#govLogoGradient)"/>
                    <path d="M12 4L4 8v5c0 4.4 3.58 8.25 8 9.25 4.42-1 8-4.85 8-9.25V8l-8-4zm0 1.5l6 3v4.5c0 3.32-2.67 6.18-6 6.92-3.33-.74-6-3.6-6-6.92V8.5l6-3zM12 12l3.5-2-1.5 4h-4l-1.5-4z" fill="white"/>
                </svg>
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Control Center</h1>
                    <p className="text-xs font-semibold text-teal-600 -mt-1 animate-fadeInUp" style={{ animationDelay: '200ms' }}>FOR GOVERNMENT HUB</p>
                </div>
            </div>
            <button onClick={onProfileClick} className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-200/60 transition-colors">
                <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.name}</span>
                <img src={user?.profilePicture} alt="profile" className="w-9 h-9 rounded-full" />
            </button>
        </header>
    );
};

export default GovtHeader;
