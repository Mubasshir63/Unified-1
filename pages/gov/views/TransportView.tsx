
import React, { useMemo, useState, useEffect } from 'react';
import { DetailedReport, ReportStatus, StaffMember } from '../../../types';
import KpiCard from '../components/KpiCard';
import { TransportIcon, CheckCircleIcon, ChartBarIcon } from '../../../components/icons/NavIcons';
import GovtMap from '../components/GovtMap';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';
import DepartmentReportsTable from '../components/DepartmentReportsTable';

interface TransportViewProps {
    isLoading: boolean;
    issues: DetailedReport[];
    userLocation: { lat: number; lng: number };
    onSelectIssue: (issue: DetailedReport) => void;
}

const TransportView: React.FC<TransportViewProps> = ({ isLoading: initialIsLoading, issues, userLocation, onSelectIssue }) => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getTransportStaff().then(data => {
            setStaff(data);
            setIsDataLoading(false);
        });
    }, []);

    const isLoading = initialIsLoading || isDataLoading;

    const transportIssues = useMemo(() => {
        return issues.filter(issue => 
            issue.category.toLowerCase().includes('transport') ||
            issue.category.toLowerCase().includes('traffic') ||
            issue.category.toLowerCase().includes('parking') ||
            issue.category.toLowerCase().includes('bus') ||
            issue.category.toLowerCase().includes('road')
        );
    }, [issues]);

    const openTransportIssues = useMemo(() => transportIssues.filter(i => i.status !== ReportStatus.Resolved).length, [transportIssues]);

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
                <TransportIcon className="w-8 h-8 mr-3 text-blue-400"/>
                Transport Department Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Live Traffic Status" value="Moderate" icon={<ChartBarIcon />} color="yellow" />
                <KpiCard title="Public Transport On-Time" value="96%" icon={<CheckCircleIcon />} color="green" />
                <KpiCard title="Open Transport Issues" value={openTransportIssues} icon={<TransportIcon />} color="red" />
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 h-96 relative">
                    <h3 className="font-bold text-slate-200 mb-2 absolute top-3 left-3 z-10 bg-slate-900/50 p-2 rounded-lg">Live Vehicle & Issue Map</h3>
                    <div className="h-full rounded-lg overflow-hidden">
                        <GovtMap 
                            issues={transportIssues} 
                            onMarkerClick={onSelectIssue}
                            center={userLocation}
                        />
                    </div>
                </div>
                <div className="h-96">
                     <DepartmentReportsTable 
                        title="Citizen Traffic & Road Reports" 
                        issues={transportIssues} 
                        isLoading={isLoading} 
                    />
                </div>
            </div>

            <div>
                <StaffTable
                    title="Transport Staff"
                    data={staff}
                    columns={[
                        { header: 'Name', accessor: 'name' },
                        { header: 'Role', accessor: 'role' },
                        { header: 'Zone / Route', accessor: 'zone' },
                        { header: 'Contact', accessor: 'contact' },
                    ]}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default TransportView;
