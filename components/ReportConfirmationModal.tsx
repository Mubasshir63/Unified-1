import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';

declare const L: any;

interface ReportConfirmationModalProps {
    category: string;
    description: string;
    photo: string | null;
    video: string | null;
    location: { lat: number; lng: number };
    onConfirm: () => void;
    onCancel: () => void;
}

const ReportConfirmationModal: React.FC<ReportConfirmationModalProps> = ({
    category,
    description,
    photo,
    video,
    location,
    onConfirm,
    onCancel,
}) => {
    const { t } = useTranslation();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current || !location) return;

        const { lat, lng } = location;
        const map = L.map(mapContainerRef.current, {
            center: [lat, lng],
            zoom: 17,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
        L.marker([lat, lng]).addTo(map);

        mapRef.current = map;

        const timer = setTimeout(() => map.invalidateSize(), 400);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [location]);

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
                onClick={onCancel}
            >
                <div 
                    className="bg-gray-50 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">{t('reviewReport')}</h2>
                        <p className="text-sm text-gray-500">{t('confirmReportDetails')}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">{t('category')}</p>
                            <p className="font-semibold text-gray-800">{category}</p>
                        </div>

                        {photo && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('photo')}</p>
                                <img src={photo} alt="Report attachment" className="rounded-lg w-full h-40 object-cover" />
                            </div>
                        )}

                        {video && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Video</p>
                                <video src={video} controls className="rounded-lg w-full h-40 object-cover bg-black" />
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">{t('description')}</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('location')}</p>
                            <div ref={mapContainerRef} className="h-40 w-full rounded-lg bg-gray-200 z-0"></div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-100/80 backdrop-blur-sm rounded-b-2xl border-t border-gray-200 grid grid-cols-2 gap-3">
                        <button
                            onClick={onCancel}
                            className="w-full py-3 px-4 text-gray-700 font-semibold rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                            {t('goBackEdit')}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transition-colors"
                        >
                            {t('confirmSubmission')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportConfirmationModal;