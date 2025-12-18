
import React, { useState, useEffect, useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { BuildingOfficeIcon, CheckCircleIcon, ChartBarIcon } from '../../../components/icons/NavIcons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { DetailedReport, ReportStatus, StaffMember } from '../../../types';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';
import DepartmentReportsTable from '../components/DepartmentReportsTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface HousingViewProps {
    isLoading: boolean;
    issues: DetailedReport[];
}

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const, labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };
const barChartOptions = { ...chartOptions, plugins: { legend: { display: false } }, scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, grid: { display: false } } } };

const permitsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: 'Permits Issued', data: [120, 150, 130, 180, 160, 210],
        backgroundColor: 'rgba(139, 92, 246, 0.6)', borderColor: '#8b5cf6', borderWidth: 2,
    }],
};

const housingTypeData = {
    labels: ['Apartment', 'Independent', 'Public Housing', 'Gated Community'],
    datasets: [{ data: [45, 25, 15, 15], backgroundColor: ['#38bdf8', '#a78bfa', '#f472b6', '#22c55e'], borderWidth: 0 }],
};

const HousingView: React.FC<HousingViewProps> = ({ isLoading: initialIsLoading, issues }) => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getHousingStaff().then(data => {
            setStaff(data);
            setIsDataLoading(false);
        });
    }, []);

    const isLoading = initialIsLoading || isDataLoading;
    
    const housingIssues = useMemo(() => {
        return issues.filter(issue => 
            issue.category.toLowerCase().includes('housing') ||
            issue.category.toLowerCase().includes('construction') ||
            issue.category.toLowerCase().includes('building')
        );
    }, [issues]);
    
    const openHousingComplaints = useMemo(() => housingIssues.filter(i => i.status !== ReportStatus.Resolved).length, [housingIssues]);

    if (isLoading) return <div className="p-6 h-full w-full animate-shimmer bg-slate-800 rounded-xl"></div>;

    return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <BuildingOfficeIcon className="w-8 h-8 mr-3 text-indigo-400"/>
                Housing & Urban Development
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="New Permits (Month)" value="210" icon={<BuildingOfficeIcon />} color="blue" />
                <KpiCard title="Occupancy Rate" value="97%" icon={<CheckCircleIcon />} color="green" />
                <KpiCard title="Avg. Property Value" value="₹7,200/sqft" icon={<ChartBarIcon />} color="yellow" />
                <KpiCard title="Open Housing Complaints" value={openHousingComplaints} icon={<BuildingOfficeIcon />} color="red" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Permits Issued by Month</h3>
                    <div className="h-80"><Bar options={barChartOptions} data={permitsData} /></div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Housing Type Distribution</h3>
                    <div className="h-80"><Pie options={{...chartOptions, plugins: {...chartOptions.plugins, legend: {...chartOptions.plugins.legend, position: 'right' as const}}}} data={housingTypeData} /></div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1">
                     <DepartmentReportsTable 
                        title="Urban Planning Complaints" 
                        issues={housingIssues} 
                        isLoading={isLoading} 
                    />
                 </div>
                 <div className="lg:col-span-2">
                     <StaffTable
                        title="Urban Development Staff"
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
export default HousingView;
