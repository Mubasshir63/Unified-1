import React, { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import { PayBillsIcon, CheckCircleIcon, ChartBarIcon } from '../../../components/icons/NavIcons';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { StaffMember, DetailedReport } from '../../../types';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';

ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title, Tooltip, Legend);

interface FinanceViewProps {
    isLoading: boolean;
    issues: DetailedReport[]; // Added for future use
}

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const, labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };
const barChartOptions = { ...chartOptions, plugins: { legend: { display: false } }, scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, grid: { display: false } } } };

const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        { label: 'Revenue (Cr)', data: [120, 135, 125, 140, 155, 150], borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: true, tension: 0.4 },
        { label: 'Expenditure (Cr)', data: [110, 115, 120, 130, 125, 135], borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: true, tension: 0.4 },
    ],
};
const taxCollectionData = {
    labels: ['Property', 'Water', 'Corporate', 'Other'],
    datasets: [{ label: 'Collection (Cr)', data: [80, 25, 35, 10], backgroundColor: ['#38bdf8', '#60a5fa', '#a78bfa', '#c084fc'], borderWidth: 0 }],
};

const FinanceView: React.FC<FinanceViewProps> = ({ isLoading: initialIsLoading, issues }) => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getFinanceStaff().then(data => {
            setStaff(data);
            setIsDataLoading(false);
        });
    }, []);

    const isLoading = initialIsLoading || isDataLoading;

    if (isLoading) return <div className="p-6 h-full w-full animate-shimmer bg-slate-800 rounded-xl"></div>;
    return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <PayBillsIcon className="w-8 h-8 mr-3 text-green-400"/>
                Finance Department Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Revenue Collected (YTD)" value="₹825 Cr" icon={<ChartBarIcon />} color="green" />
                <KpiCard title="Budget Spent (YTD)" value="72%" icon={<ChartBarIcon />} color="yellow" />
                <KpiCard title="Tax Compliance" value="91%" icon={<CheckCircleIcon />} color="green" />
                <KpiCard title="Pending Invoices" value="1,240" icon={<PayBillsIcon />} color="red" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Revenue vs. Expenditure</h3>
                    <div className="h-80"><Line options={chartOptions} data={revenueData} /></div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Tax Collection by Source</h3>
                    <div className="h-80"><Bar options={barChartOptions} data={taxCollectionData} /></div>
                </div>
            </div>
             <div>
                 <StaffTable
                    title="Finance Department Staff"
                    data={staff}
                    columns={[
                        { header: 'Name', accessor: 'name' },
                        { header: 'Role', accessor: 'role' },
                        { header: 'Department', accessor: 'zone' },
                        { header: 'Contact', accessor: 'contact' },
                    ]}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default FinanceView;