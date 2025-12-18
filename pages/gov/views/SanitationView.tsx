
import React, { useMemo, useState, useEffect } from 'react';
import { DetailedReport, ReportStatus, StaffMember } from '../../../types';
import KpiCard from '../components/KpiCard';
import { WasteTrackerIcon, CheckCircleIcon, ChartBarIcon } from '../../../components/icons/NavIcons';
import GovtMap from '../components/GovtMap';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';
import DepartmentReportsTable from '../components/DepartmentReportsTable';

interface SanitationViewProps {
    isLoading: boolean;
    issues: DetailedReport[];
    userLocation: { lat: number; lng: number };
    onSelectIssue: (issue: DetailedReport) => void;
}

// New Component: Smart Bin Level
const SmartBinCard: React.FC<{ id: string; level: number; location: string }> = ({ id, level, location }) => {
    let color = 'bg-green-500';
    if (level > 50) color = 'bg-yellow-500';
    if (level > 80) color = 'bg-red-500';

    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
            <div className="h-16 w-6 bg-gray-200 rounded-full relative overflow-hidden border border-gray-300">
                <div 
                    className={`absolute bottom-0 left-0 w-full transition-all duration-500 ${color}`} 
                    style={{ height: `${level}%` }}
                ></div>
            </div>
            <div>
                <p className="font-bold text-gray-700 text-sm">{id}</p>
                <p className="text-xs text-gray-500">{location}</p>
                <p className={`text-xs font-bold mt-1 ${level > 80 ? 'text-red-600' : 'text-green-600'}`}>{level}% Full</p>
            </div>
        </div>
    );
};

const SanitationView: React.FC<SanitationViewProps> = ({ isLoading: initialIsLoading, issues, userLocation, onSelectIssue }) => {
    const [workers, setWorkers] = useState<StaffMember[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getSanitationWorkers().then(data => {
            setWorkers(data);
            setIsDataLoading(false);
        });
    }, []);

    const isLoading = initialIsLoading || isDataLoading;
    
    const sanitationIssues = useMemo(() => {
        return issues.filter(issue => 
            issue.category.toLowerCase().includes('sanitation') ||
            issue.category.toLowerCase().includes('garbage') ||
            issue.category.toLowerCase().includes('waste')
        );
    }, [issues]);
    
    const openSanitationIssues = useMemo(() => sanitationIssues.filter(i => i.status !== ReportStatus.Resolved).length, [sanitationIssues]);

    // Mock Smart Bins
    const smartBins = [
        { id: 'BIN-01', level: 85, location: 'Market Circle' },
        { id: 'BIN-02', level: 30, location: 'Park Gate' },
        { id: 'BIN-03', level: 92, location: 'Main Bus Stand' },
        { id: 'BIN-04', level: 45, location: 'Sector 4' },
    ];

     if (isLoading) {
        return (
            <div className="p-4 md:p-6 space-y-6">
                 <div className="h-8 bg-slate-700 rounded w-1/4 animate-shimmer"></div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-24 bg-slate-700 rounded-xl animate-shimmer"></div>
                    <div className="h-24 bg-slate-700 rounded-xl animate-shimmer"></div>
                    <div className="h-24 bg-slate-700 rounded-xl animate-shimmer"></div>
                </div>
                <div className="h-96 bg-slate-700 rounded-xl animate-shimmer"></div>
            </div>
        );
    }
    
    return (
         <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <WasteTrackerIcon className="w-8 h-8 mr-3 text-yellow-400"/>
                Sanitation Department Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Waste Collected (Today)" value="2.5 Tonnes" icon={<WasteTrackerIcon />} color="blue" />
                <KpiCard title="Collection Trucks on Route" value="48/55" icon={<ChartBarIcon />} color="yellow" />
                <KpiCard title="Open Sanitation Cases" value={openSanitationIssues} icon={<CheckCircleIcon />} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 h-96 relative">
                    <h3 className="font-bold text-slate-200 mb-2 absolute top-3 left-3 z-10 bg-slate-900/50 p-2 rounded-lg">Live Garbage Truck & Issue Map</h3>
                    <div className="h-full rounded-lg overflow-hidden">
                        <GovtMap 
                            issues={sanitationIssues} 
                            onMarkerClick={onSelectIssue}
                            center={userLocation}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-6 h-96">
                    {/* Smart Bins Feature */}
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1 overflow-hidden">
                        <h3 className="font-bold text-slate-200 mb-3 flex items-center"><WasteTrackerIcon className="w-5 h-5 mr-2"/> Live Smart Bin Levels</h3>
                        <div className="grid grid-cols-2 gap-3 overflow-y-auto">
                            {smartBins.map(bin => <SmartBinCard key={bin.id} {...bin} />)}
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <DepartmentReportsTable 
                            title="Reported Sanitation Issues" 
                            issues={sanitationIssues} 
                            isLoading={isLoading} 
                        />
                    </div>
                </div>
            </div>
             
            <div>
                <StaffTable
                    title="Sanitation Workforce"
                    data={workers}
                    columns={[
                        { header: 'Name', accessor: 'name' },
                        { header: 'Role', accessor: 'role' },
                        { header: 'Zone', accessor: 'zone' },
                        { header: 'Contact', accessor: 'contact' },
                    ]}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default SanitationView;