

import React, { useState, useEffect, useRef } from 'react';
import type { SOSAlert } from '../../../types';
import { useNotifications } from '../../../contexts/NotificationsContext';
import { PoliceIcon, AmbulanceIcon, CheckCircleIcon, ShieldIcon, ArrowLeftIcon, SOSIcon } from '../../../components/icons/NavIcons';
declare const L: any;

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
};

const StatusIndicator: React.FC<{ status: SOSAlert['status'] }> = ({ status }) => {
    if (status === 'Active') {
        return <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-1 animate-pulse" title="Active"></div>;
    }
    if (status === 'Acknowledged') {
        return <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0 mt-1" title="Acknowledged"></div>;
    }
    return null;
};

interface SOSViewProps {
    alerts: SOSAlert[];
    onAction: (alertId: number, action: 'Acknowledge' | 'Resolve') => void;
    isLoading: boolean;
}

const SOSListItemSkeleton: React.FC = () => (
    <div className="w-full p-4 border-b border-slate-700 animate-shimmer">
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-600"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-600 rounded w-32"></div>
                    <div className="h-3 bg-slate-600 rounded w-40"></div>
                </div>
            </div>
            <div className="w-3 h-3 bg-slate-600 rounded-full mt-1"></div>
        </div>
    </div>
);

const SOSDetailSkeleton: React.FC = () => (
    <div className="p-6 space-y-6 animate-shimmer">
        <div className="h-8 bg-slate-700 rounded w-1/2"></div>
        <div className="flex items-center space-x-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="w-16 h-16 rounded-full bg-slate-600"></div>
            <div className="flex-1 space-y-2">
                <div className="h-6 bg-slate-600 rounded w-1/3"></div>
                <div className="h-4 bg-slate-600 rounded w-1/2"></div>
                <div className="h-3 bg-slate-600 rounded w-1/4"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <div className="h-5 bg-slate-700 rounded w-1/4 mb-2"></div>
                <div className="aspect-video bg-slate-700 rounded-xl"></div>
            </div>
            <div>
                <div className="h-5 bg-slate-700 rounded w-1/4 mb-2"></div>
                <div className="aspect-video bg-slate-700 rounded-xl"></div>
            </div>
        </div>
        <div>
            <div className="h-5 bg-slate-700 rounded w-1/4 mb-2"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-16 bg-slate-700 rounded-xl"></div>
                <div className="h-16 bg-slate-700 rounded-xl"></div>
                <div className="h-16 bg-slate-700 rounded-xl"></div>
                <div className="h-16 bg-slate-700 rounded-xl"></div>
            </div>
        </div>
    </div>
);

const SOSDetailPanel: React.FC<{ alert: SOSAlert, onAction: (action: string) => void, onBack?: () => void }> = ({ alert, onAction, onBack }) => {
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    const initMap = (mapContainer: HTMLDivElement) => {
        if (mapContainer && !mapRef.current) {
            const { lat, lng } = alert.location.coords;
            const map = L.map(mapContainer, { center: [lat, lng], zoom: 16, zoomControl: false });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO'
            }).addTo(map);
            const icon = L.divIcon({
                html: `<div class="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-xl animate-pulse-sos"></div>`,
                className: '', iconSize: [32, 32], iconAnchor: [16, 16]
            });
            markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
            mapRef.current = map;
        }
    };
    
    useEffect(() => {
        if (mapRef.current) {
            const { lat, lng } = alert.location.coords;
            mapRef.current.setView([lat, lng], 16);
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            }
        }
    }, [alert]);

    const headerColor = alert.status === 'Active' ? 'text-red-400' : 'text-yellow-400';

    return (
        <div key={alert.id} className="p-4 sm:p-6 space-y-6 animate-scaleIn h-full overflow-y-auto">
            <header className="flex items-center">
                {onBack && (
                    <button onClick={onBack} className="md:hidden p-2 mr-2 -ml-2 text-slate-300 hover:bg-slate-700 rounded-full">
                        <ArrowLeftIcon />
                    </button>
                )}
                <h2 className={`text-2xl font-bold ${headerColor}`}>Alert #{alert.id} - {alert.status}</h2>
            </header>

            <section className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700 flex items-center space-x-4">
                <img src={alert.user.profilePicture} alt={alert.user.name} className="w-16 h-16 rounded-full" />
                <div>
                    <p className="text-xl font-bold text-slate-100">{alert.user.name}</p>
                    <p className="text-slate-300">{alert.user.phone}</p>
                    <p className="text-sm text-slate-400">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section>
                    <h3 className="font-bold text-lg mb-2">Recorded Evidence</h3>
                    <div className="bg-slate-900 aspect-video rounded-xl flex flex-col items-center justify-center text-white/50 relative overflow-hidden border-2 border-slate-700 shadow-inner">
                        {alert.recordedVideo ? (
                            <video key={alert.id} src={alert.recordedVideo} controls autoPlay className="absolute inset-0 w-full h-full object-contain z-10" />
                        ) : (
                            <div className="text-center z-10"><svg className="w-12 h-12 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="2" d="M15 10l4.55a1 1 0 011.45.89V19.1a1 1 0 01-1.45.89L15 16M4 18h8a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><p className="mt-2 text-sm text-slate-400">No video recorded.</p></div>
                        )}
                    </div>
                </section>
                <section>
                    <h3 className="font-bold text-lg mb-2">Location</h3>
                    <div ref={initMap} className="aspect-video rounded-xl bg-slate-700" />
                </section>
            </div>
            
            <section>
                <h3 className="font-bold text-lg mb-2">Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => onAction('Dispatch Police')} className="p-3 flex flex-col items-center justify-center bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg space-y-1 transform hover:scale-105"><PoliceIcon/><span>Dispatch Police</span></button>
                    <button onClick={() => onAction('Dispatch Ambulance')} className="p-3 flex flex-col items-center justify-center bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg space-y-1 transform hover:scale-105"><AmbulanceIcon/><span>Dispatch Ambulance</span></button>
                    <button onClick={() => onAction('Acknowledge')} disabled={alert.status === 'Acknowledged'} className="p-3 flex flex-col items-center justify-center bg-yellow-500 text-white rounded-xl font-semibold transition-colors shadow-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-yellow-600 space-y-1 transform hover:scale-105"><ShieldIcon className="w-6 h-6"/><span>Acknowledge</span></button>
                    <button onClick={() => onAction('Resolve Alert')} className="p-3 flex flex-col items-center justify-center bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg space-y-1 transform hover:scale-105"><CheckCircleIcon/><span>Resolve Alert</span></button>
                </div>
            </section>
        </div>
    );
};


