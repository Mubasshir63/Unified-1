
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import MapPage from './pages/MapPage';
import ReportPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';
import { UserContext } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationsProvider, useNotifications } from './contexts/NotificationsContext';
import type { User, DetailedReport, SOSAlert, SOSState } from './types';
import { Page, ReportStatus } from './types';
import Header from './components/Header';
import NotificationsPanel from './components/NotificationsPanel';
import { useTranslation } from './hooks/useTranslation';
import * as mockApi from './api/mockApi';
import { cloudCore } from './api/backendCore';
import { GoogleGenAI, LiveServerMessage, Blob, Modality } from '@google/genai';

// Import service detail pages
import GovtPortalsPage from './pages/services/GovtPortalsPage';
import ComplaintRegistrationPage from './pages/services/ComplaintRegistrationPage';
import WaterPowerPage from './pages/services/WaterPowerPage';
import TransportInfoPage from './pages/services/TransportInfoPage';
import WasteTrackerPage from './pages/services/WasteTrackerPage';
import MedicalHelpPage from './pages/services/MedicalHelpPage';
import LocalEventsPage from './pages/services/LocalEventsPage';
import VolunteerPage from './pages/services/VolunteerPage';
import DownloadCenterPage from './pages/services/DownloadCenterPage';
import GovtSchemesPage from './pages/services/GovtSchemesPage';
import LegalHelpPage from './pages/services/LegalHelpPage';
import AiAssistantModal from './components/AiAssistantModal';
import AadhaarServicesPage from './pages/services/AadhaarServicesPage';
import PassportSevaPage from './pages/services/PassportSevaPage';
import FindBloodBanksPage from './pages/services/FindBloodBanksPage';
import BookVaccinationPage from './pages/services/BookVaccinationPage';
import EmergencyAmbulancePage from './pages/services/EmergencyAmbulancePage';
import MetroCardRechargePage from './pages/services/MetroCardRechargePage';
import ParkingFinderPage from './pages/services/ParkingFinderPage';
import NewConnectionPage from './pages/services/NewConnectionPage';
import CommunityCentersPage from './pages/services/CommunityCentersPage';
import PropertyTaxPage from './pages/services/PropertyTaxPage';
import LandRecordsPage from './pages/services/LandRecordsPage';
import SchoolAdmissionsPage from './pages/services/SchoolAdmissionsPage';
import PublicLibrariesPage from './pages/services/PublicLibrariesPage';
import DigitalLockerPage from './pages/services/DigitalLockerPage';
import ServiceTransition from './components/ServiceTransition';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import CyberSafetyPage from './pages/services/CyberSafetyPage';
import MomsCarePage from './pages/services/MomsCarePage';

// Import sub-pages
import AllAnnouncementsPage from './pages/home/AllAnnouncementsPage';
import AllDonationsPage from './pages/home/AllDonationsPage';
import AllResolvedIssuesPage from './pages/home/AllResolvedIssuesPage';
import AllReportsPage from './pages/profile/AllReportsPage';
import SOSHistoryPage from './pages/profile/SOSHistoryPage';
import RequestMedicalHelpPage from './pages/profile/RequestMedicalHelpPage';
import EmergencyContactsPage from './pages/profile/EmergencyContactsPage';
import TrackApplicationsPage from './pages/profile/TrackApplicationsPage';
import ReportDetailModal from './components/ReportDetailModal';
import SOSDetailModal from './components/SOSDetailModal';
import EditProfileModal from './components/EditProfileModal';
import AccountSettingsPage from './pages/profile/AccountSettingsPage';
import AboutUsPage from './pages/profile/AboutUsPage';
import HelpAndSupportPage from './pages/profile/HelpAndSupportPage';
import SOSModal from './components/SOSModal';
import SecretWordListenerModal from './components/SecretWordListenerModal';
import GovtDashboardPage from './pages/gov/GovtDashboardPage';

