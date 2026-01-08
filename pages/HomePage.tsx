import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Announcement, CityPulse } from '../types';
import { ReportStatus, Page } from '../types';
import { 
    PoliceIcon, AmbulanceIcon, FireDeptIcon, BloodBankIcon, HospitalIcon, NewReportIcon, 
    SOSIcon, AiAssistantIcon, PregnantWomanIcon, SyringeIcon
} from '../components/icons/NavIcons';
import * as mockApi from '../api/mockApi';

const CityPulseBar: React.FC<{ pulse: CityPulse | null }> = ({ pulse }) => {
    if (!pulse) return null;
    return (
        <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
            {[
                { label: 'AQI', value: pulse.aqi, sub: pulse.aqiStatus, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Traffic', value: `${pulse.trafficCongestion}%`, sub: 'Congested', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Power', value: `${pulse.powerUptime}%`, sub: 'Uptime', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'Water', value: `${pulse.waterUptime}%`, sub: 'Supply', color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { label: 'Events', value: pulse.activeEvents, sub: 'Live Now', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(stat => (
                <div key={stat.label} className={`flex-shrink-0 min-w-[110px] p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center ${stat.bg} animate-fadeInUp`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{stat.sub}</p>
                </div>
            ))}
        </div>
    );
};

const SectionHeader: React.FC<{ title: string; actionText?: string; onActionClick?: () => void }> = ({ title, actionText, onActionClick }) => (
    <div className="flex justify-between items-end mb-5 px-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
        {actionText && (
            <button onClick={onActionClick} className="text-xs font-black text-teal-600 uppercase tracking-widest hover:text-teal-700 transition-colors">
                {actionText}
            </button>
        )}
    </div>
);

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    return (
        <div className="bg-white p-5 rounded-3xl border border-gray-100 mb-4 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1 pr-3">{announcement.title}</h3>
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${announcement.status === ReportStatus.Emergency ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {announcement.status}
                </span>
            </div>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4 line-clamp-2">{announcement.content}</p>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{announcement.source}</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Update Live</p>
            </div>
        </div>
    );
};

const QuickServiceCard: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, color?: string }> = ({ icon, label, onClick, color = "bg-white" }) => (
    <div className="flex flex-col items-center space-y-3 text-center group">
        <button 
            onClick={onClick}
            className={`w-16 h-16 flex items-center justify-center ${color} rounded-[1.5rem] text-gray-700 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all duration-300 shadow-sm border border-gray-100 active:scale-90 overflow-hidden relative`}
        >
            <div className="absolute inset-0 bg-teal-500 opacity-0 group-active:opacity-10 transition-opacity"></div>
            {icon}
        </button>
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest w-16 leading-tight">{label}</span>
    </div>
);

interface HomePageProps {
    setCurrentPage: (page: Page) => void;
    navigateToService: (serviceId: string) => void;
    setView: (view: string) => void;
    searchQuery: string;
    triggerSosFlow: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, navigateToService, setView, searchQuery, triggerSosFlow }) => {
    const { user } = useContext(UserContext);
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [pulse, setPulse] = useState<CityPulse | null>(null);
    const [aiBriefing, setAiBriefing] = useState<string>('');

    const [sosHoldProgress, setSosHoldProgress] = useState(0);
    const sosHoldTimeoutRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const holdStartTimeRef = useRef<number | null>(null);
    const HOLD_DURATION = 2000;

    useEffect(() => {
        const fetchData = async () => {
            const [anns, pulseData] = await Promise.all([
                mockApi.getAnnouncements(),
                mockApi.getCityPulse(user?.location.district || 'City')
            ]);
            setAnnouncements(anns);
            setPulse(pulseData);
            
            const briefing = await mockApi.getAiBriefing(user?.location.district || 'City', anns);
            setAiBriefing(briefing);
        };
        fetchData();
    }, [user]);

    const handleSosPressStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setSosHoldProgress(0);
        holdStartTimeRef.current = Date.now();
        const animateProgress = () => {
            if (!holdStartTimeRef.current) return;
            const progress = Math.min((Date.now() - holdStartTimeRef.current) / HOLD_DURATION, 1);
            setSosHoldProgress(progress);
            if (progress < 1) animationFrameRef.current = requestAnimationFrame(animateProgress);
        };
        animationFrameRef.current = requestAnimationFrame(animateProgress);
        sosHoldTimeoutRef.current = window.setTimeout(() => { triggerSosFlow(); setSosHoldProgress(0); }, HOLD_DURATION);
    };

    const handleSosPressEnd = () => {
        if (sosHoldTimeoutRef.current) clearTimeout(sosHoldTimeoutRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        holdStartTimeRef.current = null;
        setSosHoldProgress(0);
    };

    const emergencyServices = useMemo(() => [
        { icon: <PoliceIcon />, label: t('police'), onClick: () => showToast('Calling Police: 100') },
        { icon: <AmbulanceIcon />, label: t('ambulance'), onClick: () => showToast('Calling Ambulance: 108') },
        { icon: <FireDeptIcon />, label: t('fireDept'), onClick: () => showToast('Calling Fire Dept: 101') },
        { icon: <HospitalIcon />, label: t('hospitals'), onClick: () => setCurrentPage(Page.Map) },
        { icon: <NewReportIcon />, label: t('newReport'), onClick: () => setCurrentPage(Page.Report) },
    ], [t, showToast, setCurrentPage]);

    const medicalAidServices = useMemo(() => [
        { icon: <BloodBankIcon />, label: t('bloodBank'), onClick: () => navigateToService('findBloodBanks'), color: "bg-red-50 text-red-600" },
        { icon: <SyringeIcon className="w-7 h-7" />, label: t('bookVaccination'), onClick: () => navigateToService('bookVaccination'), color: "bg-blue-50 text-blue-600" },
        { icon: <PregnantWomanIcon className="w-7 h-7" />, label: t('momsCare'), onClick: () => navigateToService('momsCare'), color: "bg-pink-50 text-pink-600" },
        { icon: <AmbulanceIcon />, label: t('ambulance'), onClick: () => navigateToService('emergencyAmbulance'), color: "bg-orange-50 text-orange-600" },
    ], [t, navigateToService]);

    return (
        <div className="bg-slate-50 min-h-full pb-24">
            <div className="p-5 space-y-10 relative z-10">
                {/* AI Intelligence Core - Strictly 2 Lines */}
                {!searchQuery && (
                    <section className="animate-fadeInUp">
                        <div className="bg-slate-900 rounded-[2.5rem] p-7 text-white shadow-2xl relative overflow-hidden h-[160px] flex flex-col justify-center">
                             <div className="absolute top-0 right-0 p-6 opacity-5"><AiAssistantIcon className="w-24 h-24"/></div>
                             <div className="relative z-10">
                                <h2 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-3">AI Intelligence Core</h2>
                                <p className="text-xl font-bold leading-tight tracking-tight line-clamp-2 overflow-hidden">
                                    {aiBriefing || 'Analyzing municipal data streams...'}
                                </p>
                                <div className="mt-4 flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TN Smart Grid Online</span>
                                </div>
                             </div>
                        </div>
                    </section>
                )}

                {!searchQuery && (
                    <section className="animate-fadeInUp animation-delay-100">
                        <SectionHeader title="City Pulse" />
                        <CityPulseBar pulse={pulse} />
                    </section>
                )}

                {/* Medical Aid Row */}
                {!searchQuery && (
                    <section className="animate-fadeInUp animation-delay-200">
                        <SectionHeader title="Medical Aid In City" />
                        <div className="grid grid-cols-4 gap-x-2">
                             {medicalAidServices.map(service => <QuickServiceCard key={service.label} {...service} />)}
                        </div>
                    </section>
                )}
                
                <section className="animate-fadeInUp animation-delay-300">
                    <SectionHeader title={t('emergencyServices')} />
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-6 gap-x-3">
                         {emergencyServices.map(service => <QuickServiceCard key={service.label} {...service} />)}
                    </div>
                </section>

                <section className="animate-fadeInUp animation-delay-400">
                    <SectionHeader title={t('govtAnnouncements')} actionText={t('viewAll')} onActionClick={() => setView('allAnnouncements')} />
                    <div>
                        {announcements.slice(0, 2).map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
                    </div>
                </section>
            </div>

            {/* Strictly Fixed SOS FAB - Higher Z-Index */}
            <div className="fixed bottom-20 right-5 z-[70]">
                <button
                    onMouseDown={handleSosPressStart}
                    onTouchStart={handleSosPressStart}
                    onMouseUp={handleSosPressEnd}
                    onTouchEnd={handleSosPressEnd}
                    className="w-16 h-16 bg-red-600 text-white rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.5)] flex items-center justify-center focus:outline-none transition-transform active:scale-90"
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-red-400/30" stroke="currentColor" strokeWidth="6" cx="50" cy="50" r="46" fill="transparent" />
                        <circle
                            className="text-white transition-all duration-100"
                            stroke="currentColor" strokeWidth="6" strokeLinecap="round" cx="50" cy="50" r="46" fill="transparent"
                            strokeDasharray={2 * Math.PI * 46}
                            strokeDashoffset={(2 * Math.PI * 46) * (1 - sosHoldProgress)}
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <SOSIcon className="w-8 h-8 z-10 animate-pulse-sos" />
                </button>
            </div>
        </div>
    );
};

export default HomePage;