const SOSView: React.FC<SOSViewProps> = ({ alerts, onAction, isLoading }) => {
    const sortedAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(sortedAlerts.length > 0 ? sortedAlerts[0] : null);
    const [isMobileDetailVisible, setMobileDetailVisible] = useState(false);
    const { showToast } = useNotifications();

    useEffect(() => {
        if (selectedAlert && !alerts.find(a => a.id === selectedAlert.id)) {
            setSelectedAlert(sortedAlerts.length > 0 ? sortedAlerts[0] : null);
        } else if (!selectedAlert && sortedAlerts.length > 0) {
            setSelectedAlert(sortedAlerts[0]);
        }
    }, [alerts, selectedAlert, sortedAlerts]);

    const handleSelectAlert = (alert: SOSAlert) => {
        setSelectedAlert(alert);
        if (window.innerWidth < 768) {
            setMobileDetailVisible(true);
        }
    };
    
    const handleAction = (action: string) => {
        if (!selectedAlert) return;
        showToast(`${action} for ${selectedAlert.user.name}`);
        if (action === 'Resolve Alert') onAction(selectedAlert.id, 'Resolve');
        else if (action === 'Acknowledge') onAction(selectedAlert.id, 'Acknowledge');
    };

    if (isLoading) {
        return (
            <div className="md:flex h-full overflow-hidden">
                <div className="w-full md:w-[380px] bg-slate-800 border-r border-slate-700 h-full flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-slate-700 flex-shrink-0 animate-shimmer"><div className="h-6 bg-slate-700 rounded w-1/2"></div></div>
                    <div className="flex-1"><SOSListItemSkeleton /><SOSListItemSkeleton /><SOSListItemSkeleton /></div>
                </div>
                <div className="hidden md:block flex-1"><SOSDetailSkeleton /></div>
            </div>
        );
    }

    const alertListContent = (
        <div className={`w-full md:w-[380px] bg-slate-800 border-r border-slate-700 h-full flex-col flex-shrink-0 ${isMobileDetailVisible ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-700 flex-shrink-0"><p className="text-lg font-semibold text-slate-100">{alerts.filter(a => a.status === 'Active').length} active alerts</p></div>
            <div className="flex-1 overflow-y-auto">
                {sortedAlerts.length > 0 ? sortedAlerts.map((alert, index) => (
                    <button key={alert.id} onClick={() => handleSelectAlert(alert)}
                        className={`w-full text-left p-4 border-b border-slate-700/50 transition-colors ${alert.status === 'Active' ? 'animate-flash-red' : ''} ${selectedAlert?.id === alert.id ? 'bg-teal-900/40' : 'hover:bg-slate-700/50'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                                <img src={alert.user.profilePicture} alt={alert.user.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-slate-100">{alert.user.name}</p>
                                    <p className="text-xs text-slate-400">{alert.location.address}</p>
                                </div>
                            </div>
                            <StatusIndicator status={alert.status} />
                        </div>
                        <p className="text-right text-xs text-slate-500 mt-1">{timeSince(alert.timestamp)}</p>
                    </button>
                )) : (
                    <div className="flex items-center justify-center h-full text-center text-slate-400 p-4">
                        <div>
                            <CheckCircleIcon className="w-12 h-12 mx-auto text-slate-500" />
                            <h3 className="mt-2 text-lg font-semibold">No Active Alerts</h3>
                            <p>The SOS feed is currently clear.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
    
    return (
        <div className="md:flex h-full bg-slate-800/50 overflow-hidden">
            {alertListContent}
            
            {/* Desktop Detail View */}
            <div className="hidden md:block flex-1">
                {selectedAlert ? (
                    <SOSDetailPanel alert={selectedAlert} onAction={handleAction} />
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-slate-400">
                        <div>
                            <SOSIcon className="w-12 h-12 mx-auto text-slate-500"/>
                             <h3 className="mt-2 text-lg font-semibold">Select an alert</h3>
                            <p>Choose an alert from the list to view details.</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Mobile Sliding Detail View */}
            {isMobileDetailVisible && selectedAlert && (
                <div className="md:hidden fixed inset-0 z-20 bg-slate-800/50 animate-slideInFromRight">
                    <SOSDetailPanel alert={selectedAlert} onAction={handleAction} onBack={() => setMobileDetailVisible(false)} />
                </div>
            )}
        </div>
    );
};

export default SOSView;