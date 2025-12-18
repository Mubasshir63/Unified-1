
import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { DetailedReport, Doctor, Hospital, ReportStatus } from '../../../types';
import KpiCard from '../components/KpiCard';
import { HeartIcon, AmbulanceIcon, CheckCircleIcon, ShieldIcon, BuildingOfficeIcon } from '../../../components/icons/NavIcons';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';
import DepartmentReportsTable from '../components/DepartmentReportsTable';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface HealthViewProps {
    isLoading: boolean;
    issues: DetailedReport[];
}

const ChartSkeleton: React.FC = () => (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96 animate-shimmer">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-80 bg-slate-700 rounded-lg"></div>
    </div>
);

const HospitalCard: React.FC<{hospital: Hospital}> = ({ hospital }) => (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 flex items-start space-x-4">
        <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-slate-700 flex items-center justify-center text-red-400"><BuildingOfficeIcon/></div>
        <div>
            <h4 className="font-bold text-slate-200">{hospital.name}</h4>
            <p className="text-sm text-slate-400">{hospital.location}</p>
            <div className="text-xs text-slate-300 mt-2 space-x-4">
                <span>Beds: <span className="font-semibold">{hospital.beds}</span></span>
                <span>Contact: <span className="font-semibold">{hospital.contact}</span></span>
            </div>
        </div>
    </div>
);

const HealthView: React.FC<HealthViewProps> = ({ isLoading: initialIsLoading, issues }) => {
    const [healthData, setHealthData] = useState<{ doctors: Doctor[], hospitals: Hospital[] }>({ doctors: [], hospitals: [] });
    const [isDataLoading, setIsDataLoading] = useState(true);
    
    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getHealthData().then(data => {
            setHealthData(data);
            setIsDataLoading(false);
        });
    }, []);

    const isLoading = initialIsLoading || isDataLoading;
    
    const healthIssues = useMemo(() => {
        return issues.filter(issue => 
            issue.category.toLowerCase().includes('health') ||
            issue.category.toLowerCase().includes('hygiene') ||
            issue.category.toLowerCase().includes('medical') ||
            issue.category.toLowerCase().includes('hospital')
        );
    }, [issues]);

    const openHealthCases = useMemo(() => healthIssues.filter(i => i.status !== ReportStatus.Resolved).length, [healthIssues]);
    
    const resolvedToday = useMemo(() => {
        const today = new Date().toDateString();
        return healthIssues.filter(i => 
            i.status === ReportStatus.Resolved && 
            new Date(i.updates[i.updates.length-1].timestamp).toDateString() === today
        ).length;
    }, [healthIssues]);


    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            { label: 'Flu Cases', data: [65, 59, 80, 81, 56, 55], borderColor: '#38bdf8', tension: 0.4 },
            { label: 'Dengue Cases', data: [28, 48, 40, 19, 86, 27], borderColor: '#facc15', tension: 0.4 },
        ],
    };

    const doughnutChartData = {
        labels: ['Cardiology', 'Orthopedics', 'Pediatrics', 'General'],
        datasets: [{ data: [300, 50, 100, 150], backgroundColor: ['#f472b6', '#818cf8', '#60a5fa', '#a78bfa'], borderWidth: 0 }],
    };
    
    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const, labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } } };

    if (isLoading) {
        return (
            <div className="p-4 md:p-6 space-y-6">
                 <div className="h-8 bg-slate-700 rounded w-1/4 animate-shimmer"></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="h-24 bg-slate-700 rounded-xl animate-shimmer"></div>
                    <div className="h-24 bg-slate-700 rounded-xl animate-shimmer"></div>
                    <div className="h-24 bg-slate-700 rounded-xl animate-shimmer"></div>
                    <div className="h-24 bg-slate-700 rounded-xl animate-shimmer"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartSkeleton />
                    <ChartSkeleton />
                </div>
            </div>
        );
    }
    
    return (
         <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <HeartIcon className="w-8 h-8 mr-3 text-red-400"/>
                Health Department Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Hospital Bed Avail." value="82%" icon={<CheckCircleIcon />} color="green" />
                <KpiCard title="Ambulances Active" value="28/32" icon={<AmbulanceIcon />} color="blue" />
                <KpiCard title="Resolved Today" value={resolvedToday} icon={<ShieldIcon className="w-6 h-6"/>} color="yellow" />
                <KpiCard title="Open Health Cases" value={openHealthCases} icon={<HeartIcon className="w-6 h-6"/>} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Disease Trends (6 Months)</h3>
                    <div className="h-80"><Line options={chartOptions} data={lineChartData} /></div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Patient Demographics</h3>
                    <div className="h-80"><Doughnut options={{...chartOptions, plugins: {...chartOptions.plugins, legend: {...chartOptions.plugins.legend, position: 'right' as const}}}} data={doughnutChartData} /></div>
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <DepartmentReportsTable 
                        title="Live Citizen Health Reports" 
                        issues={healthIssues} 
                        isLoading={isLoading} 
                    />
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-full">
                        <h3 className="font-bold text-slate-200 text-lg mb-4">City Hospitals</h3>
                        <div className="space-y-3">
                            {healthData.hospitals.map(h => <HospitalCard key={h.id} hospital={h} />)}
                        </div>
                    </div>
                </div>
            </div>

             <div>
                 <StaffTable<Doctor>
                    title="Medical Personnel"
                    data={healthData.doctors}
                    columns={[
                        { header: 'Name', accessor: 'name' },
                        { header: 'Specialization', accessor: 'specialization' },
                        { header: 'Hospital', accessor: 'hospital' },
                        { header: 'Contact', accessor: 'contact' },
                    ]}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default HealthView;
