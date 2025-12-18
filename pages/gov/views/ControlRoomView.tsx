
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { DetailedReport, SOSAlert, Department, ReportStatus } from '../../../types';
import GovtMap from '../components/GovtMap';
import { 
    HeartIcon, SOSIcon, TransportIcon, WasteTrackerIcon, WaterLeakIcon, StreetlightIcon, BuildingOfficeIcon, ShieldIcon, WrenchIcon, PayBillsIcon, UsersIcon, CCTVIcon, AiAssistantIcon, CheckCircleIcon
} from '../../../components/icons/NavIcons';
import * as mockApi from '../../../api/mockApi';

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
};

const CityHealthMetric: React.FC<{ label: string; value: string; color: string; icon: React.ReactNode }> = ({ label, value, color, icon }) => (
    <div className="bg-slate-800/40 border border-slate-700 p-3 rounded-lg flex items-center space-x-3">
        <div className={`p-2 rounded-md bg-slate-900 ${color}`}>{icon}</div>
        <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-100">{value}</p>
        </div>
    </div>
);

const DepartmentStatus: React.FC<{ departments: Department[] }> = ({ departments }) => {
    const statusClasses = {
        Normal: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
        Warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
        Critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    };

    const icons: Record<string, React.ReactNode> = {
        health: <HeartIcon className="w-4 h-4" />, transport: <TransportIcon className="w-4 h-4" />,
        sanitation: <WasteTrackerIcon className="w-4 h-4" />, water: <WaterLeakIcon className="w-4 h-4" />,
        electricity: <StreetlightIcon className="w-4 h-4" />, housing: <BuildingOfficeIcon className="w-4 h-4" />,
        safety: <ShieldIcon className="w-4 h-4" />, 'public-works': <WrenchIcon className="w-4 h-4" />,
        finance: <PayBillsIcon className="w-4 h-4" />, education: <UsersIcon className="w-4 h-4" />,
    };

    return (
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/50 shadow-2xl h-full flex flex-col">
            <h2 className="text-xs font-black text-teal-400 mb-4 tracking-[0.2em] uppercase">Dep_Status_Matrix</h2>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1 no-scrollbar">
                {departments.map(dept => {
                    const classes = statusClasses[dept.status] || statusClasses.Normal;
                    return (
                        <div key={dept.id} className={`p-3 rounded-xl flex items-center justify-between ${classes.bg} border ${classes.border} transition-all hover:brightness-125 cursor-crosshair`}>
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-lg bg-slate-950/80 ${classes.text}`}>{icons[dept.id] || <UsersIcon className="w-4 h-4"/>}</div>
                                <div>
                                    <p className="font-bold text-slate-100 text-xs">{dept.name}</p>
                                    <p className="text-[8px] text-slate-500 font-mono">ID: {dept.id.substring(0, 4).toUpperCase()}_01</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-mono font-bold ${classes.text} text-xs`}>{dept.open_issues}</p>
                                <p className="text-[8px] text-slate-500 uppercase">Load</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const LiveConsole: React.FC<{ reports: DetailedReport[], alerts: SOSAlert[], onSelectIssue: (i: DetailedReport) => void }> = ({ reports, alerts, onSelectIssue }) => {
    const combinedFeed = useMemo(() => {
        const reportFeed = reports.map(r => ({ ...r, type: 'report', timestamp: r.date }));
        const sosFeed = alerts.map(a => ({ ...a, type: 'sos', timestamp: a.timestamp }));
        return [...reportFeed, ...sosFeed].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
    }, [reports, alerts]);

    return (
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-teal-500/20 shadow-2xl h-full flex flex-col font-mono">
            <h2 className="text-xs font-black text-teal-400 mb-4 tracking-[0.2em] uppercase flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span> SYSTEM_LIVE_LOG
            </h2>
            <div className="space-y-3 overflow-y-auto flex-1 no-scrollbar">
                {combinedFeed.map((item: any) => (
                    <div key={item.id} onClick={() => item.type === 'report' && onSelectIssue(item)} className={`p-3 rounded-lg border text-[10px] cursor-pointer transition-all ${item.type === 'sos' ? 'bg-red-950/40 border-red-500/40 text-red-300 animate-glow' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-teal-500/50'}`}>
                        <div className="flex justify-between mb-1">
                            <span className="font-bold">{item.type === 'sos' ? '[EMERGENCY]' : '[ISSUE_REPORT]'}</span>
                            <span>{timeSince(item.timestamp)}</span>
                        </div>
                        <p className="truncate">{item.type === 'sos' ? `ACTIVE SOS: ${item.user.name}` : item.title}</p>
                        <p className="text-[8px] opacity-50">COORD: {item.coords?.lat.toFixed(4)}, {item.coords?.lng.toFixed(4)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ControlRoomView: React.FC<{ reports: DetailedReport[], onSelectIssue: (i: DetailedReport) => void, isLoading: boolean, alerts: SOSAlert[] }> = ({ reports, onSelectIssue, isLoading, alerts }) => {
    const { user } = useContext(UserContext);
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        const refresh = async () => setDepartments(await mockApi.getDepartments());
        refresh();
        const interval = setInterval(refresh, 5000);
        return () => clearInterval(interval);
    }, [reports]);

    if (isLoading || !user) return <div className="p-6 h-full w-full bg-slate-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-t-teal-500 border-slate-700 rounded-full animate-spin"></div></div>;

    return (
        <div className="p-4 md:p-6 grid grid-cols-12 gap-6 h-full animate-fadeInUp bg-slate-950 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            
            {/* Top Metrics Row */}
            <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-2">
                {/* CheckCircleIcon added to the import above */}
                <CityHealthMetric label="Air Quality" value="48 - Good" color="text-green-400" icon={<CheckCircleIcon className="w-4 h-4"/>} />
                <CityHealthMetric label="Power Grid" value="1.2 GW" color="text-yellow-400" icon={<StreetlightIcon className="w-4 h-4"/>} />
                <CityHealthMetric label="Water Supply" value="94.2 MLD" color="text-blue-400" icon={<WaterLeakIcon className="w-4 h-4"/>} />
                <CityHealthMetric label="City Sentiment" value="Positive" color="text-purple-400" icon={<AiAssistantIcon className="w-4 h-4"/>} />
                <CityHealthMetric label="Active SOS" value={`${alerts.filter(a => a.status === 'Active').length}`} color="text-red-400" icon={<SOSIcon className="w-4 h-4"/>} />
                <CityHealthMetric label="Uptime" value="99.98%" color="text-teal-400" icon={<ShieldIcon className="w-4 h-4"/>} />
            </div>

            {/* Main Visual Panels */}
            <div className="col-span-12 lg:col-span-3 h-full max-h-[calc(100vh-200px)]"><DepartmentStatus departments={departments} /></div>
            <div className="col-span-12 lg:col-span-6 h-full max-h-[calc(100vh-200px)] bg-slate-900 rounded-3xl border border-teal-500/30 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-500/30 text-[10px] font-black text-teal-400 tracking-widest uppercase">
                    Spatial_Map_View_01
                </div>
                <GovtMap issues={reports} onMarkerClick={onSelectIssue} center={user.location.coords} />
                <div className="scanner-line"></div>
                <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse shadow-[0_0_10px_teal] delay-700"></div>
                </div>
            </div>
             <div className="col-span-12 lg:col-span-3 h-full max-h-[calc(100vh-200px)] flex flex-col gap-6">
                <LiveConsole reports={reports} alerts={alerts} onSelectIssue={onSelectIssue} />
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/50 flex-1 flex flex-col">
                    <h2 className="text-[10px] font-black text-teal-400 mb-4 tracking-widest uppercase">Visual_Node</h2>
                    <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative group">
                        <img src="https://picsum.photos/seed/cybergrid/400/225" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" alt="grid"/>
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <CCTVIcon className="w-12 h-12 text-teal-500 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlRoomView;
