

import React, { useState, useMemo } from 'react';
import { DetailedReport, ReportStatus } from '../../../types';
import GovtMap from '../components/GovtMap';
import { FireIcon } from '../../../components/icons/NavIcons';

interface MapViewProps {
    issues: DetailedReport[];
    onSelectIssue: (issue: DetailedReport) => void;
    userLocation: { lat: number; lng: number };
    isLoading: boolean;
}

const MapView: React.FC<MapViewProps> = ({ issues, onSelectIssue, userLocation, isLoading }) => {
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'Low' | 'Medium' | 'High' | 'Critical'>('all');
    const [showHeatmap, setShowHeatmap] = useState(false);

    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
            if (priorityFilter !== 'all' && (issue.priority || 'Low') !== priorityFilter) return false;
            return true;
        });
    }, [issues, statusFilter, priorityFilter]);

    if (isLoading) {
        return (
            <div className="h-full w-full relative animate-shimmer">
                <div className="absolute top-4 left-4 z-[401] p-3 rounded-lg flex items-center space-x-3">
                    <div className="h-10 w-36 bg-gray-200 rounded-md"></div>
                    <div className="h-10 w-36 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-full w-full bg-gray-200"></div>
            </div>
        );
    }
    
    return (
        <div className="h-full w-full relative">
            <div className="absolute top-4 left-4 z-[401] bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center space-x-3">
                 <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-white border-gray-300 rounded-md shadow-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500">
                     <option value="all">All Statuses</option>
                     <option value={ReportStatus.UnderReview}>Under Review</option>
                     <option value={ReportStatus.Resolved}>Resolved</option>
                </select>
                <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)} className="bg-white border-gray-300 rounded-md shadow-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="all">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <button 
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`p-2 rounded-md shadow-sm flex items-center space-x-2 text-sm font-semibold transition-colors ${showHeatmap ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                    <FireIcon className="w-5 h-5"/>
                    <span>Heatmap</span>
                </button>
            </div>
            <GovtMap 
                issues={filteredIssues} 
                onMarkerClick={onSelectIssue} 
                center={userLocation}
                showHeatmap={showHeatmap}
            />
        </div>
    );
};

export default MapView;
