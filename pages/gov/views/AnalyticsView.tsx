

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import type { DetailedReport } from '../../../types';
import { ReportStatus } from '../../../types';
import KpiCard from '../components/KpiCard';
import { ChartBarIcon, HeartIcon, CheckCircleIcon } from '../../../components/icons/NavIcons';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface AnalyticsViewProps {
    issues: DetailedReport[];
    isLoading: boolean;
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
    },
};

const KpiCardSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4 animate-shimmer">
        <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

const ChartSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-96 animate-shimmer">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-80 bg-gray-200 rounded-lg"></div>
    </div>
);

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ issues, isLoading }) => {
    // --- Chart Data Processing ---

    // 1. Line Chart: New vs Resolved Issues
    const trendsData = {
        labels: ['-30d', '-25d', '-20d', '-15d', '-10d', '-5d', 'Today'],
        datasets: [
            {
                label: 'New Issues',
                data: [12, 19, 15, 25, 22, 30, 21], // Mock data
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Resolved Issues',
                data: [10, 15, 18, 20, 26, 28, 25], // Mock data
                borderColor: 'rgb(22, 163, 74)',
                backgroundColor: 'rgba(22, 163, 74, 0.5)',
                tension: 0.4,
            },
        ],
    };

    // 2. Doughnut Chart: Open Issues by Priority
    const openIssues = issues.filter(i => i.status !== ReportStatus.Resolved);
    const priorityCounts = openIssues.reduce((acc, issue) => {
        const priority = issue.priority || 'Low';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const priorityData = {
        labels: Object.keys(priorityCounts),
        datasets: [{
            label: '# of Issues',
            data: Object.values(priorityCounts),
            backgroundColor: [
                'rgba(239, 68, 68, 0.7)', // Critical
                'rgba(249, 115, 22, 0.7)', // High
                'rgba(245, 158, 11, 0.7)', // Medium
                'rgba(132, 204, 22, 0.7)', // Low
            ],
            borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(249, 115, 22, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(132, 204, 22, 1)',
            ],
            borderWidth: 1,
        }],
    };

    // 3. Bar Chart: Department Workload
    const assignedIssues = issues.filter(i => i.assigned_to && i.status !== ReportStatus.Resolved);
    const departmentCounts = assignedIssues.reduce((acc, issue) => {
        const dept = issue.assigned_to?.name || 'Unassigned';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const workloadData = {
        labels: Object.keys(departmentCounts),
        datasets: [{
            label: 'Open Issues',
            data: Object.values(departmentCounts),
            backgroundColor: 'rgba(13, 148, 136, 0.6)',
            borderColor: 'rgba(13, 148, 136, 1)',
            borderWidth: 1,
        }],
    };
    
    if (isLoading) {
        return (
            <div className="p-4 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCardSkeleton />
                    <KpiCardSkeleton />
                    <KpiCardSkeleton />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartSkeleton />
                    <ChartSkeleton />
                </div>
                <ChartSkeleton />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <KpiCard title="Avg. Resolution Time" value="8.5h" icon={<ChartBarIcon />} color="blue" />
                 <KpiCard title="Citizen Satisfaction" value="92%" icon={<HeartIcon className="w-6 h-6"/>} color="green" />
                 <KpiCard title="Total Resolved (30d)" value={153} icon={<CheckCircleIcon />} color="yellow" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-96">
                    <h3 className="font-bold text-gray-800 mb-2">Issue Trends (Last 30 Days)</h3>
                    <div className="h-80">
                        <Line options={chartOptions} data={trendsData} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-96">
                    <h3 className="font-bold text-gray-800 mb-2">Open Issues by Priority</h3>
                    <div className="h-80">
                         <Doughnut options={chartOptions} data={priorityData} />
                    </div>
                </div>
            </div>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-96">
                 <h3 className="font-bold text-gray-800 mb-2">Department Workload</h3>
                 <div className="h-80">
                    <Bar options={{...chartOptions, plugins: { legend: { display: false }}}} data={workloadData} />
                 </div>
            </div>
        </div>
    );
};

export default AnalyticsView;