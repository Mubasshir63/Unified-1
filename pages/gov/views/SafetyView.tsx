
import React, { useState, useEffect, useMemo } from 'react';
import { DetailedReport, ReportStatus, SOSAlert, PoliceOfficer } from '../../../types';
import KpiCard from '../components/KpiCard';
import { ShieldIcon, SOSIcon, ChartBarIcon, CheckCircleIcon, ExclamationTriangleIcon } from '../../../components/icons/NavIcons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';
import DepartmentReportsTable from '../components/DepartmentReportsTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface SafetyViewProps {
    isLoading: boolean;
    alerts: SOSAlert[];
    issues: DetailedReport[];
}

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false, labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };
const barChartOptions = { ...chartOptions, scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, grid: { display: false } } } };

const incidentsByTypeData = {
    labels: ['Theft', 'Traffic', 'Assault', 'Noise', 'Other'],
    datasets: [{ label: 'Incidents', data: [22, 45, 8, 31, 15], backgroundColor: 'rgba(34, 197, 94, 0.6)', borderColor: '#22c55e', borderWidth: 2 }],
};

const dailyIncidentsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Incidents', data: [15, 18, 12, 20, 25, 30, 22], borderColor: '#38bdf8', tension: 0.4 }],
};

const PredictiveHotspotCard: React.FC<{ location: string, risk: string, time: string }> = ({ location, risk, time }) => (
    <div className="bg-slate-900 p-3 rounded-lg border border-slate-600 flex items-center justify-between">
        <div>
            <p className="font-bold text-slate-200 text-sm">{location}</p>
            <p className="text-xs text-slate-400">Expected Peak: {time}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${risk === 'High' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
            {risk} Risk
        </span>
    </div>
);

const SafetyView: React.FC<SafetyViewProps> = ({ isLoading: initialIsLoading, alerts, issues }) => {
    const [officers, setOfficers] = useState<PoliceOfficer[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getPoliceOfficers().then(data => {
            setOfficers(data);
            setIsDataLoading(false);
        });
    }, []);

    const isLoading = initialIsLoading || isDataLoading;
    
    const safetyIssues = useMemo(() => {
        return issues.filter(issue => 
            issue.category.toLowerCase().includes('safety') ||
            issue.category.toLowerCase().includes('police') ||
            issue.category.toLowerCase().includes('crime') ||
            issue.category.toLowerCase().includes('theft') ||
            issue.category.toLowerCase().includes('assault') ||
            issue.category.toLowerCase().includes('noise') ||
            issue.category.toLowerCase().includes('suspicious')
        );
    }, [issues]);

    const openSafetyReports = useMemo(() => safetyIssues.filter(i => i.status !== ReportStatus.Resolved).length, [safetyIssues]);

    if (isLoading) return <div className="p-6 h-full w-full animate-shimmer bg-slate-800 rounded-xl"></div>;
    
     return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <ShieldIcon className="w-8 h-8 mr-3 text-blue-400"/>
                Safety & Police Department
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Active SOS Alerts" value={alerts.filter(a => a.status === 'Active').length} icon={<SOSIcon />} color="red" />
                <KpiCard title="Patrol Units Deployed" value="82" icon={<ShieldIcon className="w-6 h-6"/>} color="blue" />
                <KpiCard title="Open Safety Reports" value={openSafetyReports} icon={<ChartBarIcon />} color="yellow" />
                <KpiCard title="Cases Closed (24h)" value="56" icon={<CheckCircleIcon />} color="green" />
            </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-80 lg:col-span-2">
                    <h3 className="font-bold text-slate-200 mb-2">Daily Incident Trend</h3>
                    <div className="h-64"><Line options={chartOptions} data={dailyIncidentsData} /></div>
                </div>
                {/* New Predictive Safety Feature */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-80 overflow-hidden flex flex-col">
                    <h3 className="font-bold text-slate-200 mb-3 flex items-center"><ExclamationTriangleIcon className="w-5 h-5 mr-2 text-orange-400"/> AI Predictive Risk Analysis</h3>
                    <div className="flex-1 space-y-3 overflow-y-auto">
                        <PredictiveHotspotCard location="Central Station Area" risk="High" time="18:00 - 21:00" />
                        <PredictiveHotspotCard location="Market Street" risk="Medium" time="11:00 - 14:00" />
                        <PredictiveHotspotCard location="City Park West" risk="High" time="20:00 - 23:00" />
                        <PredictiveHotspotCard location="Highway Junction" risk="Medium" time="02:00 - 04:00" />
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1">
                     <DepartmentReportsTable 
                        title="Citizen Crime & Safety Reports" 
                        issues={safetyIssues} 
                        isLoading={isLoading} 
                    />
                 </div>
                 <div className="lg:col-span-2">
                     <StaffTable<PoliceOfficer>
                        title="Police Personnel"
                        data={officers}
                        columns={[
                            { header: 'Name', accessor: 'name' },
                            { header: 'Rank', accessor: 'rank' },
                            { header: 'Station', accessor: 'station' },
                            { header: 'Contact', accessor: 'contact' },
                        ]}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default SafetyView;