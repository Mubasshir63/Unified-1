
import React, { useState, useEffect, useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { StreetlightIcon, CheckCircleIcon, ChartBarIcon } from '../../../components/icons/NavIcons';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { DetailedReport, ReportStatus, StaffMember } from '../../../types';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';
import DepartmentReportsTable from '../components/DepartmentReportsTable';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface ElectricityViewProps {
    isLoading: boolean;
    issues: DetailedReport[];
}

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const, labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };

const powerConsumptionData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{ label: 'Demand (MW)', data: [1200, 1100, 1500, 1800, 1750, 2100], borderColor: '#facc15', backgroundColor: 'rgba(250, 204, 21, 0.2)', fill: true, tension: 0.4 }],
};

const powerSourceData = {
    labels: ['Thermal', 'Solar', 'Wind', 'Hydro'],
    datasets: [{ data: [65, 20, 10, 5], backgroundColor: ['#f97316', '#facc15', '#38bdf8', '#60a5fa'], borderWidth: 0 }],
};

const ElectricityView: React.FC<ElectricityViewProps> = ({ isLoading: initialIsLoading, issues }) => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getElectricityStaff().then(data => {
            setStaff(data);
            setIsDataLoading(false);
        });
    }, []);

    const isLoading = initialIsLoading || isDataLoading;
    
    const elecIssues = useMemo(() => {
        return issues.filter(issue => 
            issue.category.toLowerCase().includes('street') ||
            issue.category.toLowerCase().includes('light') ||
            issue.category.toLowerCase().includes('power') ||
            issue.category.toLowerCase().includes('electric')
        );
    }, [issues]);

    const openOutageReports = useMemo(() => elecIssues.filter(i => i.status !== ReportStatus.Resolved).length, [elecIssues]);

    if (isLoading) return <div className="p-6 h-full w-full animate-shimmer bg-slate-800 rounded-xl"></div>;
    return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <StreetlightIcon className="w-8 h-8 mr-3 text-yellow-400"/>
                Electricity Department Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Grid Frequency" value="49.98 Hz" icon={<CheckCircleIcon />} color="green" />
                <KpiCard title="Peak Demand (24h)" value="2150 MW" icon={<ChartBarIcon />} color="red" />
                <KpiCard title="Open Outage Reports" value={openOutageReports} icon={<StreetlightIcon />} color="yellow" />
                <KpiCard title="Streetlight Uptime" value="99.2%" icon={<CheckCircleIcon />} color="green" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Power Consumption (24h)</h3>
                    <div className="h-80"><Line options={chartOptions} data={powerConsumptionData} /></div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Power Source Mix</h3>
                    <div className="h-80"><Doughnut options={{...chartOptions, plugins: {...chartOptions.plugins, legend: {...chartOptions.plugins.legend, position: 'right' as const}}}} data={powerSourceData} /></div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1">
                     <DepartmentReportsTable 
                        title="Outage & Streetlight Complaints" 
                        issues={elecIssues} 
                        isLoading={isLoading} 
                    />
                 </div>
                 <div className="lg:col-span-2">
                     <StaffTable
                        title="Electricity Board Staff"
                        data={staff}
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
        </div>
    );
};
export default ElectricityView;
