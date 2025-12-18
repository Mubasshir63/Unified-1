import React from 'react';
import type { MapPoint, DetailedReport } from '../types';
import StatusBadge from './StatusBadge';
import { useTranslation } from '../hooks/useTranslation';
import { LocationMarkerIcon } from '../components/icons/NavIcons';

interface MapDetailSheetProps {
    point: MapPoint;
    onClose: () => void;
    onViewDetails: () => void;
    onReportIssue: (facilityDetails: DetailedReport) => void;
}

const MapDetailSheet: React.FC<MapDetailSheetProps> = ({ point, onViewDetails, onClose, onReportIssue }) => {
    const { t } = useTranslation();
    const isFacility = point.type === 'facility';

    return (
        <div className="fixed inset-0 z-[1000] flex items-end pointer-events-none" onClick={onClose}>
            <div 
                className="w-full bg-white rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.15)] animate-slideUpSheet pointer-events-auto"
                onClick={e => e.stopPropagation()}
            >
                {(point.type === 'issue' || point.type === 'resolved') && point.details.photo && (
                    <img src={point.details.photo} alt={point.details.title} className="w-full h-40 object-cover rounded-t-2xl" />
                )}
                
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            <h3 className="text-lg font-bold text-gray-800">{point.details.title}</h3>
                            <p className="text-sm font-semibold text-gray-500 mb-2">{point.details.category}</p>
                        </div>
                         <StatusBadge status={point.details.status} />
                    </div>
                    
                    <div className="flex items-start space-x-1.5 text-xs text-gray-500 my-3">
                        <LocationMarkerIcon />
                        <span>{point.details.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-4">
                         <button 
                            onClick={onViewDetails}
                            className="flex-1 py-3 px-4 text-sm text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
                        >
                            {t('viewDetails')}
                        </button>
                        {isFacility && (
                             <button 
                                onClick={() => onReportIssue(point.details)}
                                className="flex-1 py-3 px-4 text-sm text-green-700 font-semibold rounded-xl bg-green-100 hover:bg-green-200 transition-colors shadow-sm"
                            >
                                Report an issue
                            </button>
                        )}
                    </div>
                </div>
                 <button onClick={onClose} className="absolute top-2 right-2 p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
            </div>
        </div>
    );
};

export default MapDetailSheet;