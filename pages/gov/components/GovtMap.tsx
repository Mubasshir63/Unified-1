
import React, { useEffect, useRef } from 'react';
import type { DetailedReport } from '../../../types';
import { ReportStatus } from '../../../types';

declare const L: any;

interface GovtMapProps {
  issues: DetailedReport[];
  onMarkerClick: (issue: DetailedReport) => void;
  center: { lat: number; lng: number };
  showHeatmap?: boolean;
}

const categoryIconPaths: Record<string, string> = {
    'Pothole / Road Damage': 'M10.5 3.75v16.5M6 3.75v16.5M15 3.75v16.5M3.75 10.5h16.5',
    'Roads & Infrastructure': 'M10.5 3.75v16.5M6 3.75v16.5M15 3.75v16.5M3.75 10.5h16.5',
    'Streetlight Outage': 'M9.75 17.25l4.5-.75-4.5-.75V3M9 5.25h6',
    'Garbage Dump': 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
    'Water Leakage': 'M12 21a9 9 0 00-9-9c0-1.631.51-3.155 1.38-4.425L12 3l7.62 4.575A9.006 9.006 0 0021 12a9 9 0 00-9 9z M12 15a3 3 0 100-6 3 3 0 000 6z',
    'Illegal Parking': 'M12 6v12m-3-6h6 M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25z',
    'Traffic Signal Issue': 'M9 6.75V15m6-6v8.25m.5-11.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V3.75z M3 8.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 8.25zM7.5 15.75a.75.75 0 001.5 0v-1.5a.75.75 0 00-1.5 0v1.5z',
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

const GovtMap: React.FC<GovtMapProps> = ({ issues, onMarkerClick, center, showHeatmap = false }) => {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any>(null);
    const heatmapLayerRef = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map('govt-map', { center: [center.lat, center.lng], zoom: 12, zoomControl: false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 20
        }).addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        
        markersRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;

        return () => { map.remove(); mapRef.current = null; };
    }, [center]);

    useEffect(() => {
        if (!mapRef.current || !markersRef.current) return;

        markersRef.current.clearLayers();
        const heatData: [number, number, number][] = [];

        issues.forEach(issue => {
            const iconPath = categoryIconPaths[issue.category] || categoryIconPaths['Other'];
            let color: string;

            if (issue.status === ReportStatus.Resolved) {
                color = '#16a34a'; // green-600
            } else if (issue.assigned_to) {
                color = '#f59e0b'; // amber-500 (yellow)
            } else { // New/unassigned
                color = '#ef4444'; // red-500
            }

            const iconHtml = getMarkerIconHTML(color, iconPath);
            const icon = L.divIcon({
                html: iconHtml,
                className: '',
                iconSize: [38, 46],
                iconAnchor: [19, 46],
                popupAnchor: [0, -46]
            });

            const marker = L.marker([issue.coords.lat, issue.coords.lng], { icon });
            marker.on('click', () => onMarkerClick(issue));
            markersRef.current.addLayer(marker);

            heatData.push([issue.coords.lat, issue.coords.lng, 0.5]); // lat, lng, intensity
        });
        
        // Handle heatmap layer
        if (showHeatmap) {
            if (!heatmapLayerRef.current) {
                heatmapLayerRef.current = L.heatLayer(heatData, { radius: 25, gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'} });
            } else {
                heatmapLayerRef.current.setLatLngs(heatData);
            }
            if (!mapRef.current.hasLayer(heatmapLayerRef.current)) {
                mapRef.current.addLayer(heatmapLayerRef.current);
            }
            markersRef.current.eachLayer((layer: any) => {
                layer.setOpacity(0.3);
            });
        } else {
            if (heatmapLayerRef.current && mapRef.current.hasLayer(heatmapLayerRef.current)) {
                mapRef.current.removeLayer(heatmapLayerRef.current);
            }
             markersRef.current.eachLayer((layer: any) => {
                layer.setOpacity(1);
            });
        }

    }, [issues, onMarkerClick, showHeatmap]);

    return <div id="govt-map" className="h-full w-full rounded-lg" />;
};

export default GovtMap;
