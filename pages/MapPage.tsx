import React, { useEffect, useRef, useState, useMemo } from 'react';
import { type LocationData, type MapPoint, type DetailedReport, Page } from '../types';
import { 
    MyLocationIcon, 
    SearchIcon, 
    LayersIcon, 
    FireIcon, 
    HospitalIcon,
    FuelIcon,
    ShieldIcon,
    WaterLeakIcon
} from '../components/icons/NavIcons';
import ReportDetailModal from '../components/ReportDetailModal';
import { useTranslation } from '../hooks/useTranslation';
import { ReportStatus } from '../types';

declare const L: any;

const categoryIconPaths: Record<string, string> = {
    'Hospital': 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18',
    'Police': 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749',
    'Other': 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712',
};

const getMarkerIconHTML = (color: string, iconPath: string, isCritical: boolean) => `
  <div class="relative flex items-center justify-center scale-110">
    ${isCritical ? `<div class="absolute w-14 h-14 bg-${color}-500/30 rounded-full animate-ping"></div>` : ''}
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="50" viewBox="0 0 38 46" style="filter: drop-shadow(0 6px 12px rgba(0,0,0,0.3));">
        <path fill="${color}" stroke="#FFF" stroke-width="2.5" d="M19 44C19 44 37 26.3333 37 18C37 8.625 28.941 1 19 1C9.059 1 1 8.625 1 18C1 26.3333 19 44 19 44Z"/>
        <g transform="translate(8, 7) scale(0.85)">
            <path fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="${iconPath}"/>
        </g>
    </svg>
  </div>
`;

interface MapPageProps {
    userLocation: LocationData;
    reports: DetailedReport[];
    setCurrentPage: (page: Page) => void;
    filter: string | null;
    onClearFilter: () => void;
}

const MapPage: React.FC<MapPageProps> = ({ userLocation, reports, filter: initialFilter }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const markersLayer = useRef<any>(null);
    const heatmapLayer = useRef<any>(null);
    const { t } = useTranslation();

    const [activeFilter, setActiveFilter] = useState<string | null>(initialFilter);
    const [viewMode, setViewMode] = useState<'standard' | 'heatmap'>('standard');
    const [modalReport, setModalReport] = useState<DetailedReport | null>(null);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = L.map(mapContainer.current, {
            center: [userLocation.coords.lat, userLocation.coords.lng],
            zoom: 15,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CARTO'
        }).addTo(map.current);

        markersLayer.current = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 40,
            iconCreateFunction: (c: any) => L.divIcon({
                html: `<div class="w-11 h-11 bg-teal-600 border-4 border-white rounded-full flex items-center justify-center text-white font-black shadow-2xl"><span>${c.getChildCount()}</span></div>`,
                className: '',
                iconSize: [44, 44]
            })
        }).addTo(map.current);

        // User Marker
        const userIcon = L.divIcon({
            html: `<div class="relative w-10 h-10 flex items-center justify-center"><div class="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div><div class="w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-2xl"></div></div>`,
            className: '', iconSize: [40, 40],
        });
        L.marker([userLocation.coords.lat, userLocation.coords.lng], { icon: userIcon }).addTo(map.current);

        return () => { if(map.current) map.current.remove(); };
    }, []);

    useEffect(() => {
        if (!markersLayer.current) return;
        markersLayer.current.clearLayers();
        if (heatmapLayer.current) map.current.removeLayer(heatmapLayer.current);

        const displayed = activeFilter ? reports.filter(r => r.category === activeFilter) : reports;
        const heatPoints: [number, number, number][] = [];

        displayed.forEach(report => {
            const isCritical = report.priority === 'Critical';
            const color = report.status === ReportStatus.Resolved ? '#10b981' : isCritical ? '#ef4444' : '#3b82f6';
            const iconPath = categoryIconPaths[report.category] || categoryIconPaths['Other'];
            
            const marker = L.marker([report.coords.lat, report.coords.lng], {
                icon: L.divIcon({
                    html: getMarkerIconHTML(color, iconPath, isCritical),
                    className: '', iconSize: [42, 50], iconAnchor: [21, 50],
                })
            });
            marker.on('click', () => setModalReport(report));
            markersLayer.current.addLayer(marker);
            heatPoints.push([report.coords.lat, report.coords.lng, isCritical ? 1 : 0.5]);
        });

        if (viewMode === 'heatmap') {
            heatmapLayer.current = L.heatLayer(heatPoints, { radius: 25, gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' } }).addTo(map.current);
            markersLayer.current.eachLayer((l: any) => l.setOpacity(0.3));
        } else {
             markersLayer.current.eachLayer((l: any) => l.setOpacity(1));
        }
    }, [reports, activeFilter, viewMode]);

    return (
        <div className="h-full w-full relative bg-slate-50 overflow-hidden">
            <div ref={mapContainer} className="h-full w-full z-0" />

            {/* Top Search Overlay */}
            <div className="absolute top-4 left-4 right-4 z-[401] animate-fadeInUp">
                <div className="relative group shadow-2xl">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"><SearchIcon className="w-5 h-5"/></div>
                    <input type="text" placeholder="Search facilities or issue markers..." className="w-full pl-12 pr-12 py-4 rounded-3xl bg-white/90 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-4 focus:ring-teal-500/10 font-bold text-sm text-slate-800" />
                    <button onClick={() => setViewMode(viewMode === 'standard' ? 'heatmap' : 'standard')} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${viewMode === 'heatmap' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <FireIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Right Action Hub */}
            <div className="absolute top-24 right-4 z-[401] flex flex-col space-y-2">
                <button onClick={() => map.current?.flyTo([userLocation.coords.lat, userLocation.coords.lng], 16)} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-teal-600 border border-slate-100 transform active:scale-90 transition-all"><MyLocationIcon className="w-6 h-6"/></button>
                <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-400 border border-slate-100"><LayersIcon className="w-6 h-6"/></button>
            </div>

            {/* Bottom Quick Discovery Bar */}
            <div className="absolute bottom-20 left-4 right-4 z-[401]">
                <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                        { id: 'Hospital', icon: <HospitalIcon />, label: 'Hospitals', color: 'bg-red-500' },
                        { id: 'Police', icon: <ShieldIcon />, label: 'Police', color: 'bg-blue-500' },
                        { id: 'Fuel', icon: <FuelIcon />, label: 'Fuel', color: 'bg-orange-500' },
                        { id: 'Water', icon: <WaterLeakIcon />, label: 'Water', color: 'bg-cyan-500' },
                    ].map(btn => (
                        <button 
                            key={btn.id}
                            onClick={() => setActiveFilter(activeFilter === btn.id ? null : btn.id)}
                            className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-full backdrop-blur-md border transition-all ${activeFilter === btn.id ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' : 'bg-white/80 text-slate-700 border-white/50 shadow-md hover:bg-white'}`}
                        >
                            <span className={activeFilter === btn.id ? 'text-white' : btn.color.replace('bg-', 'text-')}>{React.cloneElement(btn.icon as React.ReactElement, { className: "w-4 h-4" })}</span>
                            <span className="text-xs font-black uppercase tracking-widest">{btn.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {modalReport && <ReportDetailModal report={modalReport} onClose={() => setModalReport(null)} />}
        </div>
    );
};

export default MapPage;