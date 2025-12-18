import React, { useEffect, useRef, useState, useMemo } from 'react';
import { type LocationData, type MapPoint, type DetailedReport, Page } from '../types';
import { 
    MyLocationIcon, 
    SearchIcon, 
    LocationMarkerIcon, 
    LayersIcon, 
    BuildingOfficeIcon, 
    CheckIcon, 
    FireIcon, 
    TrafficConeIcon,
    HospitalIcon,
    FuelIcon,
    WrenchIcon
} from '../components/icons/NavIcons';
import { MAP_POINTS } from '../data/mapData';
import ReportDetailModal from '../components/ReportDetailModal';
import { useTranslation } from '../hooks/useTranslation';
import { ReportStatus } from '../types';

declare const L: any;

const categoryIconPaths: Record<string, string> = {
    'Pothole / Road Damage': 'M10.5 3.75v16.5M6 3.75v16.5M15 3.75v16.5M3.75 10.5h16.5',
    'Roads & Infrastructure': 'M10.5 3.75v16.5M6 3.75v16.5M15 3.75v16.5M3.75 10.5h16.5',
    'Streetlight Outage': 'M9.75 17.25l4.5-.75-4.5-.75V3M9 5.25h6',
    'Garbage Dump': 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
    'Water Leakage': 'M12 21a9 9 0 00-9-9c0-1.631.51-3.155 1.38-4.425L12 3l7.62 4.575A9.006 9.006 0 0021 12a9 9 0 00-9 9z M12 15a3 3 0 100-6 3 3 0 000 6z',
    'Illegal Parking': 'M12 6v12m-3-6h6 M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25z',
    'Traffic Signal Issue': 'M9 6.75V15m6-6v8.25m.5-11.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V3.75z M3 8.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 8.25zM7.5 15.75a.75.75 0 001.5 0v-1.5a.75.75 0 00-1.5 0v1.5z',
    'Hospital': 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3 1.091',
    'Police Station': 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z',
    'Transport Hub': 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z M14 6h2l3 4v6h-2 M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z',
    'Court': 'M12 3v18m-6-3h12M4.5 9h15 M3.75 21V3 M20.25 21V3',
    'Pharmacy': 'M12 8v4m0 0v4m0-4h4m-4 0H8 M19.5 12c0-5.25-4.25-9.5-9.5-9.5S.5 6.75.5 12s4.25 9.5 9.5 9.5 9.5-4.25 9.5-9.5z',
    'Sanitary Pad Dispenser': 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25V21',
    'Petrol Bunk': 'M7.5 7.5h-1A1.5 1.5 0 005 9v10.5A1.5 1.5 0 006.5 21h1A1.5 1.5 0 009 19.5V9A1.5 1.5 0 007.5 7.5zm5.625-1.5c.375-.375.375-.982 0-1.357l-1.143-1.143c-.375-.375-.982-.375-1.357 0L9 5.25v13.5h3.75l2.625-2.625z M15 15.75l.75-.75a.982.982 0 011.357 0l1.143 1.143c.375.375.375.982 0 1.357l-.75.75M15 15.75l-2.625 2.625',
    'Mechanic': 'M11.25 10.5c.418.418.418 1.096 0 1.514l-4.243 4.242a1.071 1.071 0 01-1.515 0l-1.515-1.515a1.071 1.071 0 010-1.515l4.243-4.242a1.071 1.071 0 011.515 0zm.015-4.485c1.172-1.172 3.071-1.172 4.243 0l.757.757a3 3 0 010 4.243l-4.242 4.242a3 3 0 01-4.243 0l-.757-.757c-1.172-1.172-1.172-3.071 0-4.243l4.242-4.242z',
    'Ration Shop': 'M12 3v18m0-18l-3 3m3-3l3 3M4.5 12h15M6 16.5l3.75-3.75M18 16.5l-3.75-3.75',
    'Govt Office': 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25V21',
    'Other': 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z',
};

