import React from 'react';
import { DetailedReport, ReportStatus } from '../types';
import { CalendarIcon, LocationMarkerIcon } from './icons/NavIcons';
import StatusBadge from './StatusBadge';

interface ReportCardProps {
    report: DetailedReport;
    onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onClick }) => {
    const statusStyles = {
        [ReportStatus.Resolved]: { bg: 'bg-green-500' },
        [ReportStatus.UnderReview]: { bg: 'bg-yellow-500' },
        [ReportStatus.Emergency]: { bg: 'bg-red-500' },
    };
    const currentStatusStyle = statusStyles[report.status];
    const isResolved = report.status === ReportStatus.Resolved;

    return (
        <button
            onClick={onClick}
            className="w-full bg-white rounded-xl border border-gray-200 text-left hover:bg-gray-50/50 hover:border-green-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 overflow-hidden flex shadow-sm"
        >
            <div className={`w-1.5 flex-shrink-0 ${currentStatusStyle.bg} ${isResolved ? 'animate-pulse-green' : ''}`}></div>
            <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{report.category}</p>
                    <StatusBadge status={report.status} />
                </div>

                <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2">{report.title}</h3>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {report.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1.5">
                        <CalendarIcon />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <LocationMarkerIcon />
                        <span>{report.location.split(',')[0]}</span>
                    </div>
                </div>
            </div>
             {report.photo && (
                <div className="w-28 flex-shrink-0">
                    <img src={report.photo} alt={report.title} className="w-full h-full object-cover" />
                </div>
            )}
        </button>
    );
};

export default ReportCard;