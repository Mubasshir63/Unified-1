
import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Announcement, DonationRequest, ResolvedIssue, SOSState, CityPulse } from '../types';
import { ReportStatus, Page } from '../types';
import { 
    PoliceIcon, AmbulanceIcon, FireDeptIcon, BloodBankIcon, HospitalIcon, NewReportIcon, 
    CertificateIcon, PayBillsIcon, NewConnectionIcon, MyReportsIcon, CheckCircleIcon, SOSIcon, PhoneVibrateIcon, AiAssistantIcon
} from '../components/icons/NavIcons';
import OnboardingGuide from '../components/OnboardingGuide';
import * as mockApi from '../api/mockApi';

// --- SUB-COMPONENTS ---

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
                <div key={stat.label} className={`flex-shrink-0 min-w-[100px] p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center ${stat.bg} animate-fadeInUp`}>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{stat.label}</p>
                    <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[9px] font-semibold text-gray-400">{stat.sub}</p>
                </div>
            ))}
        </div>
    );
};

const SectionHeader: React.FC<{ title: string; actionText?: string; onActionClick?: () => void }> = ({ title, actionText, onActionClick }) => (
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {actionText && (
            <button onClick={onActionClick} className="text-sm font-semibold text-green-600 hover:text-green-700">
                {actionText}
            </button>
        )}
    </div>
);

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-3 transition-shadow duration-300 tilt-card">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-md leading-tight flex-1 pr-2">{announcement.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${announcement.status === ReportStatus.Emergency ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {announcement.status}
                    </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{announcement.content}</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                 <p className="text-xs text-gray-500 font-medium">{announcement.source}</p>
                 <p className="text-xs text-gray-500">{announcement.timestamp}</p>
            </div>
        </div>
    );
};

const DonationCard: React.FC<{ request: DonationRequest }> = ({ request }) => {
    const { showToast } = useNotifications();
    const percentage = Math.round((request.raised / request.goal) * 100);

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden min-w-[300px] snap-start flex-shrink-0 transform hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
            <img src={request.image} alt={request.title} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="font-bold text-gray-900">{request.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{request.patientName} at {request.hospital}</p>
                <div className="my-3">
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-medium text-gray-600">Raised: ₹{request.raised.toLocaleString('en-IN')}</span>
                        <span className="font-medium text-gray-600">Goal: ₹{request.goal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
                <button 
                    onClick={() => showToast('Redirecting to secure payment...')}
                    className="w-full mt-2 py-2.5 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 shadow-sm">
                    Donate Now
                </button>
            </div>
        </div>
    );
}

const ServiceCard: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, id?: string }> = ({ icon, label, onClick, id }) => (
    <div id={id} className="flex flex-col items-center space-y-2 text-center">
        <button 
            onClick={onClick}
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-700 transform hover:scale-105 hover:bg-green-100 hover:text-green-700 transition-all duration-200">
            {icon}
        </button>
        <span className="text-xs font-medium text-gray-700 w-16">{label}</span>
    </div>
);