const getMarkerIconHTML = (color: string, iconPath: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="46" viewBox="0 0 38 46" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
    <path fill="${color}" stroke="#FFF" stroke-width="2" d="M19 44C19 44 37 26.3333 37 18C37 8.625 28.941 1 19 1C9.059 1 1 8.625 1 18C1 26.3333 19 44 19 44Z"/>
    <g transform="translate(7, 6) scale(0.9)">
        <path fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="${iconPath}"/>
    </g>
  </svg>
`;

const facilityCategoryGroups = {
    medical: ['Hospital', 'Pharmacy'],
    transport: ['Transport Hub', 'Petrol Bunk'],
    mechanic: ['Mechanic'],
    civic: ['Police Station', 'Court', 'Govt Office', 'Ration Shop', 'Sanitary Pad Dispenser'],
};

const getFacilityGroup = (category: string): keyof typeof facilityCategoryGroups | null => {
    for (const group in facilityCategoryGroups) {
        if ((facilityCategoryGroups as any)[group].includes(category)) {
            return group as keyof typeof facilityCategoryGroups;
        }
    }
    return null;
};

interface MapPageProps {
    userLocation: LocationData;
    reports: DetailedReport[];
    setCurrentPage: (page: Page) => void;
    filter: string | null;
    onClearFilter: () => void;
}

const MapPage: React.FC<MapPageProps> = ({ userLocation, reports, setCurrentPage, filter, onClearFilter }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const issuesClusterLayer = useRef<any>(null);
    const medicalClusterLayer = useRef<any>(null);
    const transportClusterLayer = useRef<any>(null);
    const mechanicClusterLayer = useRef<any>(null);
    const civicClusterLayer = useRef<any>(null);
    const heatmapLayer = useRef<any>(null);
    const streetLayerRef = useRef<any>(null);
    const satelliteLayerRef = useRef<any>(null);
    const trafficLayerRef = useRef<any>(null);
    const markersMapRef = useRef<Map<string, any>>(new Map());

    const { t } = useTranslation();

    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const [modalReport, setModalReport] = useState<DetailedReport | null>(null);
    const [baseLayer, setBaseLayer] = useState<'street' | 'satellite'>('street');
    const [layerVisibility, setLayerVisibility] = useState({
        issues: true,
        medical: true,
        transport: true,
        mechanic: true,
        civic: true,
        heatmap: false,
        traffic: false
    });
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    const allPoints = useMemo(() => {
        const reportPoints: MapPoint[] = reports.map(report => ({
            id: `report-${report.id}`,
            type: report.status === ReportStatus.Resolved ? 'resolved' : 'issue',
            coords: report.coords,
            details: report
        }));
        const facilityPoints: MapPoint[] = MAP_POINTS.filter(p => p.type === 'facility');
        return [...reportPoints, ...facilityPoints];
    }, [reports]);

    const displayedPoints = useMemo(() => {
        return allPoints.filter(p => {
            if (filter && p.details.category !== filter) return false;

            if (p.type === 'issue' || p.type === 'resolved') {
                if (statusFilter !== 'all' && p.details.status !== statusFilter) return false;
                if (priorityFilter !== 'all' && (p.details.priority || 'Low') !== priorityFilter) return false;
            }
            
            return true;
        });
    }, [allPoints, filter, statusFilter, priorityFilter]);

    const handleReportIssueFromFacility = (facilityDetails: DetailedReport) => {
        const prefilledData = {
            category: `Issue with: ${facilityDetails.title}`,
            coords: facilityDetails.coords,
            linkedFacilityId: facilityDetails.id,
        };
        sessionStorage.setItem('prefilledReportData', JSON.stringify(prefilledData));
        setCurrentPage(Page.Report);
    };

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = L.map(mapContainer.current, {
            center: [userLocation.coords.lat, userLocation.coords.lng],
            zoom: 14,
            zoomControl: false,
        });

        map.current.on('click', () => {
            setIsLayersPanelOpen(false);
        });

        streetLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        });
        satelliteLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
        });
        
        streetLayerRef.current.addTo(map.current);
        L.control.scale({ imperial: false }).addTo(map.current);


        const userIcon = L.divIcon({
            html: `<div class="user-location-pulse"></div><div class="user-location-dot"></div>`,
            className: 'user-location-container',
            iconSize: [40, 40],
        });

        L.marker([userLocation.coords.lat, userLocation.coords.lng], { icon: userIcon }).addTo(map.current);

        const mockTraffic = [
            L.polyline([[13.08, 80.27], [13.09, 80.28], [13.085, 80.285]], { color: '#d32f2f', weight: 4, opacity: 0.75 }), // Red
            L.polyline([[13.06, 80.25], [13.07, 80.26]], { color: '#fbc02d', weight: 4, opacity: 0.75 }), // Yellow
            L.polyline([[28.63, 77.21], [28.635, 77.22]], { color: '#388e3c', weight: 4, opacity: 0.75 }), // Green
            L.polyline([[28.61, 77.20], [28.615, 77.205], [28.62, 77.21]], { color: '#d32f2f', weight: 4, opacity: 0.75 }), // Red
        ];
        trafficLayerRef.current = L.layerGroup(mockTraffic);

        issuesClusterLayer.current = L.markerClusterGroup();
        medicalClusterLayer.current = L.markerClusterGroup();
        transportClusterLayer.current = L.markerClusterGroup();
        mechanicClusterLayer.current = L.markerClusterGroup();
        civicClusterLayer.current = L.markerClusterGroup();

        map.current.addLayer(issuesClusterLayer.current);
        map.current.addLayer(medicalClusterLayer.current);
        map.current.addLayer(transportClusterLayer.current);
        map.current.addLayer(mechanicClusterLayer.current);
        map.current.addLayer(civicClusterLayer.current);
        
        return () => { if(map.current) { map.current.remove(); map.current = null; } };
    }, [userLocation.coords]);
    
    useEffect(() => {
        if (!map.current) return;
        if (baseLayer === 'street') {
            if (map.current.hasLayer(satelliteLayerRef.current)) {
                map.current.removeLayer(satelliteLayerRef.current);
            }
            map.current.addLayer(streetLayerRef.current);
        } else {
            if (map.current.hasLayer(streetLayerRef.current)) {
                map.current.removeLayer(streetLayerRef.current);
            }
            map.current.addLayer(satelliteLayerRef.current);
        }
    }, [baseLayer]);

    useEffect(() => {
        if (!map.current) return;

        // Issues
        if (layerVisibility.issues && !map.current.hasLayer(issuesClusterLayer.current)) {
            map.current.addLayer(issuesClusterLayer.current);
        } else if (!layerVisibility.issues && map.current.hasLayer(issuesClusterLayer.current)) {
            map.current.removeLayer(issuesClusterLayer.current);
        }
        
        // Facilities
        if (layerVisibility.medical && !map.current.hasLayer(medicalClusterLayer.current)) map.current.addLayer(medicalClusterLayer.current);
        else if (!layerVisibility.medical && map.current.hasLayer(medicalClusterLayer.current)) map.current.removeLayer(medicalClusterLayer.current);

        if (layerVisibility.transport && !map.current.hasLayer(transportClusterLayer.current)) map.current.addLayer(transportClusterLayer.current);
        else if (!layerVisibility.transport && map.current.hasLayer(transportClusterLayer.current)) map.current.removeLayer(transportClusterLayer.current);

        if (layerVisibility.mechanic && !map.current.hasLayer(mechanicClusterLayer.current)) map.current.addLayer(mechanicClusterLayer.current);
        else if (!layerVisibility.mechanic && map.current.hasLayer(mechanicClusterLayer.current)) map.current.removeLayer(mechanicClusterLayer.current);

        if (layerVisibility.civic && !map.current.hasLayer(civicClusterLayer.current)) map.current.addLayer(civicClusterLayer.current);
        else if (!layerVisibility.civic && map.current.hasLayer(civicClusterLayer.current)) map.current.removeLayer(civicClusterLayer.current);


        // Heatmap
        if (layerVisibility.heatmap) {
            if (!heatmapLayer.current) {
                const heatData = allPoints.filter(p => p.type === 'issue').map(p => [p.coords.lat, p.coords.lng, 0.5]);
                heatmapLayer.current = L.heatLayer(heatData, { radius: 25 });
            }
            if (!map.current.hasLayer(heatmapLayer.current)) {
                map.current.addLayer(heatmapLayer.current);
            }
        } else if (!layerVisibility.heatmap && heatmapLayer.current && map.current.hasLayer(heatmapLayer.current)) {
            map.current.removeLayer(heatmapLayer.current);
        }
        
        // Traffic
        if (layerVisibility.traffic && !map.current.hasLayer(trafficLayerRef.current)) {
            map.current.addLayer(trafficLayerRef.current);
        } else if (!layerVisibility.traffic && map.current.hasLayer(trafficLayerRef.current)) {
            map.current.removeLayer(trafficLayerRef.current);
        }
    }, [layerVisibility, allPoints]);

    useEffect(() => {
        if (!map.current || !issuesClusterLayer.current || !medicalClusterLayer.current || !transportClusterLayer.current || !mechanicClusterLayer.current || !civicClusterLayer.current) return;

        issuesClusterLayer.current.clearLayers();
        medicalClusterLayer.current.clearLayers();
        transportClusterLayer.current.clearLayers();
        mechanicClusterLayer.current.clearLayers();
        civicClusterLayer.current.clearLayers();
        markersMapRef.current.clear();

        const heatData: [number, number, number][] = [];

        displayedPoints.forEach(point => {
            const category = point.details.category;
            const iconPath = categoryIconPaths[category] || categoryIconPaths['Other'];
            let color: string;

            if (point.type === 'facility') {
                color = '#1d4ed8'; // blue-700
            } else {
                const { status, assigned_to } = point.details;
                if (status === ReportStatus.Resolved) {
                    color = '#16a34a'; // green-600
                } else if (status === ReportStatus.UnderReview && assigned_to) {
                    color = '#f59e0b'; // amber-500 (yellow)
                } else { // New/unassigned
                    color = '#ef4444'; // red-500
                }
            }

            const iconHtml = getMarkerIconHTML(color, iconPath);
            const markerIcon = L.divIcon({
                html: iconHtml,
                className: `marker-3d ${point.details.priority === 'Critical' ? 'critical' : ''}`,
                iconSize: [38, 46],
                iconAnchor: [19, 46],
            });
            
            const marker = L.marker([point.coords.lat, point.coords.lng], { icon: markerIcon });
            
            let popupContent = `
                <div>
                    <h3 class="popup-title">${point.details.title}</h3>
                    <p class="popup-subtitle">${point.details.category} - ${point.details.status}</p>
            `;

            if(point.type === 'facility'){
                popupContent += `<button id="report-issue-${point.id}" class="popup-report-issue-btn">Report Issue</button>`;
            } else {
                popupContent += `<button id="view-details-${point.id}" class="popup-view-details-btn">View Details</button>`;
            }
            popupContent += `</div>`;

            marker.bindPopup(popupContent);

            marker.on('popupopen', () => {
                const viewBtn = document.getElementById(`view-details-${point.id}`);
                if (viewBtn) {
                    viewBtn.onclick = () => {
                        setModalReport(point.details);
                        map.current.closePopup();
                    };
                }
                const reportBtn = document.getElementById(`report-issue-${point.id}`);
                 if (reportBtn) {
                    reportBtn.onclick = () => {
                        handleReportIssueFromFacility(point.details);
                        map.current.closePopup();
                    };
                }
            });

            markersMapRef.current.set(point.id, marker);
            
            if (point.type === 'issue' || point.type === 'resolved') {
                issuesClusterLayer.current.addLayer(marker);
                if (point.type === 'issue') {
                    heatData.push([point.coords.lat, point.coords.lng, 0.5]); // lat, lng, intensity
                }
            } else if (point.type === 'facility') {
                const group = getFacilityGroup(point.details.category);
                switch(group) {
                    case 'medical': medicalClusterLayer.current.addLayer(marker); break;
                    case 'transport': transportClusterLayer.current.addLayer(marker); break;
                    case 'mechanic': mechanicClusterLayer.current.addLayer(marker); break;
                    case 'civic': civicClusterLayer.current.addLayer(marker); break;
                    default: break;
                }
            }
        });

        if (heatmapLayer.current) {
            heatmapLayer.current.setLatLngs(heatData);
        }
    }, [displayedPoints]);

    const searchResults = useMemo(() => {
        if (localSearchQuery.length < 2) return [];
        return allPoints.filter(p => p.details.title.toLowerCase().includes(localSearchQuery.toLowerCase()));
    }, [localSearchQuery, allPoints]);
    
    const handleFlyTo = (point: MapPoint) => {
        if (map.current) {
            map.current.flyTo([point.coords.lat, point.coords.lng], 17, {
                animate: true,
                duration: 1.5,
            });
            const marker = markersMapRef.current.get(point.id);
            if (marker) {
                setTimeout(() => {
                    marker.openPopup();
                }, 1600);
            }
            setLocalSearchQuery('');
            setIsSearchFocused(false);
        }
    };

    const LayerToggleButton: React.FC<{label: string, layerKey: keyof typeof layerVisibility, icon: React.ReactNode}> = ({ label, layerKey, icon }) => (
        <button onClick={() => setLayerVisibility(prev => ({ ...prev, [layerKey]: !prev[layerKey] }))}
            className={`w-full flex items-center p-2 rounded-lg transition-colors ${layerVisibility[layerKey] ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-100'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${layerVisibility[layerKey] ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {icon}
            </div>
            <span className="font-semibold text-sm">{label}</span>
            {layerVisibility[layerKey] && <CheckIcon className="ml-auto text-teal-600" />}
        </button>
    );
    
    const BaseLayerButton: React.FC<{label: string, layerKey: typeof baseLayer, isActive: boolean}> = ({ label, layerKey, isActive }) => (
        <button onClick={() => setBaseLayer(layerKey)} className={`flex-1 p-2 rounded-md text-sm font-semibold transition-colors ${isActive ? 'bg-teal-500 text-white shadow-sm' : 'hover:bg-gray-100 text-gray-700'}`}>
            {label}
        </button>
    );

    const FilterButton: React.FC<{label: string, filterKey: string, activeFilter: string, setFilter: (val: string) => void}> = ({label, filterKey, activeFilter, setFilter}) => (
        <button onClick={() => setFilter(filterKey)} className={`flex-1 p-2 rounded-md text-xs font-semibold transition-colors ${activeFilter === filterKey ? 'bg-teal-500 text-white shadow-sm' : 'hover:bg-gray-100 text-gray-700'}`}>
            {label}
        </button>
    );

    return (
        <div className="h-full w-full relative">
            <div ref={mapContainer} className="h-full w-full bg-gray-200" />

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[401] w-[95%] max-w-lg">
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"><SearchIcon className="w-5 h-5"/></div>
                    <input type="text" placeholder={t('searchPlaceholder')}
                        className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={localSearchQuery} onChange={e => setLocalSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    />
                </div>
                {isSearchFocused && searchResults.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg mt-2 max-h-60 overflow-y-auto animate-fadeInUp" style={{animationDuration: '200ms'}}>
                        {searchResults.map(point => (
                            <button key={point.id} onClick={() => handleFlyTo(point)} className="w-full text-left flex items-center p-3 hover:bg-gray-100 border-b last:border-b-0">
                                <LocationMarkerIcon className="mr-3 text-gray-500" />
                                <div>
                                    <p className="font-semibold text-sm">{point.details.title}</p>
                                    <p className="text-xs text-gray-500">{point.details.location}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {filter && (
                 <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[401]">
                     <button onClick={onClearFilter} className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-gray-800 flex items-center space-x-2">
                         <span>Showing: <strong>{filter}</strong></span>
                         <span className="text-red-500 font-bold">&times;</span>
                     </button>
                 </div>
            )}

            <div className="map-fab-container">
                <button onClick={(e) => { e.stopPropagation(); setIsLayersPanelOpen(prev => !prev); }} className="map-fab" aria-label="Toggle Layers"><LayersIcon/></button>
                <button onClick={() => map.current?.flyTo([userLocation.coords.lat, userLocation.coords.lng], 14)} className="map-fab" aria-label="Center map"><MyLocationIcon /></button>
            </div>
            
            {isLayersPanelOpen && (
                 <div onClick={e => e.stopPropagation()} className="absolute bottom-[128px] right-4 z-[401] bg-white p-2 rounded-xl shadow-lg w-72 animate-fadeInUp" style={{animationDuration: '200ms'}}>
                    <h3 className="font-bold text-gray-800 p-2">Map Style</h3>
                    <div className="p-1 bg-gray-200 rounded-lg flex items-center space-x-1 mb-2">
                        <BaseLayerButton label="Street" layerKey="street" isActive={baseLayer === 'street'} />
                        <BaseLayerButton label="Satellite" layerKey="satellite" isActive={baseLayer === 'satellite'} />
                    </div>
                    <div className="border-t my-2"></div>

                    <h3 className="font-bold text-gray-800 p-2">Issue Filters</h3>
                    <div className="px-2">
                        <label className="text-xs font-semibold text-gray-500">Status</label>
                        <div className="p-1 bg-gray-200 rounded-lg flex items-center space-x-1 mb-2">
                            <FilterButton label="All" filterKey="all" activeFilter={statusFilter} setFilter={setStatusFilter} />
                            <FilterButton label="In Review" filterKey={ReportStatus.UnderReview} activeFilter={statusFilter} setFilter={setStatusFilter} />
                            <FilterButton label="Resolved" filterKey={ReportStatus.Resolved} activeFilter={statusFilter} setFilter={setStatusFilter} />
                        </div>
                        <label className="text-xs font-semibold text-gray-500">Priority</label>
                        <div className="p-1 bg-gray-200 rounded-lg grid grid-cols-3 gap-1 mb-2">
                            <FilterButton label="All" filterKey="all" activeFilter={priorityFilter} setFilter={setPriorityFilter} />
                            <FilterButton label="Critical" filterKey="Critical" activeFilter={priorityFilter} setFilter={setPriorityFilter} />
                            <FilterButton label="High" filterKey="High" activeFilter={priorityFilter} setFilter={setPriorityFilter} />
                            <FilterButton label="Medium" filterKey="Medium" activeFilter={priorityFilter} setFilter={setPriorityFilter} />
                            <FilterButton label="Low" filterKey="Low" activeFilter={priorityFilter} setFilter={setPriorityFilter} />
                        </div>
                    </div>
                    <div className="border-t my-2"></div>
                    
                    <h3 className="font-bold text-gray-800 p-2">Points of Interest</h3>
                    <LayerToggleButton layerKey="medical" label="Medical" icon={<HospitalIcon className="w-5 h-5"/>}/>
                    <LayerToggleButton layerKey="transport" label="Transport & Fuel" icon={<FuelIcon className="w-5 h-5"/>}/>
                    <LayerToggleButton layerKey="mechanic" label="Mechanics" icon={<WrenchIcon className="w-5 h-5"/>}/>
                    <LayerToggleButton layerKey="civic" label="Civic Services" icon={<BuildingOfficeIcon className="w-5 h-5"/>}/>
                    <div className="border-t my-2"></div>

                    <h3 className="font-bold text-gray-800 p-2">Overlays</h3>
                    <LayerToggleButton layerKey="issues" label="All Issues" icon={<TrafficConeIcon className="w-5 h-5"/>}/>
                    <LayerToggleButton layerKey="heatmap" label="Digital Twin" icon={<FireIcon className="w-5 h-5"/>}/>
                    <LayerToggleButton layerKey="traffic" label="Traffic" icon={<TrafficConeIcon className="w-5 h-5"/>}/>
                 </div>
            )}
            
            {modalReport && <ReportDetailModal report={modalReport} onClose={() => setModalReport(null)} />}
        </div>
    );
};

export default MapPage;