// --- HELPER FOR VOICE ENCODING ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, _setCurrentPage] = useState<Page>(Page.Home);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [transitioningService, setTransitioningService] = useState<string | null>(null);
  const [activeHomePageView, setActiveHomePageView] = useState<string>('dashboard');
  const [activeProfilePageView, setActiveProfilePageView] = useState<string>('dashboard');
  const [modalReport, setModalReport] = useState<DetailedReport | null>(null);
  const [modalSosAlert, setModalSosAlert] = useState<SOSAlert | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [isVoiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [mapFilter, setMapFilter] = useState<string | null>(null);
  const [sosModalState, setSosModalState] = useState<{open: boolean, initialState: SOSState}>({open: false, initialState: 'idle'});
  const [isSecretWordListening, setIsSecretWordListening] = useState(false);
  
  const [reports, setReports] = useState<DetailedReport[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);

  const notifications = useNotifications();
  const { t } = useTranslation();

  // Voice Refs
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const listeningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- MISSION CRITICAL SYNC ENGINE ---
  useEffect(() => {
    // Initial Hydration
    setReports(cloudCore.getReports());
    setSosAlerts(cloudCore.getSOS());

    // Subscription for Real-time Cloud Events
    const unsubscribe = cloudCore.subscribe((event, data) => {
        setReports(cloudCore.getReports());
        setSosAlerts(cloudCore.getSOS());

        if (user?.role === 'official') {
            if (event === 'SOS_ALERT' && data.status === 'Active') {
                notifications.showToast(`🚨 MISSION CRITICAL: SOS ALERT from ${data.user.name.toUpperCase()}`);
                if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
            }
            if (event === 'NEW_ISSUE') {
                notifications.addNotification('New Issue Reported', `${data.title} requires review.`, Page.Home);
            }
        } else {
            // Citizen side notifications
            if (event === 'ISSUE_UPDATED' && data.status === ReportStatus.Resolved) {
                notifications.addNotification('Issue Resolved', `Your report "${data.title}" is now closed.`, Page.Profile);
            }
        }
    });

    return () => unsubscribe();
  }, [user, notifications]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewSOSAlert = async (video: string) => {
    if (!user) return;
    await cloudCore.createSOS(user, video);
    notifications.addNotification('SOS Active', 'Local Command Centers Alerted.', Page.Profile);
  };

  // --- SHAKE SOS LOGIC ---
  const stopVoiceListening = useCallback(() => {
    setIsSecretWordListening(false);
    if(scriptProcessorRef.current) { scriptProcessorRef.current.disconnect(); scriptProcessorRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') { audioContextRef.current.close().catch(console.error); audioContextRef.current = null; }
    if (sessionPromiseRef.current) { sessionPromiseRef.current.then(session => session.close()).catch(console.error); sessionPromiseRef.current = null; }
    if (listeningTimeoutRef.current) { clearTimeout(listeningTimeoutRef.current); listeningTimeoutRef.current = null; }
  }, []);

  const startVoiceListening = useCallback(async () => {
    if (!user || !user.sosSecretPhrase || isSecretWordListening) return;
    
    setIsSecretWordListening(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const source = audioContextRef.current.createMediaStreamSource(stream);
        scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    if(!scriptProcessorRef.current) return;
                    scriptProcessorRef.current.onaudioprocess = (ev) => {
                        const blob = createBlob(ev.inputBuffer.getChannelData(0));
                        sessionPromiseRef.current?.then(s => s.sendRealtimeInput({ media: blob }));
                    };
                    source.connect(scriptProcessorRef.current);
                    scriptProcessorRef.current.connect(audioContextRef.current!.destination);
                },
                onmessage: async (msg: LiveServerMessage) => {
                    const text = msg.serverContent?.inputTranscription?.text;
                    if (text && text.toLowerCase().includes(user.sosSecretPhrase!.toLowerCase())) {
                        stopVoiceListening();
                        notifications.showToast("SECRET PHRASE DETECTED!");
                        handleNewSOSAlert(''); // Trigger SOS immediately
                        setSosModalState({open: true, initialState: 'activated'});
                    }
                },
                onerror: () => stopVoiceListening(),
                onclose: () => stopVoiceListening(),
            },
            config: {
                inputAudioTranscription: {},
                responseModalities: [Modality.AUDIO],
                systemInstruction: "You are a silence-only emergency listener. Your only job is to provide real-time transcription of the user's speech. You do not talk back."
            },
        });

        // Auto-stop after 7 seconds
        listeningTimeoutRef.current = setTimeout(() => {
            if (isSecretWordListening) {
                stopVoiceListening();
                notifications.showToast("No secret phrase detected.");
            }
        }, 7000);

    } catch (err) {
        console.error("Mic Error:", err);
        stopVoiceListening();
    }
  }, [user, isSecretWordListening, stopVoiceListening, handleNewSOSAlert, notifications]);

  useEffect(() => {
    if (!user || !user.isSecretWordSosEnabled || !user.sosSecretPhrase) return;

    let lastShake = 0;
    const SHAKE_THRESHOLD = 15;

    const handleMotion = (event: DeviceMotionEvent) => {
        const acc = event.acceleration;
        if (!acc || !acc.x || !acc.y || !acc.z) return;
        
        const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
        if (magnitude > SHAKE_THRESHOLD) {
            const now = Date.now();
            if (now - lastShake > 1000) { // Throttle
                lastShake = now;
                if (!isSecretWordListening && !sosModalState.open) {
                    if (navigator.vibrate) navigator.vibrate(200);
                    startVoiceListening();
                }
            }
        }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [user, isSecretWordListening, startVoiceListening, sosModalState.open]);


  const setCurrentPage = (page: Page) => {
    if (page !== currentPage) {
      setActiveService(null);
      setActiveHomePageView('dashboard');
      setActiveProfilePageView('dashboard');
      setSearchQuery('');
    }
    _setCurrentPage(page);
  };

  const navigateToService = (serviceId: string) => {
    if (serviceId === 'fileNewReport') {
        setCurrentPage(Page.Report);
        return;
    }
    setTransitioningService(serviceId);
  };
  
  const handleTransitionEnd = (serviceId: string) => {
      _setCurrentPage(Page.Services);
      setActiveService(serviceId);
      setTransitioningService(null);
  };

  const handleLogin = async (id: string, pw: string) => {
    const loggedInUser = await mockApi.login(id, pw, 'citizen');
    if(loggedInUser) { setUser(loggedInUser); setCurrentPage(Page.Home); } 
    else notifications.showToast('Invalid citizen credentials.');
  };
  
  const handleRegister = async (userData: any) => {
    const newUser = await mockApi.register(userData);
    setUser(newUser); setCurrentPage(Page.Home);
  };

  const handleGovLogin = async (email: string, pw: string) => {
    const loggedInUser = await mockApi.login(email, pw, 'official');
    if(loggedInUser) setUser(loggedInUser);
    else notifications.showToast('Invalid government ID.');
  };
  
  const handleCreateNewIssue = async (newIssueData: any) => {
      if (!user) return;
      await cloudCore.createReport(newIssueData, user);
      notifications.showToast('Data pushed to UNIFIED Cloud.');
  };

  const handleUpdateReportStatus = async (id: number, status: ReportStatus) => {
    await cloudCore.updateReport(id, { status }, user?.name || 'Admin');
  };

  const handleAssignReport = async (id: number, officer: string) => {
    await cloudCore.updateReport(id, { assigned_to: { name: officer, id: officer, role: 'Officer' }, status: ReportStatus.UnderReview }, user?.name || 'Admin');
  };

  const handleSOSAction = async (id: number, action: 'Acknowledge' | 'Resolve') => {
    if (action === 'Resolve') await cloudCore.resolveSOS(id, user?.name || 'Official');
    else await cloudCore.updateReport(id, { status: ReportStatus.UnderReview }, user?.name || 'Official');
  };

  const userContextValue = useMemo(() => ({ user, setUser, logout: () => setUser(null) }), [user]);

  if (showSplash) return <SplashScreen />;
  if (transitioningService) return <ServiceTransition serviceKey={transitioningService} onTransitionEnd={() => handleTransitionEnd(transitioningService)} />;

  return (
    <UserContext.Provider value={userContextValue}>
      <div className="h-full bg-gray-50 text-gray-800 antialiased">
        {!user ? (
          <LoginPage onLogin={handleLogin} onGovLogin={handleGovLogin} onRegister={handleRegister} />
        ) : user.role === 'official' ? (
          <GovtDashboardPage 
            reports={reports} 
            onUpdateReportStatus={handleUpdateReportStatus} 
            onAssignReport={handleAssignReport} 
            alerts={sosAlerts} 
            onSOSAction={handleSOSAction} 
          />
        ) : (
          <div className="relative pb-16 h-dvh w-full flex flex-col">
            <Header user={user} unreadCount={notifications.unreadCount} searchQuery={searchQuery} onSearchChange={(e) => setSearchQuery(e.target.value)} onNotificationsClick={() => setNotificationsOpen(true)} onProfileClick={() => setCurrentPage(Page.Profile)} onAiAssistantClick={() => setAiAssistantOpen(true)} onVoiceAssistantClick={() => setVoiceAssistantOpen(true)} searchPlaceholder={t('searchPlaceholder')} searchDisabled={currentPage === Page.Report || (currentPage === Page.Map && !!mapFilter) || !!activeService} />
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} onNavigate={setCurrentPage} />
            <main className="flex-1 overflow-y-auto">
              <div key={currentPage + (activeService || '')} className="animate-page-enter h-full">
                {currentPage === Page.Home && (activeHomePageView === 'dashboard' ? <HomePage setCurrentPage={setCurrentPage} navigateToService={navigateToService} setView={setActiveHomePageView} searchQuery={searchQuery} triggerSosFlow={() => setSosModalState({open: true, initialState: 'countdown'})} /> : activeHomePageView === 'allAnnouncements' ? <AllAnnouncementsPage onBack={() => setActiveHomePageView('dashboard')} /> : activeHomePageView === 'allDonations' ? <AllDonationsPage onBack={() => setActiveHomePageView('dashboard')} /> : <AllResolvedIssuesPage onBack={() => setActiveHomePageView('dashboard')} />)}
                {currentPage === Page.Services && (
                    !activeService ? <ServicesPage onSelectService={navigateToService} setCurrentPage={setCurrentPage} searchQuery={searchQuery} /> :
                    activeService === 'govtPortals' ? <GovtPortalsPage onBack={() => setActiveService(null)} /> :
                    activeService === 'complaintRegistration' ? <ComplaintRegistrationPage onBack={() => setActiveService(null)} onCreateIssue={handleCreateNewIssue} /> :
                    activeService === 'waterPower' ? <WaterPowerPage onBack={() => setActiveService(null)} onCreateIssue={handleCreateNewIssue} /> :
                    activeService === 'transportInfo' ? <TransportInfoPage onBack={() => setActiveService(null)} /> :
                    activeService === 'wasteTracker' ? <WasteTrackerPage onBack={() => setActiveService(null)} onCreateIssue={handleCreateNewIssue} /> :
                    activeService === 'medicalHelp' ? <MedicalHelpPage onBack={() => setActiveService(null)} /> :
                    activeService === 'localEvents' ? <LocalEventsPage onBack={() => setActiveService(null)} /> :
                    activeService === 'volunteer' ? <VolunteerPage onBack={() => setActiveService(null)} /> :
                    activeService === 'downloadCenter' ? <DownloadCenterPage onBack={() => setActiveService(null)} /> :
                    activeService === 'govtSchemes' ? <GovtSchemesPage onBack={() => setActiveService(null)} /> :
                    activeService === 'legalHelp' ? <LegalHelpPage onBack={() => setActiveService(null)} onLaunchAiAssistant={() => setAiAssistantOpen(true)} /> :
                    activeService === 'aadhaarServices' ? <AadhaarServicesPage onBack={() => setActiveService(null)} /> :
                    activeService === 'passportSeva' ? <PassportSevaPage onBack={() => setActiveService(null)} /> :
                    activeService === 'findBloodBanks' ? <FindBloodBanksPage onBack={() => setActiveService(null)} /> :
                    activeService === 'bookVaccination' ? <BookVaccinationPage onBack={() => setActiveService(null)} /> :
                    activeService === 'emergencyAmbulance' ? <EmergencyAmbulancePage onBack={() => setActiveService(null)} /> :
                    activeService === 'metroCardRecharge' ? <MetroCardRechargePage onBack={() => setActiveService(null)} /> :
                    activeService === 'parkingFinder' ? <ParkingFinderPage onBack={() => setActiveService(null)} /> :
                    activeService === 'newConnection' ? <NewConnectionPage onBack={() => setActiveService(null)} /> :
                    activeService === 'communityCenters' ? <CommunityCentersPage onBack={() => setActiveService(null)} /> :
                    activeService === 'propertyTax' ? <PropertyTaxPage onBack={() => setActiveService(null)} /> :
                    activeService === 'landRecords' ? <LandRecordsPage onBack={() => setActiveService(null)} /> :
                    activeService === 'schoolAdmissions' ? <SchoolAdmissionsPage onBack={() => setActiveService(null)} /> :
                    activeService === 'publicLibraries' ? <PublicLibrariesPage onBack={() => setActiveService(null)} /> :
                    activeService === 'digitalLocker' ? <DigitalLockerPage onBack={() => setActiveService(null)} /> :
                    activeService === 'cyberSafety' ? <CyberSafetyPage onBack={() => setActiveService(null)} /> :
                    activeService === 'momsCare' ? <MomsCarePage onBack={() => setActiveService(null)} navigateToMapWithFilter={(f) => { setMapFilter(f); setCurrentPage(Page.Map); }} /> :
                    <ServicesPage onSelectService={navigateToService} setCurrentPage={setCurrentPage} searchQuery={searchQuery} />
                )}
                {currentPage === Page.Map && <MapPage userLocation={user.location} reports={reports} setCurrentPage={setCurrentPage} filter={mapFilter} onClearFilter={() => setMapFilter(null)} />}
                {currentPage === Page.Report && <ReportPage onAddNewReport={handleCreateNewIssue} />}
                {/* FIX: Replaced undefined 'syncDatabase' with a notification toast for medical help requests. */}
                {currentPage === Page.Profile && (activeProfilePageView === 'dashboard' ? <ProfilePage setView={setActiveProfilePageView} onEditProfileClick={() => setEditProfileOpen(true)} navigateToMapWithFilter={(f) => { setMapFilter(f); setCurrentPage(Page.Map); }} /> : activeProfilePageView === 'trackApplications' ? <TrackApplicationsPage onBack={() => setActiveProfilePageView('dashboard')} /> : activeProfilePageView === 'allReports' ? <AllReportsPage reports={reports} onBack={() => setActiveProfilePageView('dashboard')} onSelectReport={setModalReport} /> : activeProfilePageView === 'sosHistory' ? <SOSHistoryPage alerts={sosAlerts} onBack={() => setActiveProfilePageView('dashboard')} onSelectAlert={setModalSosAlert} /> : activeProfilePageView === 'requestMedicalHelp' ? <RequestMedicalHelpPage onBack={() => setActiveProfilePageView('dashboard')} onSubmit={() => notifications.showToast('Medical aid request submitted for review.')} /> : activeProfilePageView === 'emergencyContacts' ? <EmergencyContactsPage onBack={() => setActiveProfilePageView('dashboard')} /> : activeProfilePageView === 'accountSettings' ? <AccountSettingsPage onBack={() => setActiveProfilePageView('dashboard')} /> : activeProfilePageView === 'aboutUs' ? <AboutUsPage onBack={() => setActiveProfilePageView('dashboard')} /> : <HelpAndSupportPage onBack={() => setActiveProfilePageView('dashboard')} />}
              </div>
            </main>
            <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {modalReport && <ReportDetailModal report={modalReport} onClose={() => setModalReport(null)} />}
            {modalSosAlert && <SOSDetailModal alert={modalSosAlert} onClose={() => setModalSosAlert(null)} />}
            {isAiAssistantOpen && <AiAssistantModal onClose={() => setAiAssistantOpen(false)} />}
            {isVoiceAssistantOpen && <VoiceAssistantModal onClose={() => setVoiceAssistantOpen(false)} onCommand={(c) => { if(c.action === 'navigateToPage') setCurrentPage(c.payload.page); setVoiceAssistantOpen(false); }} />}
            {isEditProfileOpen && <EditProfileModal user={user} onClose={() => setEditProfileOpen(false)} onSave={(u) => { mockApi.updateUser(u); setUser(u); setEditProfileOpen(false); }} />}
            {sosModalState.open && <SOSModal onClose={() => setSosModalState({open: false, initialState: 'idle'})} initialState={sosModalState.initialState} onActivate={handleNewSOSAlert} />}
            {isSecretWordListening && <SecretWordListenerModal onCancel={stopVoiceListening} duration={7} />}
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <NotificationsProvider>
      <AppContent />
    </NotificationsProvider>
  </LanguageProvider>
);

export default App;
