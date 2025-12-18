import React, { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { LogoutIcon, ChartBarIcon, HeartIcon, CheckCircleIcon, ShieldIcon, KeyIcon } from '../../../components/icons/NavIcons';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);


// --- Reusable Sub-components ---
const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: 'blue' | 'green' | 'yellow' | 'red' }> = ({ label, value, icon, color }) => {
    const colors = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', yellow: 'bg-yellow-100 text-yellow-600', red: 'bg-red-100 text-red-600' };
    return (<div className={`p-3 rounded-lg text-center ${colors[color]}`}><div className="text-2xl font-bold">{value}</div><div className="text-xs font-semibold opacity-80">{label}</div></div>);
};
const SettingsItem: React.FC<{ title: string, subtitle: string, children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-700/50"><div><p className="font-semibold text-slate-200">{title}</p><p className="text-xs text-slate-400">{subtitle}</p></div>{children}</div>
);
const ToggleSwitch: React.FC<{ id: string, defaultChecked?: boolean }> = ({ id, defaultChecked = false }) => (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer"><input type="checkbox" id={id} defaultChecked={defaultChecked} className="sr-only peer" /><div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div></label>
);


// Skeleton Component
const ProfileSkeleton: React.FC = () => (
    <div className="p-4 md:p-6 h-full animate-shimmer">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left Skeleton */}
            <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl space-y-4">
                <div className="w-24 h-24 rounded-full bg-slate-700 mx-auto"></div>
                <div className="h-7 bg-slate-700 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto"></div>
                <div className="space-y-2 pt-4">
                    <div className="h-5 bg-slate-700 rounded w-full"></div>
                    <div className="h-5 bg-slate-700 rounded w-full"></div>
                </div>
                <div className="h-10 bg-slate-700 rounded-lg mt-6"></div>
                <div className="h-10 bg-slate-700 rounded-lg mt-2"></div>
            </div>
            {/* Right Skeleton */}
            <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl">
                <div className="flex space-x-4 border-b border-slate-700">
                    <div className="h-8 bg-slate-700 rounded-t-lg w-24"></div>
                    <div className="h-8 bg-slate-700 rounded-t-lg w-24"></div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="h-24 bg-slate-700 rounded-lg"></div>
                    <div className="h-24 bg-slate-700 rounded-lg"></div>
                </div>
                <div className="mt-6 h-48 bg-slate-700 rounded-lg"></div>
            </div>
        </div>
    </div>
);


const ProfileView: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const { user, logout } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState<'performance' | 'settings'>('performance');

    // Mock data for charts
    const lineChartData = { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Issues Resolved', data: [5, 8, 6, 10, 7, 9, 11], borderColor: '#14b8a6', backgroundColor: 'rgba(20, 184, 166, 0.1)', fill: true, tension: 0.4 }] };
    const doughnutChartData = { labels: ['Critical', 'High', 'Medium'], datasets: [{ data: [3, 8, 21], backgroundColor: ['#ef4444', '#f97316', '#f59e0b'], borderWidth: 0 }] };
    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false, labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };

    if (isLoading) return <ProfileSkeleton />;
    if (!user) return <div>User not found.</div>;

    const TabButton: React.FC<{ tabId: 'performance' | 'settings', children: React.ReactNode }> = ({ tabId, children }) => (
        <button onClick={() => setActiveTab(tabId)} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === tabId ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            {children}
        </button>
    );

    return (
        <div className="p-4 md:p-6 animate-fadeInUp">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700 flex flex-col items-center text-center tilt-card">
                    <div className="relative mb-4">
                        <img src={user.profilePicture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-slate-600 shadow-md" />
                        <span className="absolute bottom-1 right-1 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-slate-800"></span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">{user.name}</h1>
                    <p className="text-teal-400 font-semibold">City Administrator, New Delhi</p>
                    <div className="w-full border-t border-slate-700 my-6"></div>
                    <div className="w-full text-left space-y-3 text-sm">
                        <p className="flex items-center"><strong className="w-20 font-semibold text-slate-400">Email:</strong><span className="text-slate-300">{user.email}</span></p>
                        <p className="flex items-center"><strong className="w-20 font-semibold text-slate-400">Phone:</strong><span className="text-slate-300">+91 9876543210 (Official)</span></p>
                        <div className="flex items-center"><strong className="w-20 font-semibold text-slate-400">Status:</strong>
                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-500/20 text-green-400">On Duty</span>
                        </div>
                    </div>
                    <button className="mt-6 w-full py-2.5 px-4 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-500 transform hover:scale-105 transition-transform shadow-sm">
                        Edit Profile
                    </button>
                    <button onClick={logout} className="mt-2 w-full flex items-center justify-center py-2 px-4 text-red-400 font-semibold hover:bg-red-500/20 rounded-xl transition-colors">
                        <LogoutIcon className="w-5 h-5 mr-2" /> Logout
                    </button>
                </div>

                {/* Right Column: Tabbed Content */}
                <div className="lg:col-span-2 bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
                    <div className="px-6 border-b border-slate-700 bg-slate-800/50">
                        <TabButton tabId="performance">My Performance</TabButton>
                        <TabButton tabId="settings">System Settings</TabButton>
                    </div>

                    <div className="p-6">
                        {activeTab === 'performance' && (
                            <div className="space-y-6 animate-fadeInUp" style={{animationDuration: '300ms'}}>
                                <h3 className="font-bold text-lg text-slate-200">Performance (Last 30 Days)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard label="Issues Resolved" value={42} icon={<CheckCircleIcon />} color="green" />
                                    <StatCard label="Avg. Response" value="4.2h" icon={<ChartBarIcon />} color="blue" />
                                    <StatCard label="SLA Compliance" value="98%" icon={<ShieldIcon className="w-6 h-6"/>} color="yellow" />
                                    <StatCard label="Satisfaction" value="92%" icon={<HeartIcon className="w-6 h-6"/>} color="red" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64">
                                    <div>
                                        <h4 className="font-semibold text-slate-300 mb-2">Weekly Resolution Trend</h4>
                                        <div className="h-56"><Line data={lineChartData} options={chartOptions} /></div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-300 mb-2">Open Issues by Priority</h4>
                                        <div className="h-56"><Doughnut data={doughnutChartData} options={{ ...chartOptions, plugins: { legend: { position: 'right', labels: {color: '#94a3b8'} } } }} /></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'settings' && (
                            <div className="space-y-6 animate-fadeInUp text-slate-300" style={{animationDuration: '300ms'}}>
                                <h3 className="font-bold text-lg text-slate-200">System Settings</h3>
                                <SettingsItem title="AI Issue Routing" subtitle="Automatically assign new issues to departments.">
                                    <ToggleSwitch id="ai-routing" defaultChecked />
                                </SettingsItem>
                                <SettingsItem title="Public Holiday Mode" subtitle="Adjust SLA timers for public holidays.">
                                    <ToggleSwitch id="holiday-mode" />
                                </SettingsItem>
                                <SettingsItem title="Maintenance Mode" subtitle="Temporarily disable citizen submissions.">
                                    <ToggleSwitch id="maintenance-mode" />
                                </SettingsItem>

                                <h3 className="font-bold text-lg text-slate-200 pt-4 border-t border-slate-700">Account Security</h3>
                                 <div className="space-y-2">
                                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
                                        <KeyIcon className="w-5 h-5"/>
                                        <span>Change Password</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;