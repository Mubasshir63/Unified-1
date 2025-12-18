import React, { useEffect, useRef } from 'react';
import type { DetailedReport } from '../types';
import StatusBadge from './StatusBadge';
import { DocumentTextIcon, MagnifyingGlassIcon, UserCircleIcon, CheckCircleIcon, InfoIcon } from './icons/NavIcons';


declare const L: any;

interface ReportDetailModalProps {
    report: DetailedReport;
    onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    const getTimelineStepProps = (message: string, isCurrent: boolean) => {
        const lowerMessage = message.toLowerCase();
        
        let IconComponent = InfoIcon;
        let iconBgColor = isCurrent ? 'bg-gray-500' : 'bg-gray-100';
        let iconColor = isCurrent ? 'text-white' : 'text-gray-600';

        if (lowerMessage.includes('received')) {
            IconComponent = DocumentTextIcon;
            iconBgColor = isCurrent ? 'bg-blue-500' : 'bg-blue-100';
            iconColor = isCurrent ? 'text-white' : 'text-blue-600';
        } else if (lowerMessage.includes('review')) {
            IconComponent = MagnifyingGlassIcon;
            iconBgColor = isCurrent ? 'bg-yellow-500' : 'bg-yellow-100';
            iconColor = isCurrent ? 'text-white' : 'text-yellow-600';
        } else if (lowerMessage.includes('assigned')) {
            IconComponent = UserCircleIcon;
            iconBgColor = isCurrent ? 'bg-purple-500' : 'bg-purple-100';
            iconColor = isCurrent ? 'text-white' : 'text-purple-600';
        } else if (lowerMessage.includes('resolved')) {
            IconComponent = CheckCircleIcon;
            iconBgColor = isCurrent ? 'bg-green-500' : 'bg-green-100';
            iconColor = isCurrent ? 'text-white' : 'text-green-600';
        }

        return { IconComponent, iconBgColor, iconColor };
    };


    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current || !report.coords) return;

        const { lat, lng } = report.coords;
        const map = L.map(mapContainerRef.current, {
            center: [lat, lng],
            zoom: 17,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        L.marker([lat, lng]).addTo(map);

        mapRef.current = map;

        // Invalidate map size after modal animation
        const timer = setTimeout(() => map.invalidateSize(), 400);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [report.coords]);

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
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
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex-1 pr-4">{report.title}</h2>
                            <StatusBadge status={report.status} size="md" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-6 border-b pb-4">
                            <div>
                                <p className="font-semibold text-gray-800">Category</p>
                                <p>{report.category}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Date Reported</p>
                                <p>{new Date(report.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {(report.photo || report.video) && (
                            <div className="mb-6">
                                <h3 className="font-bold text-lg text-gray-800 mb-2">Evidence</h3>
                                <div className="space-y-4">
                                    {report.photo && (
                                        <img src={report.photo} alt={report.title} className="w-full h-auto object-cover rounded-xl" />
                                    )}
                                    {report.video && (
                                        <video src={report.video} controls className="w-full h-auto rounded-xl bg-black"></video>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div className="mb-6">
                            <h3 className="font-bold text-lg text-gray-800 mb-2">Location</h3>
                            <p className="text-sm text-gray-600 mb-3">{report.location}</p>
                            <div ref={mapContainerRef} className="h-48 w-full rounded-xl bg-gray-200 z-0"></div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-lg text-gray-800 mb-2">Description</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
                        </div>

                        <div>
                             <h3 className="font-bold text-lg text-gray-800 mb-4">Status Timeline</h3>
                             <div className="space-y-0">
                                 {report.updates.map((update, index) => {
                                     const isLast = index === report.updates.length - 1;
                                     const isCurrent = index === report.updates.length - 1;
                                     const { IconComponent, iconBgColor, iconColor } = getTimelineStepProps(update.message, isCurrent);

                                     return (
                                         <div key={index} className="flex">
                                             <div className="flex flex-col items-center mr-4">
                                                 <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconBgColor} ${iconColor}`}>
                                                     <IconComponent />
                                                 </div>
                                                 {!isLast && <div className="w-0.5 grow bg-gray-300"></div>}
                                             </div>
                                             <div className="pb-6 pt-1">
                                                 <p className={`font-semibold ${isCurrent ? 'text-gray-800' : 'text-gray-600'}`}>{update.message}</p>
                                                 <p className="text-xs text-gray-500">{update.by} - {new Date(update.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                             </div>
                                         </div>
                                     );
                                 })}
                             </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-100/80 backdrop-blur-sm rounded-b-2xl border-t border-gray-200">
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

export default ReportDetailModal;