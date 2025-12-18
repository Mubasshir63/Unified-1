
import React from 'react';
import type { SOSAlert } from '../types';
import { CalendarIcon, LocationMarkerIcon, UserCircleIcon } from './icons/NavIcons';

interface SOSDetailModalProps {
    alert: SOSAlert;
    onClose: () => void;
}

const SOSDetailModal: React.FC<SOSDetailModalProps> = ({ alert, onClose }) => {
    const statusStyles = {
        Active: { text: 'text-red-800', bg: 'bg-red-100' },
        Acknowledged: { text: 'text-yellow-800', bg: 'bg-yellow-100' },
        Resolved: { text: 'text-green-800', bg: 'bg-green-100' },
    };
    const currentStatusStyle = statusStyles[alert.status];

    return (
        <>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
            `}</style>
            <div 
                className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fadeIn"
                onClick={onClose}
            >
                <div 
                    className="bg-gray-50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                             <h2 className="text-2xl font-bold text-gray-800">SOS Alert #{alert.id}</h2>
                              <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${currentStatusStyle.bg} ${currentStatusStyle.text}`}>
                                {alert.status}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {alert.recordedVideo && (
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">Recorded Video Evidence</h3>
                                <video
                                    key={alert.id}
                                    src={alert.recordedVideo}
                                    controls
                                    className="w-full rounded-lg bg-black"
                                />
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Details</p>
                            <div className="mt-2 space-y-2 text-sm">
                                <div className="flex items-center space-x-2"><UserCircleIcon className="w-5 h-5 text-gray-500"/><span>Triggered by: {alert.user.name}</span></div>
                                <div className="flex items-center space-x-2"><CalendarIcon /><span>Time: {new Date(alert.timestamp).toLocaleString()}</span></div>
                                <div className="flex items-center space-x-2"><LocationMarkerIcon /><span>Location: {alert.location.address}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-100/80 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 px-4 text-gray-700 font-semibold rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SOSDetailModal;