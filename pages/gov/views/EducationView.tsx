import React, { useState, useEffect, useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { UsersIcon, CheckCircleIcon, ChartBarIcon, BuildingOfficeIcon } from '../../../components/icons/NavIcons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { DetailedReport, ReportStatus, Teacher, School } from '../../../types';
import * as mockApi from '../../../api/mockApi';
import StaffTable from '../components/StaffTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface EducationViewProps {
    isLoading: boolean;
    issues: DetailedReport[];
}

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const, labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };
const barChartOptions = { ...chartOptions, plugins: { legend: { display: false } }, scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, grid: { display: false } } } };

const enrollmentData = {
    labels: ['Primary', 'Middle', 'Secondary', 'Higher Sec.'],
    datasets: [{ label: 'Students', data: [45000, 32000, 28000, 21000], backgroundColor: 'rgba(167, 139, 250, 0.6)', borderColor: '#a78bfa', borderWidth: 2 }],
};

const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{ label: 'Avg. Attendance (%)', data: [92, 94, 93, 91, 88], borderColor: '#22c55e', tension: 0.4 }],
};

const SchoolCard: React.FC<{ school: School }> = ({ school }) => (
     <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 flex items-start space-x-4">
        <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-slate-700 flex items-center justify-center text-purple-400"><BuildingOfficeIcon/></div>
        <div>
            <h4 className="font-bold text-slate-200">{school.name}</h4>
            <p className="text-sm text-slate-400">{school.location}</p>
            <div className="text-xs text-slate-300 mt-2 space-x-4">
                <span>Principal: <span className="font-semibold">{school.principal}</span></span>
                <span>Students: <span className="font-semibold">{school.students}</span></span>
            </div>
        </div>
    </div>
)

const EducationView: React.FC<EducationViewProps> = ({ isLoading: initialIsLoading, issues }) => {
    const [educationData, setEducationData] = useState<{ teachers: Teacher[], schools: School[] }>({ teachers: [], schools: [] });
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsDataLoading(true);
        mockApi.getEducationData().then(data => {
            setEducationData(data);
            setIsDataLoading(false);
        });
    }, []);

    const isLoading = initialIsLoading || isDataLoading;
    const openSchoolIssues = useMemo(() => issues.filter(i => i.category.toLowerCase().includes('school') && i.status !== ReportStatus.Resolved).length, [issues]);

    if (isLoading) return <div className="p-6 h-full w-full animate-shimmer bg-slate-800 rounded-xl"></div>;

    return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <UsersIcon className="w-8 h-8 mr-3 text-purple-400"/>
                Education Department Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Enrollment" value="126k" icon={<UsersIcon />} color="blue" />
                <KpiCard title="Avg. Attendance" value="92.5%" icon={<CheckCircleIcon />} color="green" />
                <KpiCard title="Teacher-Student Ratio" value="1:32" icon={<ChartBarIcon />} color="yellow" />
                <KpiCard title="Open School Issues" value={openSchoolIssues} icon={<UsersIcon />} color="red" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">Enrollment by School Level</h3>
                    <div className="h-80"><Bar options={barChartOptions} data={enrollmentData} /></div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-96">
                    <h3 className="font-bold text-slate-200 mb-2">City-wide Attendance Trend (This Week)</h3>
                    <div className="h-80"><Line options={{...chartOptions, plugins: {legend: {display: false}}}} data={attendanceData} /></div>
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                     <StaffTable<Teacher>
                        title="Teaching Staff"
                        data={educationData.teachers}
                        columns={[
                            { header: 'Name', accessor: 'name' },
                            { header: 'Subject', accessor: 'subject' },
                            { header: 'School', accessor: 'school' },
                            { header: 'Contact', accessor: 'contact' },
                        ]}
                        isLoading={isLoading}
                    />
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-full">
                        <h3 className="font-bold text-slate-200 text-lg mb-4">City Schools</h3>
                        <div className="space-y-3">
                            {educationData.schools.map(s => <SchoolCard key={s.id} school={s} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationView;