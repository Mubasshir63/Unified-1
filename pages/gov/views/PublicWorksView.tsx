
import React, { useState, useEffect, useMemo } from 'react';
import { DetailedReport, StaffMember, ReportStatus } from '../../../types';
import KpiCard from '../components/KpiCard';
import { WrenchIcon, CheckCircleIcon, ChartBarIcon } from '../../../components/icons/NavIcons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';
import DepartmentReportsTable from '../components/DepartmentReportsTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface PublicWorksViewProps {
    isLoading: boolean;
    issues: DetailedReport[];
}

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const, labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };
const barChartOptions = { ...chartOptions, plugins: { legend: { display: false } }, scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, grid: { display: false } } } };

const PublicWorksView: React.FC<PublicWorksViewProps> = ({ isLoading: initialIsLoading, issues }) => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getPublicWorksStaff().then(data => {
            setStaff(data);
            setIsDataLoading(false);
        });
    }, []);
    
    const isLoading = initialIsLoading || isDataLoading;

    const publicWorksIssues = useMemo(() => {
        return issues.filter(issue => 
            issue.category.toLowerCase().includes('road') ||
            issue.category.toLowerCase().includes('pothole') ||
            issue.category.toLowerCase().includes('infrastructure') ||
            issue.category.toLowerCase().includes('drainage')
        );
    }, [issues]);

    const issuesResolvedMonth = useMemo(() => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return publicWorksIssues.filter(i => i.status === ReportStatus.Resolved && new Date(i.updates[i.updates.length-1].timestamp) > oneMonthAgo).length;
    }, [publicWorksIssues]);
    
    const projectStatusData = useMemo(() => {
        const inProgress = publicWorksIssues.filter(i => i.status === ReportStatus.UnderReview).length;
        const completed = issuesResolvedMonth;
        const planning = 5; // Mock data
        return {
            labels: ['Completed', 'In Progress', 'Planning'],
            datasets: [{ data: [completed, inProgress, planning], backgroundColor: ['#22c55e', '#f59e0b', '#38bdf8'], borderWidth: 0 }],
        };
    }, [publicWorksIssues, issuesResolvedMonth]);

    const issuesByCategoryData = useMemo(() => {
        const counts = publicWorksIssues.reduce((acc, issue) => {
            let cat = 'Other';
            if (issue.category.toLowerCase().includes('road') || issue.category.toLowerCase().includes('pothole')) cat = 'Roads';
            else if (issue.category.toLowerCase().includes('drainage')) cat = 'Drainage';
            else if (issue.category.toLowerCase().includes('signal')) cat = 'Signals';

            if(issue.status !== ReportStatus.Resolved) {
               acc[cat] = (acc[cat] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return {
            labels: Object.keys(counts),
            datasets: [{ label: 'Open Issues', data: Object.values(counts), backgroundColor: 'rgba(249, 115, 22, 0.6)', borderColor: '#f97316', borderWidth: 2 }],
        };
    }, [publicWorksIssues]);


    if (isLoading) return <div className="p-6 h-full w-full animate-shimmer bg-slate-800 rounded-xl"></div>;
    
     return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <WrenchIcon className="w-8 h-8 mr-3 text-orange-400"/>
                Public Works Department
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Ongoing Projects" value={projectStatusData.datasets[0].data[1]} icon={<WrenchIcon className="w-6 h-6"/>} color="yellow" />
                <KpiCard title="Issues Resolved (Month)" value={issuesResolvedMonth} icon={<CheckCircleIcon />} color="green" />
                <KpiCard title="Budget Utilization" value="65%" icon={<ChartBarIcon />} color="blue" />
                <KpiCard title="Infrastructure Health" value="88%" icon={<CheckCircleIcon />} color="green" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Project Status</h3>
                    <div className="h-80"><Doughnut options={{...chartOptions, plugins: {...chartOptions.plugins, legend: {...chartOptions.plugins.legend, position: 'right' as const}}}} data={projectStatusData} /></div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Open Issues by Category</h3>
                    <div className="h-80"><Bar options={barChartOptions} data={issuesByCategoryData} /></div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1">
                     <DepartmentReportsTable 
                        title="Infrastructure Complaints" 
                        issues={publicWorksIssues} 
                        isLoading={isLoading} 
                    />
                 </div>
                 <div className="lg:col-span-2">
                     <StaffTable
                        title="Public Works Staff"
                        data={staff}
                        columns={[
                            { header: 'Name', accessor: 'name' },
                            { header: 'Role', accessor: 'role' },
                            { header: 'Zone / Project', accessor: 'zone' },
                            { header: 'Contact', accessor: 'contact' },
                        ]}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default PublicWorksView;
