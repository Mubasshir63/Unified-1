
import React, { useState, useEffect, useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { WaterLeakIcon, CheckCircleIcon, ChartBarIcon } from '../../../components/icons/NavIcons';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { DetailedReport, StaffMember, ReportStatus } from '../../../types';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';
import DepartmentReportsTable from '../components/DepartmentReportsTable';

ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title, Tooltip, Legend);

interface WaterViewProps {
    isLoading: boolean;
    issues: DetailedReport[];
}

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const, labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };
const barChartOptions = { ...chartOptions, plugins: { legend: { display: false } }, scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, grid: { display: false } } } };

const consumptionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        { label: 'Supply (MLD)', data: [550, 560, 555, 570, 565, 580, 575], borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.2)', fill: true, tension: 0.4 },
        { label: 'Consumption (MLD)', data: [540, 550, 552, 560, 568, 570, 565], borderColor: '#a78bfa', backgroundColor: 'rgba(167, 139, 250, 0.2)', fill: true, tension: 0.4 },
    ],
};
const reservoirData = {
    labels: ['Reservoir A', 'Reservoir B', 'Reservoir C', 'Reservoir D'],
    datasets: [{
        label: 'Level (%)', data: [85, 92, 78, 88],
        backgroundColor: ['rgba(56, 189, 248, 0.6)', 'rgba(34, 197, 94, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(167, 139, 250, 0.6)'],
        borderColor: ['#38bdf8', '#22c55e', '#f59e0b', '#a78bfa'], borderWidth: 2,
    }],
};

const WaterView: React.FC<WaterViewProps> = ({ isLoading: initialIsLoading, issues }) => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getWaterStaff().then(data => {
            setStaff(data);
            setIsDataLoading(false);
        });
    }, []);

    const isLoading = initialIsLoading || isDataLoading;
    
    const waterIssues = useMemo(() => {
        return issues.filter(issue => 
            issue.category.toLowerCase().includes('water') ||
            issue.category.toLowerCase().includes('leak') ||
            issue.category.toLowerCase().includes('pipeline')
        );
    }, [issues]);

    const activeLeakReports = useMemo(() => waterIssues.filter(i => i.status !== ReportStatus.Resolved).length, [waterIssues]);

    if (isLoading) return <div className="p-6 h-full w-full animate-shimmer bg-slate-800 rounded-xl"></div>;
    
    return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <WaterLeakIcon className="w-8 h-8 mr-3 text-blue-400"/>
                Water Department Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Water Quality Index" value="96 AGI" icon={<CheckCircleIcon />} color="green" />
                <KpiCard title="Avg. Reservoir Level" value="85%" icon={<ChartBarIcon />} color="blue" />
                <KpiCard title="Active Leak Reports" value={activeLeakReports} icon={<WaterLeakIcon />} color="red" />
                <KpiCard title="Non-Revenue Water" value="18%" icon={<ChartBarIcon />} color="yellow" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Weekly Supply vs. Consumption</h3>
                    <div className="h-80"><Line options={chartOptions} data={consumptionData} /></div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Reservoir Levels</h3>
                    <div className="h-80"><Bar options={barChartOptions} data={reservoirData} /></div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1">
                     <DepartmentReportsTable 
                        title="Water Leakage Reports" 
                        issues={waterIssues} 
                        isLoading={isLoading} 
                    />
                 </div>
                 <div className="lg:col-span-2">
                     <StaffTable
                        title="Water Board Staff"
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

export default WaterView;