const QuickLinkCard: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full bg-white rounded-xl p-4 flex items-center space-x-4 border border-gray-200 group text-left tilt-card">
    <div className="bg-gray-100 group-hover:bg-green-100 rounded-lg p-2.5 transition-colors text-green-600">
        {icon}
    </div>
    <div>
        <h3 className="font-semibold text-sm text-gray-800">{label}</h3>
    </div>
  </button>
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
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [donations, setDonations] = useState<DonationRequest[]>([]);
    const [resolvedIssues, setResolvedIssues] = useState<ResolvedIssue[]>([]);
    const [pulse, setPulse] = useState<CityPulse | null>(null);
    const [aiBriefing, setAiBriefing] = useState<string>('');

    // SOS Hold Logic
    const [sosHoldProgress, setSosHoldProgress] = useState(0);
    const sosHoldTimeoutRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const holdStartTimeRef = useRef<number | null>(null);
    const HOLD_DURATION = 2000;

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) setShowOnboarding(true);

        const fetchData = async () => {
            setIsLoading(true);
            const [anns, dons, resolved, pulseData] = await Promise.all([
                mockApi.getAnnouncements(),
                mockApi.getDonations(),
                mockApi.getResolvedIssues(),
                mockApi.getCityPulse(user?.location.district || 'City')
            ]);
            setAnnouncements(anns);
            setDonations(dons);
            setResolvedIssues(resolved);
            setPulse(pulseData);
            
            const briefing = await mockApi.getAiBriefing(user?.location.district || 'City', anns);
            setAiBriefing(briefing);
            setIsLoading(false);
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
        sosHoldTimeoutRef.current = window.setTimeout(() => {
            triggerSosFlow();
            setSosHoldProgress(0);
        }, HOLD_DURATION);
    };

    const handleSosPressEnd = () => {
        if (sosHoldTimeoutRef.current) clearTimeout(sosHoldTimeoutRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        holdStartTimeRef.current = null;
        setSosHoldProgress(0);
    };

    const emergencyServices = useMemo(() => [
        { icon: <PoliceIcon />, label: t('police'), onClick: () => showToast('Calling Police Emergency: 100') },
        { icon: <AmbulanceIcon />, label: t('ambulance'), onClick: () => showToast('Calling Ambulance Emergency: 108') },
        { icon: <FireDeptIcon />, label: t('fireDept'), onClick: () => showToast('Calling Fire Department: 101') },
        { icon: <BloodBankIcon />, label: t('bloodBank'), onClick: () => navigateToService('medicalHelp') },
        { icon: <HospitalIcon />, label: t('hospitals'), onClick: () => setCurrentPage(Page.Map) },
        { id: 'new-report-button', icon: <NewReportIcon />, label: t('newReport'), onClick: () => setCurrentPage(Page.Report) },
    ], [t, showToast, setCurrentPage, navigateToService]);
    
    const quickLinks = useMemo(() => [
        { icon: <CertificateIcon />, label: 'Certificates', onClick: () => navigateToService('downloadCenter') },
        { icon: <PayBillsIcon />, label: 'Pay Bills', onClick: () => navigateToService('waterPower') },
        { icon: <NewConnectionIcon />, label: 'New Connection', onClick: () => navigateToService('waterPower') },
        { icon: <MyReportsIcon />, label: t('myReports'), onClick: () => setCurrentPage(Page.Profile) },
    ], [t, setCurrentPage, navigateToService]);

    return (
        <div className="bg-gray-50 min-h-full">
            {showOnboarding && <OnboardingGuide onFinish={() => { localStorage.setItem('hasSeenOnboarding', 'true'); setShowOnboarding(false); }} />}
            
            <div className="p-4 space-y-8">
                {/* AI City Briefing */}
                {!searchQuery && (
                    <section className="animate-fadeInUp">
                        <div className="bg-gradient-to-br from-teal-600 to-green-700 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-20"><AiAssistantIcon className="w-20 h-20"/></div>
                             <div className="relative z-10">
                                <h2 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Morning Briefing</h2>
                                <p className="text-lg font-bold leading-tight">
                                    {aiBriefing || 'Generating your city summary...'}
                                </p>
                             </div>
                        </div>
                    </section>
                )}

                {/* City Pulse (Live Health) */}
                {!searchQuery && (
                    <section className="animate-fadeInUp animation-delay-100">
                        <SectionHeader title="City Pulse" />
                        <CityPulseBar pulse={pulse} />
                    </section>
                )}
                
                {/* Emergency Services */}
                <section className="animate-fadeInUp animation-delay-150">
                    <SectionHeader title={t('emergencyServices')} />
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-4 gap-x-2">
                         {emergencyServices.map(service => <ServiceCard key={service.label} {...service} />)}
                    </div>
                </section>

                {/* Announcements */}
                <section className="animate-fadeInUp animation-delay-300">
                    <SectionHeader title={t('govtAnnouncements')} actionText={t('viewAll')} onActionClick={() => setView('allAnnouncements')} />
                    <div>
                        {announcements.slice(0, 2).map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
                    </div>
                </section>
                
                {/* Urgent Medical Needs */}
                <section className="animate-fadeInUp animation-delay-400">
                     <SectionHeader title={t('urgentMedicalNeeds')} actionText={t('seeMore')} onActionClick={() => setView('allDonations')} />
                     <div className="flex space-x-4 overflow-x-auto pb-3 snap-x -mx-4 px-4 no-scrollbar">
                        {donations.map(req => <DonationCard key={req.id} request={req} />)}
                     </div>
                </section>
                
                {/* Quick Links */}
                <section className="animate-fadeInUp animation-delay-500">
                    <SectionHeader title={t('quickLinks')} />
                    <div className="grid grid-cols-2 gap-3">
                         {quickLinks.map(link => <QuickLinkCard key={link.label} {...link} />)}
                    </div>
                </section>

                {/* Security Feature Info */}
                <section className="animate-fadeInUp animation-delay-600">
                    <div className="bg-blue-50 border-2 border-blue-200/50 rounded-2xl p-4 flex items-start space-x-4">
                        <div className="flex-shrink-0 text-blue-600 pt-1">
                            <PhoneVibrateIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900">Next-Gen: Shake for SOS</h3>
                            <p className="text-sm text-blue-800/90 mt-1">
                                Discretely alert command centers by shaking your phone vigorously 3 times. Enable in Profile.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* SOS Floating Action Button */}
            <button
                onMouseDown={handleSosPressStart}
                onTouchStart={handleSosPressStart}
                onMouseUp={handleSosPressEnd}
                onTouchEnd={handleSosPressEnd}
                onMouseLeave={handleSosPressEnd}
                className="fixed bottom-20 right-4 z-30 w-16 h-16 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none animate-pulse-sos"
                aria-label="Hold for SOS"
            >
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-red-400/50" stroke="currentColor" strokeWidth="8" cx="50" cy="50" r="46" fill="transparent" />
                    <circle
                        className="text-white transition-all duration-100 linear"
                        stroke="currentColor" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="46" fill="transparent"
                        strokeDasharray={2 * Math.PI * 46}
                        strokeDashoffset={(2 * Math.PI * 46) * (1 - sosHoldProgress)}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <SOSIcon className="w-8 h-8 z-10" />
            </button>
        </div>
    );
};

export default HomePage;
