
import React from 'react';
import { SOSAlert } from '../../types';
import ServicePageLayout from '../services/ServicePageLayout';
import { ShieldIcon, CalendarIcon, LocationMarkerIcon } from '../../components/icons/NavIcons';

interface SOSHistoryPageProps {
    alerts: SOSAlert[];
    onBack: () => void;
    onSelectAlert: (alert: SOSAlert) => void;
}

const AlertCard: React.FC<{ alert: SOSAlert; onClick: () => void; }> = ({ alert, onClick }) => {
    const statusStyles = {
        Active: 'bg-red-500',
        Acknowledged: 'bg-yellow-500',
        Resolved: 'bg-green-500',
    };
    return (
        <button
            onClick={onClick}
            className="w-full bg-white rounded-xl border border-gray-200 text-left hover:bg-gray-50/50 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 overflow-hidden flex shadow-sm"
        >
            <div className={`w-1.5 flex-shrink-0 ${statusStyles[alert.status]}`}></div>
            <div className="p-4 flex-1">
                 <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-800 text-lg leading-tight">SOS Alert #{alert.id}</p>
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusStyles[alert.status]}`}>
                        {alert.status}
                    </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-3">
                    <div className="flex items-center space-x-1.5">
                        <CalendarIcon />
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <LocationMarkerIcon />
                        <span>{alert.location.address}</span>
                    </div>
                </div>
            </div>
        </button>
    );
};

const SOSHistoryPage: React.FC<SOSHistoryPageProps> = ({ alerts, onBack, onSelectAlert }) => {
    const sortedAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <ServicePageLayout
            title="SOS History"
            subtitle="Your past emergency alerts"
            onBack={onBack}
        >
            {sortedAlerts.length > 0 ? (
                <div className="space-y-3">
                    {sortedAlerts.map(alert => (
                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            onClick={() => onSelectAlert(alert)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <ShieldIcon className="w-12 h-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-semibold">No SOS History</h3>
                    <p>You have not raised any SOS alerts yet.</p>
                </div>
            )}
        </ServicePageLayout>
    );
};

export default SOSHistoryPage;